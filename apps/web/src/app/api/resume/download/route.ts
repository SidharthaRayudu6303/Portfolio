import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { BACKEND_API_URL } from '@/lib/constants';

function getLocalResumeBuffer(): { buffer: Buffer; filename: string } | null {
  const candidates = [
    path.resolve(process.cwd(), 'public/resume/Sidhartha_Rayudu_Resume.pdf'),
    path.resolve(process.cwd(), 'apps/web/public/resume/Sidhartha_Rayudu_Resume.pdf'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      try {
        const buffer = fs.readFileSync(candidate);
        if (buffer.length > 0) {
          return { buffer, filename: 'Sidhartha_Rayudu_Resume.pdf' };
        }
      } catch {
        // Continue to next candidate
      }
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    // 1. Attempt to fetch active resume version from the database-backed backend
    const res = await fetch(`${BACKEND_API_URL}/resume/download`, {
      cache: 'no-store',
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type') || 'application/pdf';
      const contentDisposition =
        res.headers.get('content-disposition') ||
        'inline; filename="Sidhartha_Rayudu_Resume.pdf"';

      const arrayBuffer = await res.arrayBuffer();

      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': contentDisposition,
          'Cache-Control': 'public, max-age=1800',
        },
      });
    }

    // 2. If backend has no active database resume or returns non-200, stream verified local document
    const local = getLocalResumeBuffer();
    if (local) {
      return new NextResponse(new Uint8Array(local.buffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${local.filename}"`,
          'Cache-Control': 'public, max-age=1800',
        },
      });
    }

    // 3. Fallback if neither backend nor file exists
    return new NextResponse(
      '<html><body style="font-family:sans-serif;background:#050505;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;"><h2 style="color:#00f0ff">Resume Document Not Found</h2><p style="color:#a3a3a3">Please reach out via the on-site contact form in the meantime.</p><a href="/" style="color:#00f0ff;margin-top:16px;">&larr; Back to Portfolio</a></body></html>',
      {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      },
    );
  } catch (err: any) {
    // Backend offline: serve verified local document
    const local = getLocalResumeBuffer();
    if (local) {
      return new NextResponse(new Uint8Array(local.buffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${local.filename}"`,
          'Cache-Control': 'public, max-age=1800',
        },
      });
    }

    return new NextResponse(
      '<html><body style="font-family:sans-serif;background:#050505;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;"><h2 style="color:#00f0ff">Resume System Temporarily Offline</h2><p style="color:#a3a3a3">Unable to connect to the document repository. Please contact Sidhartha directly at madhavarapusidhartharayudu@gmail.com</p><a href="/" style="color:#00f0ff;margin-top:16px;">&larr; Back to Portfolio</a></body></html>',
      {
        status: 503,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      },
    );
  }
}
