import test from "node:test"
import assert from "node:assert/strict"

import { extractAuthTokenFromHash } from "../../../web/lib/auth.ts"

test("extractAuthTokenFromHash parses standard token hash", () => {
  assert.equal(extractAuthTokenFromHash("#token=abc123"), "abc123")
})

test("extractAuthTokenFromHash accepts non-hex custom tokens", () => {
  assert.equal(extractAuthTokenFromHash("#token=my_token-v1.2"), "my_token-v1.2")
})

test("extractAuthTokenFromHash decodes encoded tokens", () => {
  assert.equal(extractAuthTokenFromHash("#token=abc%2B123%2Fxyz"), "abc+123/xyz")
})

test("extractAuthTokenFromHash returns null when token is missing or blank", () => {
  assert.equal(extractAuthTokenFromHash("#foo=bar"), null)
  assert.equal(extractAuthTokenFromHash("#token=%20%20"), null)
  assert.equal(extractAuthTokenFromHash(""), null)
})
