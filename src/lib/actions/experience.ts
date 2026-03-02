"use server"

import { prisma } from "@/lib/db";
import { withAuth } from "./helper";

//These functions use the helper function withAuth in helper.ts, 
//this avoids the boilerplate since there are many action files requiring full CRUD
type dataType = {
    id?: string
    role?: Record<string, string> | null;
    description?: Record<string, string> | null;
    company?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    current?: boolean;
    chips?: string[];
}

function toExperienceData(data: dataType) {
    return {
        role: data.role as Record<string, string> | undefined,
        description: data.description as Record<string, string> | undefined,
        company: data.company,
        startDate: data.startDate,
        endDate: data.endDate,
        current: data.current,
        chips: data.chips || [],
    }
}

export async function createExperience(data: dataType, locale:string): Promise<{ success: true } | { error: string }> {
   return (withAuth(locale, "/dashboard/experience", (userId) => 
        prisma.experience.create({
            data: {
                userId: userId,
                ...toExperienceData(data)
            }
        })
   ))
}

export async function updateExperience(data: dataType, locale:string): Promise<{ success: true } | { error: string }> {
    return (withAuth(locale, "/dashboard/experience", (userId) => 
    prisma.experience.update({
        where: { id: data.id, userId: userId },
        data: toExperienceData(data)
    }) ))
}

export async function deleteExperience(id: string, locale:string): Promise<{ success: true } | { error: string }> {
    return (withAuth(locale, "/dashboard/experience", (userId) => 
    prisma.experience.delete({
        where: { id, userId: userId },
    }) ))
}