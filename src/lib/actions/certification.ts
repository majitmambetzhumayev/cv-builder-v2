"use server"

import { prisma } from "@/lib/db";
import { withAuth } from "./helper";

//These functions use the helper function withAuth in helper.ts, 
//this avoids the boilerplate since there are many action files requiring full CRUD
type dataType = {
    id?: string
    title?: Record<string, string> | null;
    school?: Record<string, string> | null;
    description?: Record<string, string> | null;
}

function toCertificationData(data: dataType) {
    return {
        title: (data.title ?? {}) as Record<string, string>, //title is required in the prisma schema, can't return an null or undefined
        school: data.school as Record<string, string> | undefined,
        description: data.description as Record<string, string> | undefined,
    }
}

export async function createCertification(data: dataType, locale:string): Promise<{ success: true } | { error: string }> {
   return (withAuth(locale, "/dashboard/certification", (userId) => 
        prisma.certification.create({
            data: {
                userId: userId,
                ...toCertificationData(data)
            }
        })
   ))
}

export async function updateCertification(data: dataType, locale:string): Promise<{ success: true } | { error: string }> {
    return (withAuth(locale, "/dashboard/certification", (userId) => 
    prisma.certification.update({
        where: { id: data.id, userId: userId },
        data: toCertificationData(data)
    }) ))
}

export async function deleteCertification(id: string, locale:string): Promise<{ success: true } | { error: string }> {
    return (withAuth(locale, "/dashboard/certification", (userId) => 
    prisma.certification.delete({
        where: { id, userId: userId },
    }) ))
}