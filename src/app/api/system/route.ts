import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiBase = process.env.API_URL || 'http://localhost:8000';
  try {
    const res = await fetch(new URL('/system', apiBase).toString(), {
      next: { revalidate: 10 }
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Internal API service responded with status ${res.status}` },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch from internal API service' },
      { status: 502 }
    );
  }
}
