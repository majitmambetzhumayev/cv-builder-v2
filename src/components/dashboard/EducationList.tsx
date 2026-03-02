"use client"
import { useState } from "react"
import EducationForm, { EducationData } from "./EducationForm"
import { useCvLocale } from "@/lib/contexts/cvLocale";
import { useTranslations } from "next-intl";

type EducationListProps = {
    education: EducationData[]
}

export default function EducationList ( {education} : EducationListProps) {
    const [editingId, setEditingId] = useState("")
    const { activeCvLocale } = useCvLocale();
    const t = useTranslations('dashboard.education.list');

    return (
        <div id="educationList">
            {editingId !== "new" &&
            <button onClick={() => setEditingId("new")}
                className="inline-flex items-center m-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50">
                {t("add")}
            </button>}
            {editingId === "new" && (
    <EducationForm education={null} onCancel={() => setEditingId("")} />
            )}
            <ul>
                {education.map(edu => (
                    <li key={edu.id}>
                        {editingId === edu.id 
                            ? <EducationForm education={edu} onCancel={() => setEditingId("")}/>
                            : <div>
                                <h3 className="p-4">
                                {edu.school?.[activeCvLocale.code]}
                                </h3>
                                <p className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    {edu.diploma?.[activeCvLocale.code]}
                                </p>
                                <p className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    {edu.description?.[activeCvLocale.code]}
                                </p>
                                <p className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    {edu.startDate?.toLocaleDateString()} {/* React can't render a Date object directly so we need to convert it */}
                                </p>
                                {!edu.current && 
                                (<p className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    {edu.endDate?.toLocaleDateString()}
                                </p>)}
                                <p className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    {edu.current ? (t('current')) : (t('past'))}.
                                </p>
                                <button 
                                    onClick={() => setEditingId(edu.id)}
                                    className="m-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50">
                                    {(t('edit'))}
                                </button>
                            </div>}
                    </li>
                ))}
            </ul>
        </div>
    )
}