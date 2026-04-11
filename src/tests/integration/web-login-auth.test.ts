import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"

import {
  WEB_LOGIN_SESSION_COOKIE,
  buildSessionCookie,
  getWebLoginConfig,
  isWebLoginAuthenticated,
} from "../../../web/lib/server/web-login.ts"

const projectRoot = process.cwd()

function withEnv(overrides: Record<string, string | undefined>, fn: () => void): void {
  const previous: Record<string, string | undefined> = {}
  for (const [key, value] of Object.entries(overrides)) {
    previous[key] = process.env[key]
    if (value === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }

  try {
    fn()
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = value
      }
    }
  }
}

test("web login config is disabled when no password is configured", () => {
  withEnv(
    {
      GSD_WEB_LOGIN_PASSWORD: undefined,
      GSD_WEB_LOGIN_USERNAME: undefined,
      GSD_WEB_LOGIN_SESSION_TOKEN: undefined,
      GSD_WEB_AUTH_TOKEN: "fallback-token",
    },
    () => {
      const config = getWebLoginConfig()
      assert.equal(config.enabled, false)
      assert.equal(config.password, null)
      assert.equal(config.sessionToken, null)
    },
  )
})

test("web login config uses configured username and session token", () => {
  withEnv(
    {
      GSD_WEB_LOGIN_PASSWORD: "super-secret",
      GSD_WEB_LOGIN_USERNAME: "owner-user",
      GSD_WEB_LOGIN_SESSION_TOKEN: "session-123",
      GSD_WEB_LOGIN_SESSION_TTL_SECONDS: "600",
      GSD_WEB_SECURE_COOKIES: "1",
    },
    () => {
      const config = getWebLoginConfig()
      assert.equal(config.enabled, true)
      assert.equal(config.username, "owner-user")
      assert.equal(config.sessionToken, "session-123")
      assert.equal(config.sessionTtlSeconds, 600)
      assert.equal(config.secureCookies, true)
    },
  )
})

test("isWebLoginAuthenticated validates session cookie", () => {
  withEnv(
    {
      GSD_WEB_LOGIN_PASSWORD: "super-secret",
      GSD_WEB_LOGIN_USERNAME: "owner-user",
      GSD_WEB_LOGIN_SESSION_TOKEN: "session-abc",
    },
    () => {
      const okRequest = new Request("http://localhost/api/boot", {
        headers: { cookie: `${WEB_LOGIN_SESSION_COOKIE}=session-abc` },
      })
      const badRequest = new Request("http://localhost/api/boot", {
        headers: { cookie: `${WEB_LOGIN_SESSION_COOKIE}=wrong` },
      })

      assert.equal(isWebLoginAuthenticated(okRequest), true)
      assert.equal(isWebLoginAuthenticated(badRequest), false)
    },
  )
})

test("buildSessionCookie produces httpOnly strict cookie", () => {
  withEnv(
    {
      GSD_WEB_LOGIN_PASSWORD: "super-secret",
      GSD_WEB_LOGIN_SESSION_TOKEN: "session-abc",
      GSD_WEB_LOGIN_SESSION_TTL_SECONDS: "1200",
      GSD_WEB_SECURE_COOKIES: "1",
    },
    () => {
      const cookie = buildSessionCookie()
      assert.match(cookie, /^gsd_web_session=/)
      assert.match(cookie, /HttpOnly/)
      assert.match(cookie, /SameSite=Strict/)
      assert.match(cookie, /Max-Age=1200/)
      assert.match(cookie, /Secure/)
    },
  )
})

test("proxy enforces optional login session gate", () => {
  const proxySource = readFileSync(join(projectRoot, "web", "proxy.ts"), "utf-8")
  assert.match(proxySource, /GSD_WEB_LOGIN_PASSWORD/)
  assert.match(proxySource, /gsd_web_session/)
  assert.match(proxySource, /\/api\/auth\/login/)
})
