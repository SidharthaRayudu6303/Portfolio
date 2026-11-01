import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_API_URL } from '@/lib/constants';

export async function GET(request: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/resume/download`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) {
        return new NextResponse(
          '<html><body style="font-family:sans-serif;background:#050505;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;"><h2 style="color:#00f0ff">Resume Document Not Uploaded Yet</h2><p style="color:#a3a3a3">The administrator will be uploading the verified resume PDF shortly. Please reach out via the on-site contact form in the meantime.</p><a href="/" style="color:#00f0ff;margin-top:16px;">&larr; Back to Portfolio</a></body></html>',
          {
            status: 404,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          },
        );
      }
      return new NextResponse('Failed to retrieve resume', { status: res.status });
    }

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
  } catch (err: any) {
    return new NextResponse(
      '<html><body style="font-family:sans-serif;background:#050505;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;"><h2 style="color:#00f0ff">Resume System Temporarily Offline</h2><p style="color:#a3a3a3">Unable to connect to the document repository. Please contact Sidhartha directly at madhavarapusidhartharayudu@gmail.com</p><a href="/" style="color:#00f0ff;margin-top:16px;">&larr; Back to Portfolio</a></body></html>',
      {
        status: 503,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      },
    );
  }
}

