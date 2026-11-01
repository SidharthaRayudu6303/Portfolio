import { NextRequest } from 'next/server.js';
import { proxyAdminMutation } from '@/lib/bff-proxy';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyAdminMutation(req, `/skills/${id}`, 'PUT');
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyAdminMutation(req, `/skills/${id}`, 'DELETE');
}

