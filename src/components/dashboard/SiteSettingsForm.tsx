"use client"

import { upsertSiteSettings } from "@/lib/actions/siteSettings";
import React from "react";
import { useLocale } from "next-intl";
import { useState } from "react";

type SiteSettingsData = {
    layoutId: string;
    themeMode: string;
    accentColor: string;
    sectionOrder: string[];
}

type SiteSettingsFormProps = {
    siteSettings: SiteSettingsData | null;
}

type SiteSettingsState = {
    layoutId: string,
    themeMode: string;
    accentColor: string;
    sectionOrder: string[];
    loading: boolean
    error: string
    success: boolean
}

type SiteSettingsAction =
    | { type: 'SET_FIELD'; field: string; value: string }
    | { type: 'SUBMIT_START' }
    | { type: 'SUBMIT_SUCCESS' }
    | { type: 'SUBMIT_ERROR'; error: string }


function SiteSettingsReducer(state: SiteSettingsState, action: SiteSettingsAction): SiteSettingsState {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value }; 
        case 'SUBMIT_START':
            return { ...state, loading: true, error: '', success: false };
        case 'SUBMIT_SUCCESS':
            return { ...state, loading: false, success: true };
        case 'SUBMIT_ERROR':
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
}

function getInitialState(siteSettings: SiteSettingsData | null): SiteSettingsState {
    return {
      layoutId: siteSettings?.layoutId ?? "",
      themeMode: siteSettings?.themeMode ?? "",
      accentColor: siteSettings?.accentColor?? "",
      sectionOrder: siteSettings?.sectionOrder ?? [],
      loading: false,
      error: '',
      success: false,
    }
}


export default function SiteSettingsForm({ siteSettings }: SiteSettingsFormProps) {
    const locale = useLocale();
    const [state, dispatch] = React.useReducer(SiteSettingsReducer, getInitialState(siteSettings));
    const { loading, error, success, ...SiteSettingsData } = state;
    const [sectionOrder, setSectionOrder ] = useState<string[]>(
      siteSettings?.sectionOrder ?? ["cv", "projects", "contact"]
  )
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ type: 'SUBMIT_START' }); 
        const result = await upsertSiteSettings({...SiteSettingsData, sectionOrder }, locale);
        if ("error" in result) {
            dispatch({ type: 'SUBMIT_ERROR', error: result.error });
        } else {
            dispatch({ type: 'SUBMIT_SUCCESS' });
        }
    }

      const moveUp = (index: number) => {
      if (index === 0) return
      const next = [...sectionOrder]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      setSectionOrder(next)
  }

  const moveDown = (index: number) => {
      if (index === sectionOrder.length - 1) return
      const next = [...sectionOrder]
      ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
      setSectionOrder(next)
  }


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="layoutId" className="block text-sm font-medium text-gray-700">Section Title</label>
                <select 
                    value={state.layoutId} 
                    onChange={e => 
                        dispatch({ 
                            type: 'SET_FIELD', 
                            field: 'layoutId', 
                            value: e.target.value })}>
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                </select>
            </div>
            <div>
                <label htmlFor="themeMode" className="block text-sm font-medium text-gray-700">Section Title</label>
                <select 
                    value={state.themeMode} 
                    onChange={e => 
                        dispatch({ 
                            type: 'SET_FIELD', 
                            field: 'themeMode', 
                            value: e.target.value })}>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                </select>
            </div>
            <div>
                <label htmlFor="accentColor" className="block text-sm font-medium text-gray-700">Section Title</label>
                <select 
                    value={state.accentColor} 
                    onChange={e => 
                        dispatch({ 
                            type: 'SET_FIELD', 
                            field: 'accentColor', 
                            value: e.target.value })}>
                    <option value="forest">Forest</option>
                    <option value="slate">Slate</option>
                </select>
            </div>
            <div>
                <label htmlFor="themeMode" className="block text-sm font-medium text-gray-700">Section Title</label>
                {sectionOrder.map((section, index) => (
                    <div key={section}>
                        <span>{section}</span>
                        <button type="button" onClick={() => moveUp(index)} disabled={index === 0}>↑</button>
                        <button type="button" onClick={() => moveDown(index)} disabled={index === sectionOrder.length -
                1}>↓</button>
                    </div>
                ))}
            </div>
            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save siteSettings'}
                </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">site Settings saved successfully!</p>}
        </form>
    )
}
