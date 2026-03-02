"use client"
import { useState } from "react"
import ExperienceForm, { ExperienceData } from "./ExperienceForm"
import { deleteExperience } from "@/lib/actions/experience";
import { useCvLocale } from "@/lib/contexts/cvLocale";
import { useLocale, useTranslations } from "next-intl";
import { Trash } from "lucide-react";

type ExperienceListProps = {
    experiences: ExperienceData[]
}

export default function ExperienceList ( {experiences} : ExperienceListProps) {
    const [editingId, setEditingId] = useState("")
    const { activeCvLocale } = useCvLocale();
    const t = useTranslations('dashboard.experience.list');
    const locale = useLocale()

    const handleDelete = async (id: string) => {
                    await deleteExperience(id, locale)
                }

    return (
        <div id="experienceList">
            {editingId !== "new" &&
            <button onClick={() => setEditingId("new")}
                className="inline-flex items-center m-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50">
                {t("add")}
            </button>}
            {editingId === "new" && (
                <ExperienceForm experience={null} onCancel={() => setEditingId("")} />
            )}
            <ul>
                {experiences.map(exp => (
                    <li key={exp.id}>
                        {editingId === exp.id 
                            ? <ExperienceForm experience={exp} onCancel={() => setEditingId("")}/>
                            : <div>
                                <h3 className="p-4">
                                {exp.role?.[activeCvLocale.code]}
                                </h3>
                                <p className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    {exp.description?.[activeCvLocale.code]}
                                </p>
                                <p className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    {exp.company}
                                </p>
                                <p className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    {exp.startDate?.toLocaleDateString()} {/* React can't render a Date object directly so we need to convert it */}
                                </p>
                                {!exp.current && 
                                (<p className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    {exp.endDate?.toLocaleDateString()}
                                </p>)}
                                <p className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    {exp.current ? (t('current')) : (t('past'))}.
                                </p>
                                <ul>
                                    {exp.chips.map((chip) => (
                                        <li key={chip}>
                                            <p className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2">{chip}</p>
                                        </li>
                                    ))}
                                </ul>
                                <button 
                                    onClick={() => setEditingId(exp.id)}
                                    className="m-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50">
                                    {(t('edit'))}
                                </button>
                                <button type="button" 
                                    onClick={() => handleDelete(exp.id)}>
                                    <Trash size={16} color="red"/>
                                </button>
                            </div>}
                    </li>
                ))}
            </ul>
        </div>
    )
}