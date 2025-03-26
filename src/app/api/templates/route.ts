import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // In a real app, this would use the session userId
    // For mock purposes we're using user1
    const userId = "user1";

    const templates = await db.template.findMany({
      where: {
        userId: userId
      }
    });

    return NextResponse.json({ templates });
  } catch (error: unknown) {
    console.error("[TEMPLATES_GET]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();

    // Validate template data
    const { name, procedureType, notes, complications, outcome, followUp } = body;

    if (!name || !procedureType || !notes) {
      return NextResponse.json(
        { error: "Name, procedure type, and notes are required" },
        { status: 400 }
      );
    }

    // In a real app, this would use the session userId
    // For mock purposes we're using user1
    const userId = "user1";

    const template = await db.template.create({
      data: {
        userId,
        name,
        procedureType,
        notes,
        complications: complications || "",
        outcome: outcome || "",
        followUp: followUp || "",
      }
    });

    return NextResponse.json({ template });
  } catch (error: unknown) {
    console.error("[TEMPLATES_POST]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
