import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getIndustryConfig, isIndustryId, type IndustryId } from "@/lib/industry";

type CreateProductBody = {
  name?: string;
  model?: string;
  manufacturer?: string;
  industry?: string;
  attributes?: Record<string, unknown>;
  passcode?: string;
};

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const expectedPasscode = process.env.DEMO_PASSCODE;
    if (!expectedPasscode) {
      return NextResponse.json(
        { error: "Server configuration error: DEMO_PASSCODE is not set." },
        { status: 500 }
      );
    }

    let body: CreateProductBody;
    try {
      body = (await request.json()) as CreateProductBody;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const passcode = asTrimmedString(body.passcode);
    if (passcode !== expectedPasscode) {
      return NextResponse.json({ error: "Invalid passcode." }, { status: 401 });
    }

    const name = asTrimmedString(body.name);
    const model = asTrimmedString(body.model);
    const manufacturer = asTrimmedString(body.manufacturer);

    if (!name || !model || !manufacturer) {
      return NextResponse.json(
        { error: "Name, model, and manufacturer are required." },
        { status: 400 }
      );
    }

    const industryId: IndustryId = isIndustryId(body.industry) ? body.industry : "electronics";
    const industry = getIndustryConfig(industryId);

    const rawAttributes = body.attributes && typeof body.attributes === "object" && !Array.isArray(body.attributes)
      ? (body.attributes as Record<string, unknown>)
      : {};

    const attributes: Record<string, unknown> = { industry: industryId };
    for (const field of industry.productFields) {
      const value = rawAttributes[field.key];
      if (value === undefined || value === null) continue;
      if (field.type === "number") {
        if (value === "") continue;
        const num = typeof value === "number" ? value : Number(value);
        if (Number.isNaN(num)) {
          return NextResponse.json(
            { error: `Invalid number for field "${field.label}".` },
            { status: 400 }
          );
        }
        attributes[field.key] = num;
      } else {
        const str = String(value).trim();
        if (str !== "") attributes[field.key] = str;
      }
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .insert({ name, model, manufacturer, attributes })
      .select("id, name, model, manufacturer, attributes, created_at")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: `Failed to create product: ${error?.message ?? "Unknown database error"}.` },
        { status: 500 }
      );
    }

    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
    return NextResponse.json({
      product: data,
      passportUrl: baseUrl ? `${baseUrl}/passport/${data.id}` : `/passport/${data.id}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
