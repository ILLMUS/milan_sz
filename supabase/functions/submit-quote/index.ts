import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // or your Netlify URL for stricter CORS
  "Access-Control-Allow-Headers":
    "Authorization, Content-Type, x-client-info, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const contactSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  businessName: z.string().trim().min(2).max(150),
  phone: z.string().trim().min(7).max(20).regex(/^[+\d\s()-]+$/),
  email: z.string().trim().email().max(255),
  establishmentType: z.string().min(1),
  productsInterested: z.string().max(500).optional().default(""),
  estimatedQuantity: z.string().max(100).optional().default(""),
  message: z.string().max(2000).optional().default(""),
});

serve(async (req) => {
  // Handle preflight OPTIONS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = parsed.data;

    // Airtable integration
    const AIRTABLE_API_KEY = Deno.env.get("AIRTABLE_API_KEY");
    const AIRTABLE_BASE_ID = Deno.env.get("AIRTABLE_BASE_ID");
    const AIRTABLE_TABLE_NAME = Deno.env.get("AIRTABLE_TABLE_NAME") || "Quote Requests";

    if (AIRTABLE_API_KEY && AIRTABLE_BASE_ID) {
      const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;

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

      if (!airtableResponse.ok) {
        const errBody = await airtableResponse.text();
        console.error(`Airtable error [${airtableResponse.status}]: ${errBody}`);
        return new Response(
          JSON.stringify({ error: "Failed to save to Airtable" }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing quote submission:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});