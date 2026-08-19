import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'app', 'site-orders.json');

async function getOrders() {
  try {
    const fileContent = await readFile(dataFilePath, 'utf-8');
    const parsed = JSON.parse(fileContent);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

export async function GET() {
  const data = await getOrders();
  return NextResponse.json({ success: true, data });
}

export async function POST(request) {
  try {
    const payload = await request.json();
    if (!payload?.customer || !payload?.phone || !payload?.items) {
      return NextResponse.json({ success: false, message: 'Missing order fields' }, { status: 400 });
    }

    const current = await getOrders();
    const order = {
      id: payload.id || `HF-${Date.now().toString().slice(-6)}`,
      customer: String(payload.customer),
      phone: String(payload.phone),
      email: payload.email || '',
      address: payload.address || '',
      items: payload.items || '',
      total: Number(payload.total) || 0,
      subtotal: Number(payload.subtotal) || 0,
      shipping: Number(payload.shipping) || 0,
      discount: Number(payload.discount) || 0,
      status: payload.status || 'Processing',
      date: payload.date || new Date().toISOString().split('T')[0],
      payment: payload.payment || 'cod',
      source: 'storefront',
      createdAt: new Date().toISOString()
    };

    const next = [order, ...current].slice(0, 500);
    await writeFile(dataFilePath, JSON.stringify(next, null, 2), 'utf-8');
    return NextResponse.json({ success: true, data: order });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
