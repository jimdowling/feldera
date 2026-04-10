/**
 * The base URL for the Feldera API.
 *
 * Resolution order:
 * 1. `globalThis.__FELDERA_ENDPOINT` — explicit override injected by a
 *    hosting environment (e.g. Hopsworks proxy injects a `<script>` tag
 *    that sets this before the app bundle loads).
 * 2. `window.location.origin` with dev-port rewriting (4173/4174/5173/5174 → 8080).
 * 3. Fallback to `http://localhost:8080` for non-browser contexts (SSR, tests).
 */
export const felderaEndpoint: string =
  (globalThis as Record<string, unknown>).__FELDERA_ENDPOINT as string ??
  ('window' in globalThis && window.location.origin
    ? // If we're running locally with `bun run dev`, we point to the
      // backend server running on port 8080
      // Otherwise the API and UI URL will be the same
      window.location.origin.replace(/:([45]17[34])$/, ':8080')
    : 'http://localhost:8080')
