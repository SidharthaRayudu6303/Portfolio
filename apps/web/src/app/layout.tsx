import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Sidhartha | Portfolio',
  description: 'Interactive Personal Portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
