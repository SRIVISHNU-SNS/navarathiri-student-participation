import { describe, expect, it } from "vitest";
import { createAdminSession, isValidAdminSession, safePinMatches } from "./auth";

const secret = "a-test-session-signing-key-with-enough-random-bytes";

describe("organiser session", () => {
  it("accepts only an exact six-digit code", () => {
    expect(safePinMatches("123456", "123456")).toBe(true);
    expect(safePinMatches("123455", "123456")).toBe(false);
    expect(safePinMatches("1234567", "123456")).toBe(false);
  });

  it("accepts a signed token until expiry", () => {
    const now = 1_800_000_000_000;
    const token = createAdminSession(secret, now);
    expect(isValidAdminSession(token, secret, now + 10_000)).toBe(true);
    expect(isValidAdminSession(token, secret, now + 8 * 60 * 60 * 1000)).toBe(false);
  });

  it("rejects a modified token, wrong key and malformed values", () => {
    const token = createAdminSession(secret, 1_800_000_000_000);
    expect(isValidAdminSession(`${token}x`, secret)).toBe(false);
    expect(isValidAdminSession(token, "another-session-key-with-more-than-32-characters")).toBe(false);
    expect(isValidAdminSession("not.a.valid.token", secret)).toBe(false);
    expect(isValidAdminSession(undefined, secret)).toBe(false);
  });
});
