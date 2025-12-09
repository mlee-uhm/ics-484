import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// eslint-disable-next-line import/prefer-default-export
export async function GET(): Promise<NextResponse> {
  const filePath = path.join(process.cwd(), 'public', 'Boundaries_District.geojson');

  // Use await to prevent blocking the event loop
  const file = await fs.readFile(filePath, 'utf8');

  return new NextResponse(file, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
