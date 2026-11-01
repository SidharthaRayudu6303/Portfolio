import { NextRequest } from 'next/server';
import { proxyAdminGet, proxyAdminMutation } from '@/lib/bff-proxy';

export async function GET(req: NextRequest) {
  return proxyAdminGet(req, '/resume/admin/list');
}

export async function POST(req: NextRequest) {
  return proxyAdminMutation(req, '/resume/admin/upload', 'POST');
}

