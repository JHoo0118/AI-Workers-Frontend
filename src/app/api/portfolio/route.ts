import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(_: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), "public", "portfolio.html");
    const htmlContent = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json(htmlContent);
  } catch (error) {
    console.error("Error fetching HTML content:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
