import { NextRequest, NextResponse } from "next/server";

const PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY   = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  // simple fetch to Supabase REST
  const res = await fetch(`${PROJECT_URL}/rest/v1/waitlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) return NextResponse.json({ error: "DB error" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
