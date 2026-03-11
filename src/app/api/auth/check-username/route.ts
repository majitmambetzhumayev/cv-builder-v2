// app/api/auth/check-username/route.ts
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {

    try {
        
        const username = request.nextUrl.searchParams.get('username');
        const validChars = /^[a-z0-9-_]+$/

        if (!username) return NextResponse.json({ available: false }, { status: 400 });
        
        if (username.length > 30) {
        return NextResponse.json(
            { error: 'USERNAME_TOO_LONG' },
            { status: 400 }
        );
        }
        if (username.length < 3) {
        return NextResponse.json(
            { error: 'USERNAME_TOO_SHORT' },
            { status: 400 }
        );
        }

        if (!validChars.test(username)) {
        return NextResponse.json(
            { error: 'INVALID_USERNAME_CHARS' },
            { status: 400 }
        );
        }

        const reserved = ["admin", "root", "register","registration", "superuser", "support", "help", "contact", "info", "about", "security", "privacy","dashboard","login","api","studio","www"]
        if (reserved.includes(username.toLowerCase())) {
        return NextResponse.json(
            { available: false, error: 'USERNAME_RESERVED' },
            { status: 200 }
        );
        }
        
        const existing = await prisma.user.findUnique({
        where: { username },
        });
        if (existing) {
        return NextResponse.json({ available: false, error: 'USERNAME_TAKEN' }, { status: 200 });
        }


        
        return NextResponse.json({ available: true, message: 'USERNAME_AVAILABLE' }, { status: 200 });
    } catch (error) {
        console.error('Check username error:', error);
        return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
    }
}
