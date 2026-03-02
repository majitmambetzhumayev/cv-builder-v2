"use client"

import { upsertProfile } from "@/lib/actions/profile";
import React from "react";
import { useCvLocale } from "@/lib/contexts/cvLocale";
import { useLocale } from "next-intl";

type ProfileData = {
    fullName: string | null;
    headline: Record<string, string> | null;
    summary: Record<string, string> | null;
    photoUrl: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
    website: string | null;
    github: string | null;
    linkedin: string | null;
}

type ProfileFormProps = {
    profile: ProfileData | null;
}

type ProfileState = {
    fullName: string
    headline: Record<string, string>;
    summary: Record<string, string>;
    photoUrl: string
    email: string
    phone: string
    location: string
    website: string
    github: string
    linkedin: string
    loading: boolean
    error: string
    success: boolean
}

type ProfileAction =
    | { type: 'SET_FIELD'; field: string; value: string }
    | { type: 'SET_LOCALE_FIELD'; field: "headline" | "summary"; locale: string; value: string }
    | { type: 'SUBMIT_START' }
    | { type: 'SUBMIT_SUCCESS' }
    | { type: 'SUBMIT_ERROR'; error: string }


function profileReducer(state: ProfileState, action: ProfileAction): ProfileState {
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

function getInitialState(profile: ProfileData | null): ProfileState {
    return {
      fullName: profile?.fullName ?? '',
      email: profile?.email ?? '',
      phone: profile?.phone ?? '',
      location: profile?.location ?? '',
      website: profile?.website ?? '',
      github: profile?.github ?? '',
      linkedin: profile?.linkedin ?? '',
      headline: profile?.headline ?? {},
      summary: profile?.summary ?? {},
      photoUrl: profile?.photoUrl ?? '',
      loading: false,
      error: '',
      success: false,
    }
}


export default function ProfileForm({ profile }: ProfileFormProps) {
    const { activeCvLocale } = useCvLocale();
    const locale = useLocale();
    const [state, dispatch] = React.useReducer(profileReducer, getInitialState(profile));
    const { loading, error, success, ...profileData } = state;

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: 'SET_FIELD', field, value: e.target.value });
    }

    const handleLocaleChange = (field: "headline" | "summary") => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: 'SET_LOCALE_FIELD', field, locale: activeCvLocale.code, value: e.target.value });
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ type: 'SUBMIT_START' }); 
        const result = await upsertProfile(profileData, locale);
        if ("error" in result) {
            dispatch({ type: 'SUBMIT_ERROR', error: result.error });
        } else {
            dispatch({ type: 'SUBMIT_SUCCESS' });
        }
    }


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                    type="text"
                    id="fullName"
                    value={state.fullName}
                    onChange={handleChange('fullName')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label htmlFor="headline" className="block text-sm font-medium text-gray-700">Headline</label>
                <input
                    type="text"
                    id="headline"
                    value={state.headline[activeCvLocale.code] || ''}
                    onChange={handleLocaleChange('headline')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Summary</label>
                <textarea
                    id="summary"
                    value={state.summary[activeCvLocale.code] || ''}
                    onChange={handleLocaleChange('summary')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    id="email"
                    value={state.email}
                    onChange={handleChange('email')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                    type="text"
                    id="phone"
                    value={state.phone}
                    onChange={handleChange('phone')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input
                    type="text"
                    id="location"
                    value={state.location}
                    onChange={handleChange('location')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                <input
                    type="text"
                    id="website"
                    value={state.website}
                    onChange={handleChange('website')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label htmlFor="github" className="block text-sm font-medium text-gray-700">GitHub</label>
                <input
                    type="text"
                    id="github"
                    value={state.github}
                    onChange={handleChange('github')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn</label>
                <input
                    type="text"
                    id="linkedin"
                    value={state.linkedin}
                    onChange={handleChange('linkedin')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Profile'}
                </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">Profile saved successfully!</p>}
        </form>
    )
}
