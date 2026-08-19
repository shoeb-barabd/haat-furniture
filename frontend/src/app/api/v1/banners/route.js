import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'app', 'site-banners.json');

async function getBanners() {
  try {
    const fileContent = await readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (err) {
    console.error('Error reading banners file:', err);
    return {
      heroOffer: { enabled: true, image: '' },
      heroSlides: []
    };
  }
}

export async function GET() {
  const data = await getBanners();
  return NextResponse.json({ success: true, data });
}

export async function PUT(request) {
  try {
    const payload = await request.json();
    const current = await getBanners();
    const next = {
      heroOffer: {
        ...current.heroOffer,
        ...(payload.heroOffer || {})
      },
      heroSlides: Array.isArray(payload.heroSlides) ? payload.heroSlides : (current.heroSlides || [])
    };
    await writeFile(dataFilePath, JSON.stringify(next, null, 2), 'utf-8');
    return NextResponse.json({ success: true, message: 'Banner published to homepage', data: next });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
