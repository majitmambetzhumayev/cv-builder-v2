"use client"

import { createCertification, updateCertification  } from "@/lib/actions/certification";
import React from "react";
import { useCvLocale } from "@/lib/contexts/cvLocale";
import { useLocale } from "next-intl";

export type CertificationData = {
    id: string
    title: Record<string, string> | null;
    school: Record<string, string> | null;
    date: Date | null;
    description: Record<string, string> | null;
}

type CertificationFormProps = {
    certification: CertificationData | null;
    onCancel?: () => void
}

type CertificationState = {
    id: string
    title: Record<string, string>;
    school: Record<string, string>;
    date: Date| null;
    description: Record<string, string>;
    loading: boolean
    error: string
    success: boolean
}

type CertificationAction =
    | { type: 'SET_FIELD'; field: string; value: string }
    | { type: 'SET_LOCALE_FIELD'; field: "title" | "school" | "description" ; locale: string; value: string }
    | { type: 'SET_DATE_FIELD'; field: 'date' ; value: Date | null}
    | { type: 'SUBMIT_START' }
    | { type: 'SUBMIT_SUCCESS' }
    | { type: 'SUBMIT_ERROR'; error: string }

function certificationReducer(state: CertificationState, action: CertificationAction): CertificationState {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'SET_LOCALE_FIELD':
            return {
                ...state,
                [action.field]: {
                    ...state[action.field],
                    [action.locale]: action.value
                }
            };
        case 'SET_DATE_FIELD':
            return { ...state,  [action.field]: action.value}
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

function getInitialState(certification: CertificationData | null): CertificationState {
    return {
      id: certification?.id ?? '',
      title: certification?.title ?? {},
      school: certification?.school ?? {},
      date: certification?.date ?? null,
      description: certification?.description ?? {},
      loading: false,
      error: '',
      success: false,
    }
}


export default function CertificationForm({ certification, onCancel }: CertificationFormProps) {
    const { activeCvLocale } = useCvLocale();
    const locale = useLocale();
    const [state, dispatch] = React.useReducer(certificationReducer, getInitialState(certification));
    const { loading, error, success, ...certificationData } = state;


    const handleLocaleChange = (field: "title" | "description" | "school" ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: 'SET_LOCALE_FIELD', field, locale: activeCvLocale.code, value: e.target.value });
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ type: 'SUBMIT_START' }); 
        const result = state.id
          ? await updateCertification({ ...certificationData, id: state.id }, locale)
          : await createCertification(certificationData, locale)
        if ("error" in result) {
            dispatch({ type: 'SUBMIT_ERROR', error: result.error });
        } else {
            dispatch({ type: 'SUBMIT_SUCCESS' });
            onCancel?.()
        }
    }

    const handleDateChange = (field: 'date') => (e: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({type: 'SET_DATE_FIELD', field, value: e.target.value ? new Date(e.target.value) : null })
        }


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">title</label>
                <input
                    type="text"
                    id="title"
                    value={state.title[activeCvLocale.code] || ""}
                    onChange={handleLocaleChange("title")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <input
                    type="text"
                    id="description"
                    value={state.description[activeCvLocale.code] || ""}
                    onChange={handleLocaleChange("description")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label htmlFor="school" className="block text-sm font-medium text-gray-700">school</label>
                <textarea
                    id="school"
                    value={state.school[activeCvLocale.code] || ""}
                    onChange={handleLocaleChange("school")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">start date</label>
                <input
                    type="date"
                    id="date"
                    value={state.date?.toISOString().split('T')[0] ?? ''} //date expects a YYYY-MM-DD string, null can't go into value
                    onChange={handleDateChange('date')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="m-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save certification'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="m-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                >
                    Cancel
                </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">certification saved successfully!</p>}
        </form>
    )
}
