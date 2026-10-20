
const MAX_BODY_BYTES = 12_000;

const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  },
  body: JSON.stringify(payload),
});

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

const isValidEmail = (value) =>
  typeof value === "string" &&
  value.length <= 255 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const cleanText = (value, maxLength) =>
  typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      ...jsonResponse(405, {
        success: false,
        error: "Method not allowed.",
      }),
      headers: {
        ...jsonResponse(405, {}).headers,
        Allow: "POST",
      },
    };
  }

  const origin = event.headers?.origin;
  const host = event.headers?.host;
  const allowedOrigins = (
    process.env.CONTACT_ALLOWED_ORIGINS || ""
  )
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  // Reject cross-origin browser submissions unless explicitly allowed.
  // Configure CONTACT_ALLOWED_ORIGINS for your production domain.
  if (origin) {
    let originUrl;

    try {
      originUrl = new URL(origin);
    } catch {
      return jsonResponse(403, {
        success: false,
        error: "Request origin not allowed.",
      });
    }

    const sameHost =
      host &&
      originUrl.host.toLowerCase() === host.toLowerCase();

    const explicitlyAllowed = allowedOrigins.some(
      (allowed) => originUrl.origin === allowed
    );

    if (!sameHost && !explicitlyAllowed) {
      return jsonResponse(403, {
        success: false,
        error: "Request origin not allowed.",
      });
    }
  }

  const contentType =
    event.headers?.["content-type"] ||
    event.headers?.["Content-Type"] ||
    "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return jsonResponse(415, {
      success: false,
      error: "Content-Type must be application/json.",
    });
  }

  const rawBody = event.body || "";

  if (
    Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES
  ) {
    return jsonResponse(413, {
      success: false,
      error: "Submission is too large.",
    });
  }

  let body;

  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonResponse(400, {
      success: false,
      error: "Invalid request body.",
    });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonResponse(400, {
      success: false,
      error: "Invalid request body.",
    });
  }

  // Honeypot: silently accept bot submissions without sending email.
  // This field is a basic deterrent, not complete spam protection.
  if (typeof body.website === "string" && body.website.trim()) {
    return jsonResponse(200, { success: true });
  }

  const fullName = cleanText(body.fullName, 100);
  const businessName = cleanText(body.businessName, 150);
  const phone = cleanText(body.phone, 20);
  const email = cleanText(body.email, 255);
  const establishmentType = cleanText(
    body.establishmentType,
    50
  );
  const productsInterested = cleanText(
    body.productsInterested,
    500
  );
  const estimatedQuantity = cleanText(
    body.estimatedQuantity,
    100
  );
  const message = cleanText(body.message, 2000);

  const validEstablishmentTypes = [
    "Guesthouse",
    "Airbnb",
    "Lodge",
    "Hotel",
    "Bed & Breakfast",
    "Resort",
    "Other",
  ];

  if (fullName.length < 2 || businessName.length < 2) {
    return jsonResponse(400, {
      success: false,
      error: "Please provide your name and business name.",
    });
  }

  if (
    !phone ||
    phone.length < 7 ||
    !/^[+\d\s()-]+$/.test(phone)
  ) {
    return jsonResponse(400, {
      success: false,
      error: "Please provide a valid phone number.",
    });
  }

  if (!isValidEmail(email)) {
    return jsonResponse(400, {
      success: false,
      error: "Please provide a valid email address.",
    });
  }

  if (!validEstablishmentTypes.includes(establishmentType)) {
    return jsonResponse(400, {
      success: false,
      error: "Please select a valid establishment type.",
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_TO_EMAIL;
  const sender = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !recipient || !sender) {
    console.error("Contact function configuration is incomplete.");

    return jsonResponse(500, {
      success: false,
      error: "Email service is not configured yet.",
    });
  }

  if (!isValidEmail(recipient)) {
    console.error("CONTACT_TO_EMAIL is invalid.");

    return jsonResponse(500, {
      success: false,
      error: "Email service configuration is invalid.",
    });
  }

  const subject = `New Quote Request - ${businessName}`;

  const rows = [
    ["Full name", fullName],
    ["Business name", businessName],
    ["Establishment type", establishmentType],
    ["Phone", phone],
    ["Email", email],
    ["Products interested in", productsInterested || "Not specified"],
    ["Estimated quantity", estimatedQuantity || "Not specified"],
    ["Message", message || "No additional message"],
  ];

  const text = [
    "New quote request from milanszsupplies.com",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#222">
      <h2 style="color:#9a762b">New Quote Request</h2>
      <p>A customer submitted a quote request through Milan SZ Supplies.</p>
      <table style="width:100%;border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <th style="padding:10px;border:1px solid #ddd;text-align:left;vertical-align:top">
                  ${escapeHtml(label)}
                </th>
                <td style="padding:10px;border:1px solid #ddd;white-space:pre-wrap;overflow-wrap:anywhere">
                  ${escapeHtml(value)}
                </td>
              </tr>
            `
          )
          .join("")}
      </table>
    </div>
  `;

  try {
    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: sender,
          to: [recipient],
          reply_to: email,
          subject,
          text,
          html,
        }),
        signal: AbortSignal.timeout(12_000),
      }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.id) {
      // Do not log customer details or API credentials.
      console.error(
        "Email provider rejected contact submission.",
        { status: response.status }
      );

      return jsonResponse(502, {
        success: false,
        error: "We could not send your enquiry. Please try again later.",
      });
    }

    return jsonResponse(200, {
      success: true,
      message: "Your enquiry has been accepted for email processing.",
    });
  } catch {
    console.error("Email provider request failed.");

    return jsonResponse(502, {
      success: false,
      error: "Email service is temporarily unavailable. Please try again.",
    });
  }
};
