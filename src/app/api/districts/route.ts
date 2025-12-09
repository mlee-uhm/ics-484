import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "Boundaries_District.geojson");
  const file = fs.readFileSync(filePath, "utf8");

  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
