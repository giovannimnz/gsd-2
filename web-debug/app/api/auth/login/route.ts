import { NextResponse } from "next/server"
import {
  buildSessionCookie,
  constantTimeEqual,
  getWebLoginConfig,
} from "@/lib/server/web-login"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface LoginPayload {
  username?: unknown
  password?: unknown
}

export async function POST(request: Request): Promise<Response> {
  const config = getWebLoginConfig()
  if (!config.enabled) {
    return NextResponse.json(
      { error: "Web login is not enabled." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    )
  }

  if (!config.password || !config.sessionToken) {
    return NextResponse.json(
      { error: "Web login is misconfigured." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    )
  }

  let payload: LoginPayload
  try {
    payload = (await request.json()) as LoginPayload
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    )
  }

  const username = typeof payload.username === "string" ? payload.username.trim() : ""
  const password = typeof payload.password === "string" ? payload.password : ""

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    )
  }

  const usernameValid = constantTimeEqual(username, config.username)
  const passwordValid = constantTimeEqual(password, config.password)

  if (!usernameValid || !passwordValid) {
    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    )
  }

  const response = NextResponse.json(
    {
      ok: true,
      required: true,
      authenticated: true,
      user: { username: config.username },
    },
    { headers: { "Cache-Control": "no-store" } },
  )

  response.headers.append("Set-Cookie", buildSessionCookie(config))
  return response
}
