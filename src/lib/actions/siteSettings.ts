"use server"

import { prisma } from "@/lib/db";
import { Prisma } from '@/generated/prisma/client'
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

//helper function withAuth won't avoid more boilerplate, so no use here
export async function upsertSiteSettings(data: {
    layoutId: string,
    themeMode: string;
    accentColor: string;
    sectionOrder: string[]; 
}, locale:string): Promise<{ success: true } | { error: string }> {
    const session = await auth();
    if (!session) return { error: 'UNAUTHORIZED' };
    try {
    await prisma.siteSettings.upsert({
        where: { userId: session.user.id },
        create: {
            userId: session.user.id,
            layoutId: data.layoutId,
            themeMode: data.themeMode,
            accentColor: data.accentColor,
            sectionOrder: data.sectionOrder as Prisma.InputJsonValue
        },
        update: {
            layoutId: data.layoutId,
            themeMode: data.themeMode,
            accentColor: data.accentColor,
            sectionOrder: data.sectionOrder as Prisma.InputJsonValue
        }
    });
    } catch (error) {        console.error('Error upserting site settings:', error);
        return { error: 'INTERNAL_SERVER_ERROR' };
    }
    revalidatePath(`/${locale}/dashboard/settings`);
    return { success: true};
}