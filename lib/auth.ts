import { createHash } from "crypto";

export const AUTH_COOKIE = "mj-auth";

export function expectedToken(): string {
  const pw = process.env.APP_PASSWORD;
  if (!pw) throw new Error("APP_PASSWORD not set");
  return createHash("sha256").update(pw).digest("hex");
}

export function verifyPassword(input: string): boolean {
  if (!process.env.APP_PASSWORD) return false;
  return input === process.env.APP_PASSWORD;
}

export function verifyBotToken(authHeader: string | null): boolean {
  if (!process.env.BOT_TOKEN) return false;
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, "");
  return token === process.env.BOT_TOKEN;
}
