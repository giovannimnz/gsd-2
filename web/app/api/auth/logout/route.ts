import { NextResponse } from "next/server"
import {
  buildClearSessionCookie,
  getWebLoginConfig,
} from "@/lib/server/web-login"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(): Promise<Response> {
  const config = getWebLoginConfig()

  const response = NextResponse.json(
    {
      ok: true,
      required: config.enabled,
      authenticated: false,
      user: config.enabled ? { username: config.username } : null,
    },
    { headers: { "Cache-Control": "no-store" } },
  )

  response.headers.append("Set-Cookie", buildClearSessionCookie(config))
  return response
}
