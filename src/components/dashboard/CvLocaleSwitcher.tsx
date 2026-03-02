"use client"

import { useCvLocale } from "@/lib/contexts/cvLocale";
import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";


export default function CvLocaleSwitcher() {
    const { activeCvLocale, setActiveCvLocale, cvLocales } = useCvLocale();
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('dashboard.cv-locale-switcher');
    const locale = useLocale();
    return (
        <div className="relative inline-block text-left">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                {activeCvLocale.label}
            </button>
            {isOpen && (
                <div className="z-50 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {cvLocales.map(cvLocale => (
                            <button key={cvLocale.code} onClick={() => {
                                setActiveCvLocale(cvLocale);
                                setIsOpen(false);
                            }} className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${cvLocale.code === activeCvLocale.code ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                {cvLocale.label}
                            </button>
                        ))}
                        <hr className="my-1 border-gray-200" />
                        <Link href={`/${locale}/dashboard/settings`} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            {t('add-locale')}
                        </Link>
                    </div>
                </div>
            )}
            {/* Dark overlay tap to close */}
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-black/10" onClick={() => setIsOpen(false)} />
            )}
        </div>
    );
}
