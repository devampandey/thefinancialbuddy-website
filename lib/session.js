import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

// Shared by every Route Handler and Server Component under /admin that
// needs to know who's logged in. Middleware already guarantees a valid
// session exists before these run, but each call site re-verifies anyway
// (defense in depth, and it's cheap).
export async function getSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}
