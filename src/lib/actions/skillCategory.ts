"use server"

import { prisma } from "@/lib/db";
import { withAuth } from "./helper";


//These functions use the helper function withAuth in helper.ts, 
//this avoids the boilerplate since there are many action files requiring full CRUD
type dataType = {
    id?: string
    title?: Record<string, string> | null;
}

export async function createSkillCategory(data: dataType, locale:string): Promise<{ success: true } | { error: string }> {
   return (withAuth(locale, "/dashboard/skill", (userId) => 
        prisma.skillsCategory.create({
            data: {
                userId: userId,
                title: (data.title ?? {}) as Record<string, string>
            }
        })
   ))
}

export async function updateSkillCategory(data: dataType, locale:string): Promise<{ success: true } | { error: string }> {
    return (withAuth(locale, "/dashboard/skill", (userId) => 
    prisma.skillsCategory.update({
        where: { id: data.id, userId: userId },
        data: {title: (data.title ?? {}) as Record<string, string>}
    }) ))
}

export async function deleteSkillCategory(id: string, locale:string): Promise<{ success: true } | { error: string }> {
    return (withAuth(locale, "/dashboard/skill", (userId) => 
    prisma.skillsCategory.delete({
        where: { id, userId: userId },
    }) ))
}