import React from 'react';

/**
 * Authentic, verified vector logos for technologies in Sidhartha Rayudu's verified skill stack.
 * Zero external font or network dependencies; crisp, lightweight, and responsive.
 */

export function PythonLogo({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M63.5 12C38.6 12 40.2 22.8 40.2 22.8L40.3 34H64.2V37.4H30.5C14.7 37.4 12 47.9 12 64.2C12 80.5 19.3 83.5 28.5 83.5H35.8V71.8C35.8 58.4 47.3 58.4 47.3 58.4H71.2C82.7 58.4 83.5 48.6 83.5 48.6V23.7C83.5 14.7 75.3 12 63.5 12ZM52.2 22.1C55.5 22.1 58.2 24.8 58.2 28.1C58.2 31.4 55.5 34.1 52.2 34.1C48.9 34.1 46.2 31.4 46.2 28.1C46.2 24.8 48.9 22.1 52.2 22.1Z"
        fill="#38bdf8"
      />
      <path
        d="M64.5 116C89.4 116 87.8 105.2 87.8 105.2L87.7 94H63.8V90.6H97.5C113.3 90.6 116 80.1 116 63.8C116 47.5 108.7 44.5 99.5 44.5H92.2V56.2C92.2 69.6 80.7 69.6 80.7 69.6H56.8C45.3 69.6 44.5 79.4 44.5 79.4V104.3C44.5 113.3 52.7 116 64.5 116ZM75.8 105.9C72.5 105.9 69.8 103.2 69.8 99.9C69.8 96.6 72.5 93.9 75.8 93.9C79.1 93.9 81.8 96.6 81.8 99.9C81.8 103.2 79.1 105.9 75.8 105.9Z"
        fill="#facc15"
      />
    </svg>
  );
}

export function ReactLogo({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="-11.5 -10.23174 23 20.46348" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="0" cy="0" r="2.05" fill="#00f0ff" />
      <g stroke="#00f0ff" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

export function TypeScriptLogo({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="20" fill="#3178c6" />
      <path d="M57.6 57.2H42.7V46H85.3V57.2H70.4V105H57.6V57.2Z" fill="white" />
      <path d="M85.4 92.5C89.5 96.2 95.3 98.4 102 98.4C108.5 98.4 112.5 95.3 112.5 90.7C112.5 81.6 98.8 82.5 98.8 70.3C98.8 62.4 105.1 57.1 115 57.1C120.8 57.1 125.6 58.9 129 61.9L124.2 71.4C121.2 69 117.7 67.5 113.6 67.5C108.7 67.5 105.7 70.1 105.7 73.6C105.7 82.3 119.5 81.8 119.5 94.6C119.5 103.4 112.7 108.8 102 108.8C94.5 108.8 88.3 106.1 83.4 101.4L85.4 92.5Z" fill="white" />
    </svg>
  );
}

export function JavaScriptLogo({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="20" fill="#f7df1e" />
      <path d="M41 94.6C44.5 99.4 50 102.5 56.6 102.5C64.3 102.5 68.6 98.6 68.6 88.5V47.5H54.4V88.8C54.4 92.8 52.8 93.9 49.2 93.9C46.8 93.9 43.6 93.2 41 91.5L41 94.6Z" fill="#1e1e1e" />
      <path d="M78.6 92.7C82.8 97.4 89.2 100.8 97.5 100.8C105.7 100.8 110.8 96.8 110.8 90.9C110.8 79.4 94.7 78.4 94.7 66.8C94.7 60.3 100 55.4 108.7 55.4C114.7 55.4 120 57.8 124 61.5L119.8 70.9C116.5 68.3 112.6 66.8 108.4 66.8C103.9 66.8 101 68.8 101 72C101 82.4 117.2 82.8 117.2 95.1C117.2 104.5 109.5 110.6 97.5 110.6C88.6 110.6 81.8 107.1 76.5 101.2L78.6 92.7Z" fill="#1e1e1e" />
    </svg>
  );
}

export function NextjsLogo({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="90" cy="90" r="85" fill="#030712" stroke="#38bdf8" strokeWidth="5" />
      <path d="M149.5 153.8L68.8 50H50V130H66.8V71.2L137.5 161.8C141.7 159.4 145.7 156.7 149.5 153.8Z" fill="white" />
      <rect x="113.2" y="50" width="16.8" height="80" fill="white" />
    </svg>
  );
}

export function NodejsLogo({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M64 10L112 37.7V93.3L64 121L16 93.3V37.7L64 10Z" fill="#339933" />
      <path d="M64 22L98 41.6V80.8L64 100.4L30 80.8V41.6L64 22Z" fill="#050505" />
      <circle cx="64" cy="64" r="16" fill="#339933" />
    </svg>
  );
}

export function NestjsLogo({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="20" fill="#1a0b12" stroke="#e11d48" strokeWidth="2" />
      <path
        d="M98 26C88 18 72 26 64 34C56 26 40 18 30 26C18 36 24 58 34 76C44 94 64 108 64 108C64 108 84 94 94 76C104 58 110 36 98 26ZM64 78C56 68 50 56 50 48C50 42 54 38 60 38C64 38 64 42 64 42C64 42 64 38 68 38C74 38 78 42 78 48C78 56 72 68 64 78Z"
        fill="#e11d48"
      />
    </svg>
  );
}

export function PostgreSQLLogo({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="20" fill="#0e1e38" stroke="#336791" strokeWidth="2" />
      <path
        d="M64 20C42 20 32 36 32 54C32 74 44 90 60 98V108H68V98C84 90 96 74 96 54C96 36 86 20 64 20ZM48 56C44 56 42 52 42 48C42 44 44 40 48 40C52 40 54 44 54 48C54 52 52 56 48 56ZM80 56C76 56 74 52 74 48C74 44 76 40 80 40C84 40 86 44 86 48C86 52 84 56 80 56Z"
        fill="#336791"
      />
      <circle cx="48" cy="48" r="3" fill="#60a5fa" />
      <circle cx="80" cy="48" r="3" fill="#60a5fa" />
    </svg>
  );
}

export function GitLogo({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M123.6 57.6L70.4 4.4C66.8 0.8 61 0.8 57.4 4.4L4.4 57.4C0.8 61 0.8 66.8 4.4 70.4L57.4 123.4C61 127 66.8 127 70.4 123.4L123.4 70.4C127.2 66.8 127.2 61.2 123.6 57.6ZM74.8 77.2V92.4C72.8 93.6 70.4 94.4 67.8 94.4C60.6 94.4 55 88.8 55 81.6C55 76.6 57.8 72.2 62 69.8V49.6L49.6 62C48.4 60.8 47.6 59.2 47.6 57.4C47.6 53.8 50.6 50.8 54.2 50.8C56 50.8 57.6 51.6 58.8 52.8L73.2 38.4C72.4 37.2 72 35.8 72 34.2C72 29.4 76 25.4 80.8 25.4C85.6 25.4 89.6 29.4 89.6 34.2C89.6 39 85.6 43 80.8 43C78.8 43 77 42.2 75.6 40.8L61.6 54.8C62 55.6 62.2 56.6 62.2 57.6C62.2 60.4 60.4 62.6 58 63.6V68.2C59.6 67.2 61.6 66.6 63.8 66.6C67.6 66.6 71 68.4 73.2 71.2L85.4 59C84.6 57.8 84.2 56.4 84.2 54.8C84.2 50 88.2 46 93 46C97.8 46 101.8 50 101.8 54.8C101.8 59.6 97.8 63.6 93 63.6C91 63.6 89.2 62.8 87.8 61.4L75.6 73.6C75.8 74.8 75.8 76 74.8 77.2Z"
        fill="#f05032"
      />
    </svg>
  );
}

export function DockerLogo({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M121 58C117 56 112 56 108 58C106 50 100 46 92 46H86V54H92C96 54 99 56 100 60C96 61 93 64 91 67H22C16 67 11 72 11 78C11 96 26 110 50 110C80 110 104 90 107 68C112 68 119 66 123 60L121 58Z"
        fill="#2496ed"
      />
      {/* Container Boxes */}
      <rect x="36" y="50" width="12" height="12" rx="2" fill="#2496ed" />
      <rect x="52" y="50" width="12" height="12" rx="2" fill="#2496ed" />
      <rect x="68" y="50" width="12" height="12" rx="2" fill="#2496ed" />
      <rect x="36" y="34" width="12" height="12" rx="2" fill="#2496ed" />
      <rect x="52" y="34" width="12" height="12" rx="2" fill="#2496ed" />
      <rect x="68" y="34" width="12" height="12" rx="2" fill="#2496ed" />
      <rect x="52" y="18" width="12" height="12" rx="2" fill="#2496ed" />
    </svg>
  );
}

export function MongoDBLogo({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M64 12C64 12 42 42 42 70C42 86 52 100 62 104L64 116L66 104C76 100 86 86 86 70C86 42 64 12 64 12Z"
        fill="#13aa52"
      />
      <path
        d="M64 12V104C74 100 84 86 84 70C84 42 64 12 64 12Z"
        fill="#108a3e"
      />
      <line x1="64" y1="12" x2="64" y2="116" stroke="#47a248" strokeWidth="2" />
    </svg>
  );
}

export function TailwindLogo({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 52C36 36 48 30 64 30C84 30 88 44 94 48C100 52 106 50 112 44C108 60 96 66 80 66C60 66 56 52 50 48C44 44 38 46 32 52ZM16 88C20 72 32 66 48 66C68 66 72 80 78 84C84 88 90 86 96 80C92 96 80 102 64 102C44 102 40 88 34 84C28 80 22 82 16 88Z"
        fill="#38bdf8"
      />
    </svg>
  );
}

export function OpenCVLogo({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="64" cy="40" r="22" stroke="#ef4444" strokeWidth="10" />
      <circle cx="42" cy="84" r="22" stroke="#22c55e" strokeWidth="10" />
      <circle cx="86" cy="84" r="22" stroke="#3b82f6" strokeWidth="10" />
    </svg>
  );
}

export function LinuxLogo({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="20" fill="#0f172a" stroke="#eab308" strokeWidth="2" />
      <text x="24" y="76" fill="#facc15" fontFamily="monospace" fontSize="36" fontWeight="bold">$_</text>
      <circle cx="92" cy="64" r="8" fill="#38bdf8" />
    </svg>
  );
}

export function RestApiLogo({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="20" fill="#030712" stroke="#00f0ff" strokeWidth="2" />
      <circle cx="36" cy="64" r="14" fill="#00f0ff" fillOpacity="0.2" stroke="#00f0ff" strokeWidth="3" />
      <circle cx="92" cy="64" r="14" fill="#00f0ff" fillOpacity="0.2" stroke="#00f0ff" strokeWidth="3" />
      <line x1="50" y1="64" x2="78" y2="64" stroke="#00f0ff" strokeWidth="4" strokeDasharray="3,3" />
      <path d="M 68 56 L 78 64 L 68 72" fill="none" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

