import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import React from "react";

type RouteParams = {
  params: { id: string } | Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    // Unwrap params if it's a Promise
    const unwrappedParams = params instanceof Promise ? await params : params;
    const { id } = unwrappedParams;

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const template = await db.template.findUnique({
      where: { id }
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // In a real app, we'd check if this template belongs to the user
    const userId = "user1";
    if (template.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ template });
  } catch (error: unknown) {
    console.error("[TEMPLATE_GET]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    // Unwrap params if it's a Promise
    const unwrappedParams = params instanceof Promise ? await params : params;
    const { id } = unwrappedParams;

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();

    const { name, procedureType, notes, complications, outcome, followUp } = body;

    if (!name || !procedureType || !notes) {
      return NextResponse.json(
        { error: "Name, procedure type, and notes are required" },
        { status: 400 }
      );
    }

    const existingTemplate = await db.template.findUnique({
      where: { id }
    });

    if (!existingTemplate) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // In a real app, we'd check if this template belongs to the user
    const userId = "user1";
    if (existingTemplate.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedTemplate = await db.template.update({
      where: { id },
      data: {
        name,
        procedureType,
        notes,
        complications,
        outcome,
        followUp,
      }
    });

    return NextResponse.json({ template: updatedTemplate });
  } catch (error: unknown) {
    console.error("[TEMPLATE_PATCH]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    // Unwrap params if it's a Promise
    const unwrappedParams = params instanceof Promise ? await params : params;
    const { id } = unwrappedParams;

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const existingTemplate = await db.template.findUnique({
      where: { id }
    });

    if (!existingTemplate) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // In a real app, we'd check if this template belongs to the user
    const userId = "user1";
    if (existingTemplate.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await db.template.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[TEMPLATE_DELETE]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
