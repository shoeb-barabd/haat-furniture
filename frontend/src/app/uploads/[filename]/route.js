import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const TYPES = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
};

export const dynamic = 'force-dynamic';

export async function GET(_request, context) {
  const params = await context.params;
  const filename = params?.filename || '';
  const base = path.basename(filename);
  const ext = base.includes('.') ? base.split('.').pop().toLowerCase() : '';

  if (!base || base !== filename || !TYPES[ext]) {
    return new NextResponse('Not found', { status: 404 });
  }

  const filePath = path.join(process.cwd(), 'storage', 'uploads', base);
  try {
    const buf = await readFile(filePath);
    return new NextResponse(buf, {
      headers: {
        'Content-Type': TYPES[ext],
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
