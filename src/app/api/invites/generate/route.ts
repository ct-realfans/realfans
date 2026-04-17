import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateInviteMessage } from "@/lib/ai";
import { getCustomerById, getStore } from "@/lib/data";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  customerId: z.string(),
  channel: z.enum(["line", "sms", "email"]),
  extraNote: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { customerId, channel, extraNote } = parsed.data;

  const [customer, store] = await Promise.all([
    getCustomerById(customerId),
    getStore(),
  ]);
  if (!customer) {
    return NextResponse.json({ error: "customer_not_found" }, { status: 404 });
  }

  const result = await generateInviteMessage({
    customerName: customer.name,
    channel,
    storeName: store.name,
    brandVoice: store.brandVoice,
    visitNotes: [customer.notes, extraNote].filter(Boolean).join("；"),
    tags: customer.tags,
    totalVisits: customer.visits,
    reviewLink: store.linkReview,
  });

  return NextResponse.json({
    message: result.message,
    model: result.model,
    customerId,
    channel,
  });
}
