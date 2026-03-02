"use client"
import { createContext, useContext, useState, type ReactNode } from "react";

type CvLocaleContextType = {
    activeCvLocale: {code: string, label: string}
    setActiveCvLocale: (locale: {code: string, label: string}) => void
    cvLocales: {code: string, label: string}[]
};
const CvLocaleContext = createContext< CvLocaleContextType | null >(null)

export const useCvLocale = () => {
    const context = useContext(CvLocaleContext);
    if (!context) {
        throw new Error("useCvLocale must be used within a CvLocaleProvider");
    }
    return context;
}

export const CvLocaleProvider = ({ cvLocales, children }: { cvLocales: {code: string, label: string}[], children: ReactNode }) => {
    const [activeCvLocale, setActiveCvLocale] = useState(cvLocales[0] || {code: 'en', label: 'English'});

    return (
        <CvLocaleContext.Provider value={{ activeCvLocale, setActiveCvLocale, cvLocales }}>
            {children}
        </CvLocaleContext.Provider>
    );
}