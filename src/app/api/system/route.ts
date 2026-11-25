import { proxyPythonApi } from '@/lib/api/proxy';

export const dynamic = 'force-dynamic';

export async function GET() {
  return proxyPythonApi('/system', 'system_stats.json');
}
