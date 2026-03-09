"use client"
import { useState } from "react"
import ProjectForm, { ProjectData } from "./ProjectForm"
import { useCvLocale } from "@/lib/contexts/cvLocale";
import { useLocale, useTranslations } from "next-intl";
import { deleteProject } from "@/lib/actions/project";
import { Trash } from "lucide-react";


type ProjectListProps = {
    projects: ProjectData[]
}

export default function ProjectList ( {projects} : ProjectListProps) {
    const [editingId, setEditingId] = useState("")
    const { activeCvLocale } = useCvLocale();
    const t = useTranslations('dashboard.project.list');
    const locale = useLocale()

    const handleDelete = async (id:string) => {
        await deleteProject(id, locale)
    }

    return (
        <div id="projectList">
            {editingId !== "new" &&
            <button onClick={() => setEditingId("new")}
                className="inline-flex items-center m-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50">
                {t("add")}
            </button>}
            {editingId === "new" && (
                <ProjectForm project={null} onCancel={() => setEditingId("")} />
            )}
            <ul>
                {projects.map(c => (
                    <li key={c.id}>
                        {editingId === c.id 
                            ? <ProjectForm project={c} onCancel={() => setEditingId("")}/>
                            : <div>
                                <h3 className="p-4">
                                {c.title?.[activeCvLocale.code]}
                                </h3>
                                <p className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    {c.description?.[activeCvLocale.code]}
                                </p>
                                <p className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    {c.link}
                                </p>
                                <p className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    {c.github}
                                </p>
                                {/* eslint-disable-next-line @next/next/no-img-element */} 
                                {c.image ? <img 
                                alt="Project Image"
                                src={c.image} 
                                /> : <p className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    {t('no-image')}
                                </p>}
                                
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