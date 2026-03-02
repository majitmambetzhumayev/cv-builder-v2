// app/api/auth/registration/route.ts
import { prisma } from "@/lib/db";
import bcryptjs from 'bcryptjs';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
    
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'PASSWORD_TOO_SHORT' },
        { status: 400 }
      );
    }

    // Verifies if email already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return NextResponse.json({ error: 'EMAIL_ALREADY_EXISTS' }, { status: 400 });
    }


    // Hash password + create user
    const passwordHash = await bcryptjs.hash(password, 10);
    const result = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });
    return NextResponse.json({ success: true, user: { id: result.id, email: result.email, name: result.name }  }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}
