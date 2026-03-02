"use client"

import { createSkill, updateSkill, deleteSkill } from "@/lib/actions/skill";
import React from "react";
import { useCvLocale } from "@/lib/contexts/cvLocale";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { X } from "lucide-react"

type SkillsProps = {
      skills: { id: string, title: Record<string, string>, categoryId: string | null }[]
      categoryId: string | null
  }



export default function SkillManager({ skills, categoryId }: SkillsProps) {
    const { activeCvLocale } = useCvLocale();
    const [skillInput, setSkillInput] = useState('')
    const t = useTranslations("dashboard.skills.form")
    const locale = useLocale()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingValue, setEditingValue] = useState("")

    const handleAddSkill = async() => {
        if (!skillInput.trim()) return
        await createSkill({ title: { [activeCvLocale.code]: skillInput.trim()}, categoryId: categoryId}, locale)
        setSkillInput("")
    }

    const handleUpdateSkill = async(id: string) => {
        if (!editingValue.trim()) return
        await updateSkill({id, title: {[activeCvLocale.code]: editingValue.trim()}, categoryId }, locale)
        setEditingId(null)
        setEditingValue("")
    }

    const handleDeleteSkill = async (id: string) => {
        await deleteSkill(id, locale)
    }
    
    return (
        <div id="skillManager"
        className="mx-2 px-2 py-2">
            <input 
                type="text" 
                value={skillInput}
                placeholder={t('add-skill')}
                onChange = {e => setSkillInput(e.target.value)}
                onKeyDown={e => {if (e.key === "Enter") { e.preventDefault(); handleAddSkill()}}}
                className="border border-white/20 rounded-sm py-1 px-2"
            />
            <button 
                type="button"
                onClick={handleAddSkill}
                className="py-1 px-2 mx-2 bg-white/20 rounded-sm"
            >
                Add
            </button>
            <ul className="py-4 flex flex-row flex-wrap">
                {skills.map(s => (
                    <li key={s.id}
                    className="bg-slate-400 text-neutral-800 m-2 rounded-sm p-2 content-center">
                        {editingId === s.id
                            ? <input
                                autoFocus
                                value={editingValue}
                                onBlur={() => { setEditingId(null); setEditingValue("")}}
                                onChange={e => setEditingValue(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') handleUpdateSkill(s.id)
                                    if (e.key === 'Escape') { setEditingId(null); setEditingValue('') }
                                    }}
                                />
                            : <span onDoubleClick={() => { setEditingId(s.id); setEditingValue(s.title?.[activeCvLocale.code] ?? '')
                            }}>
                                {s.title?.[activeCvLocale.code]}
                            </span>
                        }
                        <button type="button" onClick={() => handleDeleteSkill(s.id)} className="px-1">
                            <X size={16}/>
                        </button>
                    </li>
                )

                )}
            </ul>
        </div>
    )
}
