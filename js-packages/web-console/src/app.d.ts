import '@poppanator/sveltekit-svg/dist/svg'
import type { LayoutData } from './routes/+layout.js'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  /**
   * Override the Feldera API endpoint URL.
   *
   * Set this before the application bundle loads (e.g. via a `<script>` tag
   * injected by a reverse proxy) to route all API requests through a custom
   * base path. When unset, the endpoint is derived from `window.location.origin`.
   *
   * @example
   * ```html
   * <script>globalThis.__FELDERA_ENDPOINT = '/hopsworks-api/feldera/myproject/myjob'</script>
   * ```
   */
  // eslint-disable-next-line no-var
  var __FELDERA_ENDPOINT: string | undefined

  namespace App {
    // interface Error {}
    // interface Locals {}
    interface PageData extends LayoutData {}
    // interface PageState {}
    // interface Platform {}
  }
}
