import { NextRequest } from 'next/server.js';
import { proxyAdminGet } from '@/lib/bff-proxy';

export async function GET(req: NextRequest) {
  return proxyAdminGet(req, '/analytics/stats');
}

