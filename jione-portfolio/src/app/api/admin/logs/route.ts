import { NextResponse } from 'next/server';
import { memoryDB } from '@/lib/memory-db';

export async function GET() {
  const logs = memoryDB.getLogs();
  return NextResponse.json({ logs });
}
