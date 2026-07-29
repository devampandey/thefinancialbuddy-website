import { cookies } from "next/headers";
import { READER_SESSION_COOKIE, verifyReaderSessionToken } from "./readerAuth";

// Shared by every reader-facing Route Handler / Server Component that
// needs to know if a visitor is signed in.
export async function getReaderSession() {
  const token = cookies().get(READER_SESSION_COOKIE)?.value;
  return verifyReaderSessionToken(token);
}
