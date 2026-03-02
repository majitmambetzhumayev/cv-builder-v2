"use server"

import { prisma } from "@/lib/db";
import { withAuth } from "./helper";

//These functions use the helper function withAuth in helper.ts, 
//this avoids the boilerplate since there are many action files requiring full CRUD
type dataType = {
    id?: string
    title?: Record<string, string> | null;
    description?: Record<string, string> | null;
    link?: string | null;
    github?: string | null;
    image?: string | null;
}

function toProjectData(data: dataType) {
    return {
        title: data.title as Record<string, string> | undefined,
        description: data.description as Record<string, string> | undefined,
        link: data.link,
        github: data.github,
        image: data.image
    }
}

export async function createProject(data: dataType, locale:string): Promise<{ success: true } | { error: string }> {
   return (withAuth(locale, "/dashboard/project", (userId) => 
        prisma.project.create({
            data: {
                userId: userId,
                ...toProjectData(data)
            }
        })
   ))
}

export async function updateProject(data: dataType, locale:string): Promise<{ success: true } | { error: string }> {
    return (withAuth(locale, "/dashboard/project", (userId) => 
    prisma.project.update({
        where: { id: data.id, userId: userId },
        data: toProjectData(data)
    }) ))
}

export async function deleteProject(id: string, locale:string): Promise<{ success: true } | { error: string }> {
    return (withAuth(locale, "/dashboard/project", (userId) => 
    prisma.project.delete({
        where: { id, userId: userId },
    }) ))
}