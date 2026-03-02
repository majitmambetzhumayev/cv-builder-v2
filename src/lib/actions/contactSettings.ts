"use server"

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

//helper function withAuth won't avoid more boilerplate, so no use here
export async function upsertContactSettings(data: {
    public: boolean,
    sectionTitle?: Record<string, string>;
    subtitle?: Record<string, string>;
    successMessage?: Record<string, string>; // these are messages for the user to customize 
    errorMessage?: Record<string, string>;
}, locale:string): Promise<{ success: true } | { error: string }> {
    const session = await auth();
    if (!session) return { error: 'UNAUTHORIZED' };
    try {
    await prisma.contactSettings.upsert({
        where: { userId: session.user.id },
        create: {
            userId: session.user.id,
            public: data.public,
            sectionTitle: data.sectionTitle as Record<string, string> | undefined,
            subtitle: data.subtitle as Record<string, string> | undefined,
            successMessage: data.successMessage as Record<string, string> | undefined,
            errorMessage: data.errorMessage as Record<string, string> | undefined
        },
        update: {
            public: data.public,
            sectionTitle: data.sectionTitle as Record<string, string> | undefined,
            subtitle: data.subtitle as Record<string, string> | undefined,
            successMessage: data.successMessage as Record<string, string> | undefined,
            errorMessage: data.errorMessage as Record<string, string> | undefined
        }
    });
    } catch (error) {        console.error('Error upserting contact settings:', error);
        return { error: 'INTERNAL_SERVER_ERROR' };
    }
    revalidatePath(`/${locale}/dashboard/settings`);
    return { success: true};
}