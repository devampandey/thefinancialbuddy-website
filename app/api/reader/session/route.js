import { NextResponse } from "next/server";
import { getReaderSession } from "@/lib/readerSession";

// Lets client components (e.g. the header account icon, bookmark button)
// check whether a visitor is currently signed in as a reader.
export async function GET() {
  const session = await getReaderSession();
  if (!session) return NextResponse.json({ signedIn: false });
  return NextResponse.json({ signedIn: true, email: session.email, name: session.name });
}
