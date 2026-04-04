import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const contactSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  businessName: z.string().trim().min(2).max(150),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(20)
    .regex(/^[+\d\s()-]+$/),
  email: z.string().trim().email().max(255),
  establishmentType: z.string().min(1),
  productsInterested: z.string().max(500).optional().default(""),
  estimatedQuantity: z.string().max(100).optional().default(""),
  message: z.string().max(2000).optional().default(""),
});

serve(async (req) => {
  // ✅ FIX 1: Proper preflight response
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // ✅ FIX 2: Ensure request method is POST
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const data = parsed.data;

    // --- Airtable Integration ---
    const AIRTABLE_API_KEY = Deno.env.get("AIRTABLE_API_KEY");
    const AIRTABLE_BASE_ID = Deno.env.get("AIRTABLE_BASE_ID");
    const AIRTABLE_TABLE_NAME =
      Deno.env.get("AIRTABLE_TABLE_NAME") || "Quote Requests";

    if (AIRTABLE_API_KEY && AIRTABLE_BASE_ID) {
      const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
        AIRTABLE_TABLE_NAME
      )}`;

      const airtableResponse = await fetch(airtableUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Full Name": data.fullName,
            "Business Name": data.businessName,
            "Phone": data.phone,
            "Email": data.email,
            "Establishment Type": data.establishmentType,
            "Products Interested": data.productsInterested,
            "Estimated Quantity": data.estimatedQuantity,
            "Message": data.message,
            "Submitted At": new Date().toISOString(),
          },
        }),
      });

      // ✅ FIX 3: Always handle Airtable response properly
      if (!airtableResponse.ok) {
        const errBody = await airtableResponse.text();
        console.error(
          `Airtable error [${airtableResponse.status}]: ${errBody}`
        );

        return new Response(
          JSON.stringify({
            error: "Failed to save to Airtable",
            details: errBody,
          }),
          {
            status: 502,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      console.log("✅ Airtable record created successfully");
    } else {
      console.log(
        "⚠️ Airtable not configured — skipping. Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID."
      );
    }

    // ✅ FIX 4: Always return clean success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Quote submitted successfully",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("❌ Error processing quote submission:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        error: message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});