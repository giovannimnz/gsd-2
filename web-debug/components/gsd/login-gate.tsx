"use client"

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authFetch, getAuthToken } from "@/lib/auth"

type GateMode = "loading" | "missing-token" | "login" | "invalid-token"

interface LoginStatusResponse {
  required?: boolean
  authenticated?: boolean
  user?: { username?: string | null } | null
}

interface LoginGateProps {
  onAuthenticated: () => void
}

export function LoginGate({ onAuthenticated }: LoginGateProps) {
  const [mode, setMode] = useState<GateMode>("loading")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const tokenAvailable = useMemo(() => Boolean(getAuthToken()), [])
  const loginInputClassName =
    "border-zinc-300/80 bg-background/70 shadow-none dark:border-zinc-600 dark:bg-zinc-950/60 focus-visible:border-zinc-500 dark:focus-visible:border-zinc-400 focus-visible:ring-zinc-400/20"

  const loadStatus = useCallback(async () => {
    try {
      const response = await authFetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
      })

      if (!response.ok) {
        if (response.status === 401) {
          setMode(tokenAvailable ? "invalid-token" : "missing-token")
          return
        }
        throw new Error(`Failed to check login status (${response.status})`)
      }

      const payload = (await response.json()) as LoginStatusResponse

      if (payload.authenticated) {
        onAuthenticated()
        return
      }

      setMode(payload.required ? "login" : tokenAvailable ? "invalid-token" : "missing-token")
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : String(requestError)
      setError(message)
      setMode(tokenAvailable ? "invalid-token" : "missing-token")
    }
  }, [onAuthenticated, tokenAvailable])

  useEffect(() => {
    void loadStatus()
  }, [loadStatus])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const response = await authFetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(payload?.error ?? "Authentication failed")
      }

      setPassword("")
      onAuthenticated()
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : String(loginError)
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex h-dvh items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md border-border/60 bg-card/95 backdrop-blur">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-2">
            <Image src="/logo-black.svg" alt="GSD" width={57} height={16} className="h-4 w-auto dark:hidden" />
            <Image src="/logo-white.svg" alt="GSD" width={57} height={16} className="hidden h-4 w-auto dark:block" />
          </div>
          <div className="space-y-1">
            <CardTitle>Workspace Login</CardTitle>
            <CardDescription>
              Local auth gate for this web session. Keep this terminal and browser private.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {mode === "loading" && <p className="text-sm text-muted-foreground">Checking authentication status…</p>}

          {mode === "missing-token" && (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>This workspace requires an auth token in the URL.</p>
              <p>
                Copy the full URL from your terminal (including
                <code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">#token=…</code>)
                or restart with
                <code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">gsd --web</code>.
              </p>
            </div>
          )}

          {mode === "invalid-token" && (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Could not authenticate this browser session.</p>
              <p>
                Restart the web server with
                <code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">gsd --web</code>
                and open the new URL printed in the terminal.
              </p>
            </div>
          )}

          {mode === "login" && (
            <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
              <div className="space-y-2">
                <Label htmlFor="web-login-username">Username</Label>
                <Input
                  id="web-login-username"
                  className={loginInputClassName}
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="off"
                  disabled={submitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="web-login-password">Password</Label>
                <Input
                  id="web-login-password"
                  type="password"
                  className={loginInputClassName}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="off"
                  disabled={submitting}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting || username.trim().length === 0 || password.length === 0}>
                {submitting ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
