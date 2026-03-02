"use client"

import { createEducation, updateEducation, deleteEducation } from "@/lib/actions/education";
import React from "react";
import { useCvLocale } from "@/lib/contexts/cvLocale";
import { useLocale } from "next-intl";
import { useState } from "react";

export type EducationData = {
    id: string
    school: Record<string, string> | null;
    diploma: Record<string, string> | null;
    description: Record<string, string> | null;
    startDate: Date | null;
    endDate: Date | null;
    current: boolean;
}

type EducationFormProps = {
    education: EducationData | null;
    onCancel?: () => void
}

type EducationState = {
    id: string
    school: Record<string, string>;
    diploma: Record<string, string>;
    description: Record<string, string>;
    startDate: Date | null;
    endDate: Date | null;
    current: boolean;
    loading: boolean
    error: string
    success: boolean
}

type EducationAction =
    | { type: 'SET_FIELD'; field: string; value: string }
    | { type: 'SET_LOCALE_FIELD'; field: "school" | "diploma" | "description" ; locale: string; value: string }
    | { type: 'SET_DATE_FIELD'; field: 'startDate' | 'endDate' ; value: Date | null}
    | { type: 'SUBMIT_START' }
    | { type: 'SUBMIT_SUCCESS' }
    | { type: 'SUBMIT_ERROR'; error: string }
    | { type: 'SET_BOOL_FIELD'; field: string; value: boolean }


function educationReducer(state: EducationState, action: EducationAction): EducationState {
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
        case 'SET_BOOL_FIELD':
            return { ...state,  [action.field]: action.value } 
        default:
            return state;
    }
}

function getInitialState(education: EducationData | null): EducationState {
    return {
      id: education?.id ?? '',
      school: education?.school ?? {},
      diploma: education?.diploma ?? {},
      description: education?.description ?? {},
      startDate: education?.startDate ?? null,
      endDate: education?.endDate ?? null,
      current: education?.current ?? false,
      loading: false,
      error: '',
      success: false,
    }
}


export default function EducationForm({ education, onCancel }: EducationFormProps) {
    const { activeCvLocale } = useCvLocale();
    const locale = useLocale();
    const [state, dispatch] = React.useReducer(educationReducer, getInitialState(education));
    const { loading, error, success, ...educationData } = state;

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: 'SET_FIELD', field, value: e.target.value });
    }

    const handleLocaleChange = (field: "school" | "diploma" | "description" ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: 'SET_LOCALE_FIELD', field, locale: activeCvLocale.code, value: e.target.value });
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ type: 'SUBMIT_START' }); 
        const result = state.id
          ? await updateEducation({ ...educationData, id: state.id }, locale)
          : await createEducation(educationData, locale)
        if ("error" in result) {
            dispatch({ type: 'SUBMIT_ERROR', error: result.error });
        } else {
            dispatch({ type: 'SUBMIT_SUCCESS' });
            onCancel?.()
        }
    }

    const handleDateChange = (field: 'startDate' | 'endDate') => (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({type: 'SET_DATE_FIELD', field, value: e.target.value ? new Date(e.target.value) : null })
    }


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="school" className="block text-sm font-medium text-gray-700">School</label>
                <input
                    type="text"
                    id="school"
                    value={state.school[activeCvLocale.code] || ''}
                    onChange={handleLocaleChange('school')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label htmlFor="diploma" className="block text-sm font-medium text-gray-700">Diploma</label>
                <textarea
                    id="diploma"
                    value={state.diploma[activeCvLocale.code] || ''}
                    onChange={handleLocaleChange('diploma')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <input
                    type="text"
                    id="description"
                    value={state.description[activeCvLocale.code] || ''}
                    onChange={handleLocaleChange('description')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            
            <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">start date</label>
                <input
                    type="date"
                    id="startDate"
                    value={state.startDate?.toISOString().split('T')[0] ?? ''} //date expects a YYYY-MM-DD string, null can't go into value
                    onChange={handleDateChange('startDate')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">end date</label>
                <input type="checkbox" checked={state.current}
                    onChange={e => dispatch({ type: 'SET_BOOL_FIELD', field: 'current', value: e.target.checked })} />
                {!state.current && (
                    <input
                        type="date"
                        id="endDate"
                        value={state.endDate?.toISOString().split('T')[0] ?? ''} 
                        onChange={handleDateChange('endDate')}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                )}
            </div>
            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="m-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save education'}
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
            {success && <p className="text-green-500">Education saved successfully!</p>}
        </form>
    )
}
