"use server"

import { prisma } from "@/lib/db";
import { withAuth } from "./helper";


//These functions use the helper function withAuth in helper.ts, 
//this avoids the boilerplate since there are many action files requiring full CRUD
type dataType = {
    id?: string
    school?: Record<string, string> | null;
    diploma?: Record<string, string> | null;
    description?: Record<string, string> | null;
    startDate?: Date | null;
    endDate?: Date | null;
    current?: boolean;
}

function toEducationData(data: dataType) {
    return {
        school: data.school as Record<string, string> | undefined,
        description: data.description as Record<string, string> | undefined,
        diploma: data.diploma as Record<string, string> | undefined,
        startDate: data.startDate,
        endDate: data.endDate,
        current: data.current,
    }
}

export async function createEducation(data: dataType, locale:string): Promise<{ success: true } | { error: string }> {
   return (withAuth(locale, "/dashboard/education", (userId) => 
        prisma.education.create({
            data: {
                userId: userId,
                ...toEducationData(data)
            }
        })
   ))
}

export async function updateEducation(data: dataType, locale:string): Promise<{ success: true } | { error: string }> {
    return (withAuth(locale, "/dashboard/education", (userId) => 
    prisma.education.update({
        where: { id: data.id, userId: userId },
        data: toEducationData(data)
    }) ))
}

export async function deleteEducation(id: string, locale:string): Promise<{ success: true } | { error: string }> {
    return (withAuth(locale, "/dashboard/education", (userId) => 
    prisma.education.delete({
        where: { id, userId: userId },
    }) ))
}