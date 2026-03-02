"use client"

import { createExperience, updateExperience  } from "@/lib/actions/experience";
import React from "react";
import { useCvLocale } from "@/lib/contexts/cvLocale";
import { useLocale } from "next-intl";
import { useState } from "react";

export type ExperienceData = {
    id: string
    role: Record<string, string> | null;
    description: Record<string, string> | null;
    company: string | null;
    startDate: Date | null;
    endDate: Date | null;
    current: boolean;
    chips: string[];
}

type ExperienceFormProps = {
    experience: ExperienceData | null;
    onCancel?: () => void
}

type ExperienceState = {
    id: string
    role: Record<string, string>;
    description: Record<string, string>;
    company: string;
    startDate: Date | null;
    endDate: Date | null;
    current: boolean;
    chips: string[];
    loading: boolean
    error: string
    success: boolean
}

type ExperienceAction =
    | { type: 'SET_FIELD'; field: string; value: string }
    | { type: 'SET_LOCALE_FIELD'; field: "role" | "description" ; locale: string; value: string }
    | { type: 'SET_DATE_FIELD'; field: 'startDate' | 'endDate' ; value: Date | null}
    | { type: 'ADD_CHIP'; value: string}
    | { type: 'REMOVE_CHIP'; value: string}
    | { type: 'SUBMIT_START' }
    | { type: 'SUBMIT_SUCCESS' }
    | { type: 'SUBMIT_ERROR'; error: string }
    | { type: 'SET_BOOL_FIELD'; field: string; value: boolean }


function experienceReducer(state: ExperienceState, action: ExperienceAction): ExperienceState {
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
        case 'ADD_CHIP':
            return { ...state, chips: [...state.chips, action.value]}
        case 'REMOVE_CHIP' :
            return { ...state, chips: state.chips.filter(c=>c !==action.value)}
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

function getInitialState(experience: ExperienceData | null): ExperienceState {
    return {
      id: experience?.id ?? '',
      role: experience?.role ?? {},
      description: experience?.description ?? {},
      company: experience?.company ?? '',
      startDate: experience?.startDate ?? null,
      endDate: experience?.endDate ?? null,
      current: experience?.current ?? false,
      chips: experience?.chips ?? [],
      loading: false,
      error: '',
      success: false,
    }
}


export default function ExperienceForm({ experience, onCancel }: ExperienceFormProps) {
    const { activeCvLocale } = useCvLocale();
    const locale = useLocale();
    const [state, dispatch] = React.useReducer(experienceReducer, getInitialState(experience));
    const { loading, error, success, ...experienceData } = state;
    const [chipInput, setChipInput] = useState('')

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: 'SET_FIELD', field, value: e.target.value });
    }

    const handleLocaleChange = (field: "role" | "description" ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: 'SET_LOCALE_FIELD', field, locale: activeCvLocale.code, value: e.target.value });
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ type: 'SUBMIT_START' }); 
        const result = state.id
          ? await updateExperience({ ...experienceData, id: state.id }, locale)
          : await createExperience(experienceData, locale)
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
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <input
                    type="text"
                    id="role"
                    value={state.role[activeCvLocale.code] || ''}
                    onChange={handleLocaleChange('role')}
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
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                <textarea
                    id="company"
                    value={state.company}
                    onChange={handleChange('company')}
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
                <input
                    type="text"
                    value={chipInput}
                    onChange={e => setChipInput(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            e.preventDefault() // prevent form submit
                            if (chipInput.trim()) {
                                dispatch({ type: 'ADD_CHIP', value: chipInput.trim() })
                                setChipInput('')
                            }
                        }
                    }}
                />
                {state.chips.map(chip => (
                    <span key={chip}>
                        {chip}
                        <button type="button" onClick={() => dispatch({ type: 'REMOVE_CHIP', value: chip })}>×</button>
                    </span>
                ))}
            </div>
            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="m-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save experience'}
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
            {success && <p className="text-green-500">experience saved successfully!</p>}
        </form>
    )
}
