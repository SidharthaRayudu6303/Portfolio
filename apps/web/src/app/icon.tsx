import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  let dataUrl = '';
  try {
    const logoPath = path.join(process.cwd(), 'public/brand/sr-logo.png');
    if (fs.existsSync(logoPath)) {
      const buffer = fs.readFileSync(logoPath);
      dataUrl = `data:image/png;base64,${buffer.toString('base64')}`;
    }
  } catch {
    // fallback if file read fails
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#050505',
          borderRadius: '6px',
        }}
      >
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt="SR Logo"
            width={30}
            height={30}
            style={{ objectFit: 'contain' }}
          />
        ) : (
          <svg
            width="26"
            height="26"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 44 24 H 24 L 14 34 V 44 L 22 52 H 36 L 44 60 V 72 L 34 82 H 14"
              stroke="#00f0ff"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 56 24 V 82 M 56 24 H 74 L 84 34 V 42 L 74 52 H 56 M 68 52 L 86 82"
              stroke="#3b82f6"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    ),
    {
      ...size,
    }
  );
}
