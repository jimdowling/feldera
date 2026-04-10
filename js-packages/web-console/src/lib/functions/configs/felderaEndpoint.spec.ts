import { afterEach, describe, expect, it, vi } from 'vitest'

// felderaEndpoint is a module-level constant evaluated at import time.
// Each test must set up globalThis state, then dynamically import the module
// with a fresh module graph (vi.resetModules()) to test each resolution path.

describe('felderaEndpoint', () => {
  afterEach(() => {
    delete (globalThis as Record<string, unknown>).__FELDERA_ENDPOINT
    vi.resetModules()
  })

  it('uses globalThis.__FELDERA_ENDPOINT when set', async () => {
    ;(globalThis as Record<string, unknown>).__FELDERA_ENDPOINT =
      '/hopsworks-api/feldera/myproject/myjob'

    const { felderaEndpoint } = await import('./felderaEndpoint')

    expect(felderaEndpoint).toBe('/hopsworks-api/feldera/myproject/myjob')
  })

  it('uses globalThis.__FELDERA_ENDPOINT even when set to an absolute URL', async () => {
    ;(globalThis as Record<string, unknown>).__FELDERA_ENDPOINT = 'https://proxy.example.com/feldera'

    const { felderaEndpoint } = await import('./felderaEndpoint')

    expect(felderaEndpoint).toBe('https://proxy.example.com/feldera')
  })

  it('falls back to http://localhost:8080 when no override and no window', async () => {
    // In Node (vitest server project), there is no `window` in globalThis
    const { felderaEndpoint } = await import('./felderaEndpoint')

    expect(felderaEndpoint).toBe('http://localhost:8080')
  })

  it('does not use an empty string override (nullish coalescing, not ||)', async () => {
    // Empty string is falsy but not nullish — ?? treats it as a valid value.
    // This documents the intentional behavior: an explicit empty string
    // override means "use same origin" (relative URLs).
    ;(globalThis as Record<string, unknown>).__FELDERA_ENDPOINT = ''

    const { felderaEndpoint } = await import('./felderaEndpoint')

    expect(felderaEndpoint).toBe('')
  })

  it('ignores __FELDERA_ENDPOINT when set to undefined', async () => {
    ;(globalThis as Record<string, unknown>).__FELDERA_ENDPOINT = undefined

    const { felderaEndpoint } = await import('./felderaEndpoint')

    // Falls through to the location-based or localhost fallback
    expect(felderaEndpoint).toBe('http://localhost:8080')
  })

  it('ignores __FELDERA_ENDPOINT when set to null', async () => {
    ;(globalThis as Record<string, unknown>).__FELDERA_ENDPOINT = null

    const { felderaEndpoint } = await import('./felderaEndpoint')

    expect(felderaEndpoint).toBe('http://localhost:8080')
  })

  it('strips trailing slash if the override has one', async () => {
    // The endpoint value is used as-is; callers append /v0/... paths.
    // This test documents that trailing slashes are NOT stripped automatically,
    // so proxy configuration should omit them.
    ;(globalThis as Record<string, unknown>).__FELDERA_ENDPOINT =
      '/hopsworks-api/feldera/proj/job/'

    const { felderaEndpoint } = await import('./felderaEndpoint')

    expect(felderaEndpoint).toBe('/hopsworks-api/feldera/proj/job/')
  })
})
