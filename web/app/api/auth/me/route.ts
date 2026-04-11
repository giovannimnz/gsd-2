import {
  getWebLoginConfig,
  isWebLoginAuthenticated,
} from "@/lib/server/web-login"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request): Promise<Response> {
  const config = getWebLoginConfig()

  if (!config.enabled) {
    return Response.json(
      {
        required: false,
        authenticated: true,
        user: null,
      },
      { headers: { "Cache-Control": "no-store" } },
    )
  }

  const authenticated = isWebLoginAuthenticated(request, config)

  return Response.json(
    {
      required: true,
      authenticated,
      user: { username: config.username },
    },
    { headers: { "Cache-Control": "no-store" } },
  )
}
