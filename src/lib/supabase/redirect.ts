/**
 * Validates that a redirect target is a safe relative path within this app.
 * Prevents open-redirect vulnerabilities from untrusted query/form parameters.
 */
export function safeRedirectPath(
  target: string | null | undefined,
  fallback: string = '/dashboard'
): string {
  if (!target || typeof target !== 'string') return fallback;
  const trimmed = target.trim();
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.includes('\\')) {
    return trimmed;
  }
  return fallback;
}
