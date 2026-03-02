// app/api/auth/onboarding/route.ts
import { prisma } from "@/lib/db";
import { NextResponse } from 'next/server';
import { auth } from "@/lib/auth";

export async function POST(request: Request) {

    try {
        const session = await auth();
        const { username, jobTitle, industry, cvLocales } = await request.json();
        const validChars = /^[a-z0-9-_]+$/
        
        if (!session?.user.id) {
        return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
        }
        // Validation
        if (!username || !jobTitle || !industry || !Array.isArray(cvLocales) || cvLocales.length === 0 || !cvLocales.every(l => l.code && l.label)) {
        return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 });
        }

        if (username.length > 20) {
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

        const reserved = ["admin", "root", "registration", "register", "superuser", "support", "help", "contact", "info", "about", "security", "privacy","dashboard","login","api","studio","www"]
        if (reserved.includes(username.toLowerCase())) {
        return NextResponse.json(
            { error: 'USERNAME_RESERVED' },
            { status: 400 }
        );
        }
        
        const existing = await prisma.user.findUnique({
        where: { username },
        });
        if (existing) {
        return NextResponse.json({ error: 'USERNAME_TAKEN' }, { status: 400 });
        }


        // update user
        const result = await prisma.user.update({
        where: { id: session.user.id },
        data: {
            username,
            jobTitle,
            industry,
            cvLocales,
            onboardingStatus: "COMPLETE",
        },
        });
        return NextResponse.json({ success: true, user: { id: result.id, username: result.username}  }, { status: 200 });
    } catch (error) {
        console.error('Onboarding error:', error);
        return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
    }
}
