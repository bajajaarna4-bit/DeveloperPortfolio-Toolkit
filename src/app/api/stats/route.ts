import { proxyPythonApi } from '@/lib/api/proxy';

export const dynamic = 'force-dynamic';

export async function GET() {
  return proxyPythonApi('/stats', 'stats_summary.json');
}
