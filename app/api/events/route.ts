import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { industryConfig } from "@/lib/industry";

type CreateEventBody = {
  product_id?: string;
  event_type?: string;
  actor?: string;
  location?: string;
  notes?: string;
  passcode?: string;
};

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    const expectedPasscode = process.env.DEMO_PASSCODE;
    if (!expectedPasscode) {
      return NextResponse.json(
        { error: "Server configuration error: DEMO_PASSCODE is not set." },
        { status: 500 }
      );
    }

    let body: CreateEventBody;
    try {
      body = (await request.json()) as CreateEventBody;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const passcode = asTrimmedString(body.passcode);
    if (passcode !== expectedPasscode) {
      return NextResponse.json({ error: "Invalid passcode." }, { status: 401 });
    }

    const productId = asTrimmedString(body.product_id);
    const eventType = asTrimmedString(body.event_type);
    const actor = asTrimmedString(body.actor);
    const location = asTrimmedString(body.location);
    const notes = asTrimmedString(body.notes);

    if (!productId || !UUID_RE.test(productId)) {
      return NextResponse.json({ error: "A valid product ID is required." }, { status: 400 });
    }
    if (!eventType) {
      return NextResponse.json({ error: "Event type is required." }, { status: 400 });
    }
    if (!actor) {
      return NextResponse.json({ error: "Actor is required." }, { status: 400 });
    }

    const allowedTypes = new Set(industryConfig.eventTypes.map((t) => t.value));
    if (!allowedTypes.has(eventType)) {
      return NextResponse.json(
        { error: "Invalid event type for the current industry configuration." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("id", productId)
      .maybeSingle();

    if (productError) {
      return NextResponse.json(
        { error: `Failed to verify product: ${productError.message}` },
        { status: 500 }
      );
    }
    if (!product) {
      return NextResponse.json({ error: "Product not found for the provided ID." }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("events")
      .insert({
        product_id: productId,
        event_type: eventType,
        actor,
        location: location || null,
        notes: notes || null,
        attributes: {},
      })
      .select("id, product_id, event_type, actor, location, notes, attributes, created_at")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: `Failed to create event: ${error?.message ?? "Unknown database error"}.` },
        { status: 500 }
      );
    }

    return NextResponse.json({ event: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
