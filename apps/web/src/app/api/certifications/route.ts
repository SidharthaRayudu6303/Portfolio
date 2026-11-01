import { NextRequest } from 'next/server.js';
import { proxyPublicGet, proxyAdminMutation } from '@/lib/bff-proxy';

export async function GET() {
  return proxyPublicGet('/certifications');
}

export async function POST(req: NextRequest) {
  return proxyAdminMutation(req, '/certifications', 'POST');
}

