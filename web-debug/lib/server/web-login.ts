import { timingSafeEqual } from "node:crypto"

export const WEB_LOGIN_SESSION_COOKIE = "gsd_web_session"
const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 12 // 12h

export interface WebLoginConfig {
  enabled: boolean
  username: string
  password: string | null
  sessionToken: string | null
  sessionTtlSeconds: number
  secureCookies: boolean
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function parseBool(value: string | undefined): boolean {
  if (!value) return false
  const normalized = value.trim().toLowerCase()
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on"
}

function normalizeUsername(value: string | undefined): string {
  const username = value?.trim()
  return username && username.length > 0 ? username : "owner"
}

export function getWebLoginConfig(): WebLoginConfig {
  const password = process.env.GSD_WEB_LOGIN_PASSWORD?.trim() ?? ""
  const enabled = password.length > 0

  const username = normalizeUsername(process.env.GSD_WEB_LOGIN_USERNAME ?? process.env.USER)

  // Fallback to GSD_WEB_AUTH_TOKEN for local dev setups that do not go through
  // `gsd --web` launch wiring. In normal launch flow, web-mode sets a distinct
  // random session token per instance.
  const sessionToken =
    process.env.GSD_WEB_LOGIN_SESSION_TOKEN?.trim() ||
    process.env.GSD_WEB_AUTH_TOKEN?.trim() ||
    null

  return {
    enabled,
    username,
    password: enabled ? password : null,
    sessionToken: enabled ? sessionToken : null,
    sessionTtlSeconds: parsePositiveInt(process.env.GSD_WEB_LOGIN_SESSION_TTL_SECONDS, DEFAULT_SESSION_TTL_SECONDS),
    secureCookies: parseBool(process.env.GSD_WEB_SECURE_COOKIES) || process.env.NODE_ENV === "production",
  }
}

export function constantTimeEqual(left: string, right: string): boolean {
  const leftBuf = Buffer.from(left)
  const rightBuf = Buffer.from(right)
  if (leftBuf.length !== rightBuf.length) return false
  return timingSafeEqual(leftBuf, rightBuf)
}

export function parseCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null
  const parts = cookieHeader.split(";")
  for (const rawPart of parts) {
    const part = rawPart.trim()
    if (!part) continue
    const separator = part.indexOf("=")
    if (separator <= 0) continue
    const key = part.slice(0, separator).trim()
    if (key !== name) continue
    const value = part.slice(separator + 1)
    try {
      return decodeURIComponent(value)
    } catch {
      return value
    }
  }
  return null
}

export function isWebLoginAuthenticated(request: Request, config = getWebLoginConfig()): boolean {
  if (!config.enabled) return true
  if (!config.sessionToken) return false
  const cookieValue = parseCookieValue(request.headers.get("cookie"), WEB_LOGIN_SESSION_COOKIE)
  if (!cookieValue) return false
  return constantTimeEqual(cookieValue, config.sessionToken)
}

export function buildSessionCookie(config = getWebLoginConfig()): string {
  if (!config.sessionToken) {
    throw new Error("GSD web login session token is missing")
  }

  const parts = [
    `${WEB_LOGIN_SESSION_COOKIE}=${encodeURIComponent(config.sessionToken)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${config.sessionTtlSeconds}`,
  ]

  if (config.secureCookies) {
    parts.push("Secure")
  }

  return parts.join("; ")
}

export function buildClearSessionCookie(config = getWebLoginConfig()): string {
  const parts = [
    `${WEB_LOGIN_SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
  ]

  if (config.secureCookies) {
    parts.push("Secure")
  }

  return parts.join("; ")
}
