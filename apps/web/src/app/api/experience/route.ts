import { NextRequest } from 'next/server.js';
import { proxyPublicGet, proxyAdminMutation } from '@/lib/bff-proxy';

export async function GET() {
  return proxyPublicGet('/experience');
}

export async function POST(req: NextRequest) {
  return proxyAdminMutation(req, '/experience', 'POST');
}

