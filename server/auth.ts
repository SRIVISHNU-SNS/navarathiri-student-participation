import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const adminCookieName = "navarathiri_admin";
export const adminSessionTtlSeconds = 8 * 60 * 60;

function equalBytes(left: Buffer, right: Buffer) {
  return left.length === right.length && timingSafeEqual(left, right);
}

export function safePinMatches(candidate: string, expected: string) {
  return equalBytes(Buffer.from(candidate, "utf8"), Buffer.from(expected, "utf8"));
}

export function createAdminSession(secret: string, now = Date.now()) {
  const payload = Buffer.from(
    JSON.stringify({ expiresAt: now + adminSessionTtlSeconds * 1000, nonce: randomBytes(16).toString("base64url") }),
  ).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function isValidAdminSession(token: string | undefined, secret: string, now = Date.now()) {
  if (!token) return false;
  const separator = token.indexOf(".");
  if (separator < 1 || separator !== token.lastIndexOf(".")) return false;
  const payload = token.slice(0, separator);
  const suppliedSignature = token.slice(separator + 1);
  const expectedSignature = createHmac("sha256", secret).update(payload).digest("base64url");
  if (!equalBytes(Buffer.from(suppliedSignature), Buffer.from(expectedSignature))) return false;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { expiresAt?: unknown };
    return (
      typeof parsed.expiresAt === "number" &&
      Number.isSafeInteger(parsed.expiresAt) &&
      parsed.expiresAt > now &&
      parsed.expiresAt <= now + adminSessionTtlSeconds * 1000 + 60_000
    );
  } catch {
    return false;
  }
}

export function sessionCookie(token: string, secure: boolean) {
  return `${adminCookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${adminSessionTtlSeconds}${secure ? "; Secure" : ""}`;
}

export function clearedSessionCookie(secure: boolean) {
  return `${adminCookieName}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? "; Secure" : ""}`;
}

export function readAdminCookie(cookieHeader: string | undefined) {
  if (!cookieHeader) return undefined;
  const prefix = `${adminCookieName}=`;
  const value = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  return value?.slice(prefix.length) || undefined;
}
