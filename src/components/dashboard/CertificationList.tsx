"use client"
import { useState } from "react"
import CertificationForm, { CertificationData } from "./CertificationForm"
import { useCvLocale } from "@/lib/contexts/cvLocale";
import { useLocale, useTranslations } from "next-intl";
import { deleteCertification } from "@/lib/actions/certification";
import { Trash } from "lucide-react";

type CertificationListProps = {
    certifications: CertificationData[]
}

export default function CertificationList ( {certifications} : CertificationListProps) {
    const [editingId, setEditingId] = useState("")
    const { activeCvLocale } = useCvLocale();
    const t = useTranslations('dashboard.certification.list');
    const locale = useLocale()

    const handleDelete = async (id:string) => {
        deleteCertification(id, locale)
    }

    return (
        <div id="certificationList">
            {editingId !== "new" &&
            <button onClick={() => setEditingId("new")}
                className="inline-flex items-center m-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50">
                {t("add")}
            </button>}
            {editingId === "new" && (
                <CertificationForm certification={null} onCancel={() => setEditingId("")} />
            )}
            <ul>
                {certifications.map(c => (
                    <li key={c.id}>
                        {editingId === c.id 
                            ? <CertificationForm certification={c} onCancel={() => setEditingId("")}/>
                            : <div>
                                <h3 className="p-4">
                                {c.title?.[activeCvLocale.code]}
                                </h3>
                                <p className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    {c.school?.[activeCvLocale.code]}
                                </p>
                                <p className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    {c.date?.toLocaleDateString()} {/* React can't render a Date object directly so we need to convert it */}
                                </p>
                                <p className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    {c.description?.[activeCvLocale.code]}
                                </p>
                                <button 
                                    onClick={() => setEditingId(c.id)}
                                    className="m-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50">
                                    {(t("edit"))}
                                </button>
                                <button type="button" 
                                    onClick={() => handleDelete(c.id)}>
                                    <Trash size={16} color="red"/>
                                </button>
                            </div>}
                    </li>
                ))}
            </ul>
        </div>
    )
}