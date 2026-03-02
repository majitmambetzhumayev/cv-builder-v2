"use server"

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

//helper function withAuth won't avoid more boilerplate, so no use here
export async function upsertProfile(data: {
    fullName?: string;
    headline?: Record<string, string>;
    summary?: Record<string, string>;
    photoUrl?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    github?: string;
    linkedin?: string;
}, locale:string): Promise<{ success: true } | { error: string }> {
    const session = await auth();
    if (!session) return { error: 'UNAUTHORIZED' };
    try {
    await prisma.profile.upsert({
        where: { userId: session.user.id },
        create: {
            userId: session.user.id,
            fullName: data.fullName,
            headline: data.headline,
            summary: data.summary,
            photoUrl: data.photoUrl,
            email: data.email,
            phone: data.phone,
            location: data.location,
            website: data.website,
            github: data.github,
            linkedin: data.linkedin
        },
        update: {
            ...data
        }
    });
    } catch (error) {        console.error('Error upserting profile:', error);
        return { error: 'INTERNAL_SERVER_ERROR' };
    }
    revalidatePath(`/${locale}/dashboard/profile`);
    return { success: true};
}