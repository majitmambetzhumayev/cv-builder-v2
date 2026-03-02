"use client"

import { createSkillCategory, updateSkillCategory, deleteSkillCategory } from "@/lib/actions/skillCategory";
import { useCvLocale } from "@/lib/contexts/cvLocale";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import SkillManager from "./SkillManager";
import { Trash } from "lucide-react";

type SkillCategoryManagerProps = {
      categories: { id: string, title: Record<string, string> }[]
      skills: { id: string, title: Record<string, string>, categoryId: string | null }[]
  }

export default function SkillCategoryManager({ categories, skills }: SkillCategoryManagerProps)
    {
    const { activeCvLocale } = useCvLocale();
    const [skillCatInput, setSkillCatInput] = useState('')
    const t = useTranslations("dashboard.skillscategory.form")
    const locale = useLocale()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingValue, setEditingValue] = useState("")

    const handleAddCat = async() => {
        if (!skillCatInput.trim()) return
        await createSkillCategory({ title: { [activeCvLocale.code]: skillCatInput.trim()}}, locale)
        setSkillCatInput("")
    }

    const handleUpdateCat = async(id: string) => {
        if (!editingValue.trim()) return
        await updateSkillCategory({id, title: {[activeCvLocale.code]: editingValue.trim()}}, locale)
        setEditingId(null)
        setEditingValue("")
    }

    const handleDeleteCat = async (id: string) => {
        await deleteSkillCategory(id, locale)
    }
    
    return (
        <div id="skillCategoryManager" className="p-8">
            <div id="categoryBar" className="w-full flex flex-start bg-slate-900">
                <div id="addCategory" className="p-4 flex flex-start">
                    <input
                        type="text" 
                        value={skillCatInput}
                        placeholder={t("add-skill-category")}
                        onChange = {e => setSkillCatInput(e.target.value)}
                        onKeyDown={e => {if (e.key === "Enter") { e.preventDefault(); handleAddCat()}}}
                        className="text-xl mt-1 block border border-gray-300 rounded-md shadow-sm p-2"
                    />
                    <button 
                        type="button"
                        onClick={handleAddCat}
                        className="mx-4 px-4 text-lg bg-slate-100 text-slate-900 rounded-md"
                    >
                        Add
                    </button>
                </div>
            </div>
            <ul>
                {categories.map(cat => (
                    <li key={cat.id} className="mt-1 block w-full border bg-slate-800  shadow-sm p-2">
                        <div className="flex flex-row justify-between">{editingId === cat.id
                                ? <input
                                    autoFocus
                                    value={editingValue}
                                    onChange={e => setEditingValue(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') handleUpdateCat(cat.id)
                                        if (e.key === 'Escape') { setEditingId(null); setEditingValue('') }
                                        }}
                                    />
                                : 
                                    <h3
                                        onDoubleClick={() => 
                                            { setEditingId(cat.id); 
                                            setEditingValue(cat.title?.[activeCvLocale.code] ?? '')
                                            }}
                                        className="p-2"
                                        >
                                    {cat.title?.[activeCvLocale.code]}
                                    </h3>

                            }
                            <button type="button" onClick={() => handleDeleteCat(cat.id)}>
                                <Trash size={16}/>
                            </button>
                        </div>
                        <SkillManager 
                                skills={skills.filter(s => s.categoryId === cat.id)}
                                categoryId={cat.id}
                            />
                    </li>
                ))}
                    <li className="mt-1 block w-full border bg-slate-800  shadow-sm p-2">
                    <h3 className="p-2">{t("uncategorized")}</h3>
                      <SkillManager
                            skills={skills.filter(s => s.categoryId === null)}
                            categoryId={null}
                        />    
                    </li>
            </ul>
        </div>
    )
}
