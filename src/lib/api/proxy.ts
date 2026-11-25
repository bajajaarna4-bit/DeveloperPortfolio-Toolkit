import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Fetches JSON from the bound internal Python `api` service via `process.env.API_URL`
 * at runtime, falling back cleanly to local dev / bundled JSON files when running
 * standalone Next.js outside Vercel Services.
 */
export async function proxyPythonApi(endpointPath: string, fallbackFilename: string) {
  const boundApiUrl = process.env.API_URL;
  const targetBase = boundApiUrl || 'http://localhost:8000';

  try {
    const targetUrl = new URL(endpointPath, targetBase).toString();
    const res = await fetch(targetUrl, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`API service responded with status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    // Only fall back to local JSON on disk when no service binding URL is injected
    // (i.e. running standalone `next dev` / `next start` without `vercel dev`), or if
    // the local fallback file exists alongside the Next.js workspace.
    try {
      const localPath = path.join(process.cwd(), 'API', fallbackFilename);
      const raw = await readFile(localPath, 'utf-8');
      return NextResponse.json(JSON.parse(raw));
    } catch {
      console.error(`Failed to proxy ${endpointPath} from API service:`, err);
      return NextResponse.json(
        {
          error:
            err instanceof Error
              ? err.message
              : 'Failed to fetch from internal API service',
        },
        { status: boundApiUrl ? 502 : 503 }
      );
    }
  }
}
