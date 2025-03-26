import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    return NextResponse.json({
      authenticated: !!session?.user,
      user: session?.user || null,
      env: {
        nextAuthUrl: process.env.NEXTAUTH_URL,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error: unknown) {
    console.error("[TEST_API_ERROR]", error);
    return NextResponse.json({
      error: "Authentication error",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 });
  }
}
