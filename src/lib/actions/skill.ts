"use server"

import { prisma } from "@/lib/db";
import { withAuth } from "./helper";


//These functions use the helper function withAuth in helper.ts, 
//this avoids the boilerplate since there are many action files requiring full CRUD
type dataType = {
    id?: string
    title?: Record<string, string> | null;
    categoryId?: string | null
}

function toSkillData(data: dataType) {
    return {
        title: (data.title ?? {}) as Record<string, string>,
        categoryId: data.categoryId ?? undefined
    }
}

export async function createSkill(data: dataType, locale:string): Promise<{ success: true } | { error: string }> {
   return (withAuth(locale, "/dashboard/skill", (userId) => 
        prisma.skill.create({
            data: {
                userId: userId,
                ...toSkillData(data)
            }
        })
   ))
}

export async function updateSkill(data: dataType, locale:string): Promise<{ success: true } | { error: string }> {
    return (withAuth(locale, "/dashboard/skill", (userId) => 
    prisma.skill.update({
        where: { id: data.id, userId: userId },
        data: toSkillData(data)
    }) ))
}

export async function deleteSkill(id: string, locale:string): Promise<{ success: true } | { error: string }> {
    return (withAuth(locale, "/dashboard/skill", (userId) => 
    prisma.skill.delete({
        where: { id, userId: userId },
    }) ))
}