import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
// Import our MOCK_USERS array from auth.ts
import { MOCK_USERS } from "@/auth";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate the request body
    const result = userSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: result.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password } = body;

    // Check if user already exists
    const existingUser = MOCK_USERS.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Create a new mock user
    const newUser = {
      id: `user${MOCK_USERS.length + 1}`,
      name,
      email: email.toLowerCase(),
      password, // In a real app, we would hash this
      image: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`,
    };

    // Add to our mock database
    MOCK_USERS.push(newUser);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { message: "User created successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
