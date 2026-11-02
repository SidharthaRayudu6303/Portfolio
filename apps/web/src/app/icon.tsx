import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: '8px',
          border: '1px solid rgba(0, 240, 255, 0.5)',
          boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)',
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* S in Electric Cyan */}
          <path
            d="M 44 24 H 24 L 14 34 V 44 L 22 52 H 36 L 44 60 V 72 L 34 82 H 14"
            stroke="#00f0ff"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* R in Electric Blue */}
          <path
            d="M 56 24 V 82 M 56 24 H 74 L 84 34 V 42 L 74 52 H 56 M 68 52 L 86 82"
            stroke="#3b82f6"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}

