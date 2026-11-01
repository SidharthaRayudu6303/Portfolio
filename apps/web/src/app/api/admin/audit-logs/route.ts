import { NextRequest, NextResponse } from 'next/server.js';
import { ADMIN_SESSION_COOKIE, BACKEND_API_URL } from '../../../../lib/constants';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const backendRes = await fetch(`${BACKEND_API_URL}/auth/audit-logs`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: 'Failed to retrieve security audit logs' },
        { status: backendRes.status },
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Security audit service unavailable' },
      { status: 503 },
    );
  }
}
