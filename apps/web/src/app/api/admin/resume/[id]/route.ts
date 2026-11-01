import { NextRequest } from 'next/server';
import { proxyAdminMutation } from '@/lib/bff-proxy';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const url = new URL(req.url);
  const isActivate = url.searchParams.get('action') === 'activate';

  const backendPath = isActivate ? `/resume/${id}/activate` : `/resume/${id}/meta`;
  return proxyAdminMutation(req, backendPath, 'PATCH');
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyAdminMutation(req, `/resume/${id}`, 'DELETE');
}

