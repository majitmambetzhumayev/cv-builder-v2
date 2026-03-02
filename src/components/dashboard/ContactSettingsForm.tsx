"use client"

import { upsertContactSettings } from "@/lib/actions/contactSettings";
import React from "react";
import { useCvLocale } from "@/lib/contexts/cvLocale";
import { useLocale } from "next-intl";

type ContactSettingsData = {
    public: boolean;
    sectionTitle: Record<string, string> | null;
    subtitle: Record<string, string> | null;
    successMessage: Record<string, string> | null;
    errorMessage: Record<string, string> | null;
}

type ContactSettingsFormProps = {
    contactSettings: ContactSettingsData | null;
}

type ContactSettingsState = {
    public: boolean;
    sectionTitle: Record<string, string>;
    subtitle: Record<string, string>;
    successMessage: Record<string, string>;
    errorMessage: Record<string, string>;
    loading: boolean
    error: string
    success: boolean
}

type ContactSettingsAction =
    | { type: 'SET_LOCALE_FIELD'; field: "sectionTitle" | "subtitle" | "successMessage" | "errorMessage"; locale: string; value: string }
    | { type: 'SUBMIT_START' }
    | { type: 'SUBMIT_SUCCESS' }
    | { type: 'SUBMIT_ERROR'; error: string }
    | { type: 'SET_BOOL_FIELD'; field: string; value: boolean }


function ContactSettingsReducer(state: ContactSettingsState, action: ContactSettingsAction): ContactSettingsState {
    switch (action.type) {
        case 'SET_LOCALE_FIELD':
            return {
                ...state,
                [action.field]: {
                    ...state[action.field],
                    [action.locale]: action.value
                }
            };
        case 'SET_BOOL_FIELD':
            return { ...state,  [action.field]: action.value } 
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

function getInitialState(contactSettings: ContactSettingsData | null): ContactSettingsState {
    return {
      public: contactSettings?.public ?? false,
      sectionTitle: contactSettings?.sectionTitle ?? {},
      subtitle: contactSettings?.subtitle ?? {},
      successMessage: contactSettings?.successMessage ?? {},
      errorMessage: contactSettings?.errorMessage ?? {},
      loading: false,
      error: '',
      success: false,
    }
}


export default function ContactSettingsForm({ contactSettings }: ContactSettingsFormProps) {
    const { activeCvLocale } = useCvLocale();
    const locale = useLocale();
    const [state, dispatch] = React.useReducer(ContactSettingsReducer, getInitialState(contactSettings));
    const { loading, error, success, ...contactSettingsData } = state;


    const handleLocaleChange = (field: "sectionTitle" | "subtitle" | "successMessage" | "errorMessage") => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: 'SET_LOCALE_FIELD', field, locale: activeCvLocale.code, value: e.target.value });
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ type: 'SUBMIT_START' }); 
        const result = await upsertContactSettings(contactSettingsData, locale);
        if ("error" in result) {
            dispatch({ type: 'SUBMIT_ERROR', error: result.error });
        } else {
            dispatch({ type: 'SUBMIT_SUCCESS' });
        }
    }


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="sectionTitle" className="block text-sm font-medium text-gray-700">Section Title</label>
                <input
                    type="text"
                    id="sectionTitle"
                    value={state.sectionTitle[activeCvLocale.code] || ''}
                    onChange={handleLocaleChange('sectionTitle')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Subtitle</label>
                <input
                    type="text"
                    id="subtitle"
                    value={state.subtitle[activeCvLocale.code] || ''}
                    onChange={handleLocaleChange('subtitle')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label htmlFor="successMessage" className="block text-sm font-medium text-gray-700">Success message</label>
                <textarea
                    id="successMessage"
                    value={state.successMessage[activeCvLocale.code] || ''}
                    onChange={handleLocaleChange('successMessage')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label htmlFor="errorMessage" className="block text-sm font-medium text-gray-700">Error message</label>
                <textarea
                    id="errorMessage"
                    value={state.errorMessage[activeCvLocale.code] || ''}
                    onChange={handleLocaleChange('errorMessage')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save contactSettings'}
                </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">Contact Settings saved successfully!</p>}
        </form>
    )
}
