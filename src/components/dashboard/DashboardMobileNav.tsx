"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import CvLocaleSwitcher from "./CvLocaleSwitcher";

export default function DashboardMobileNav() {

    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
        const locale = useLocale();
        const links = [
            { href: `/${locale}/dashboard`, label: 'Home' },
            { href: `/${locale}/dashboard/profile`, label: 'Profile' },
            { href: `/${locale}/dashboard/experience`, label: 'Experiences' },
            { href: `/${locale}/dashboard/skills`, label: 'Skills' },
            { href: `/${locale}/dashboard/projects`, label: 'Projects' },
            { href: `/${locale}/dashboard/education`, label: 'Education' },
            { href: `/${locale}/dashboard/certifications`, label: 'Certifications' },
            { href: `/${locale}/dashboard/settings`, label: 'Settings' },
        ];

    return (
        <>
            <header className="md:hidden flex justify-between items-center px-4 h-14 border-b bg-white" >
                <button onClick={() => setIsOpen(true)}>
                    <Menu className="text-gray-700" size={24} />
                </button>
                <CvLocaleSwitcher />
            </header>
            <nav className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform bg-white p-4 md:hidden ${isOpen ? 'translate-x-0' :
            '-translate-x-full'}`}>
                <button onClick={() => setIsOpen(false)}>
                    <X className="text-gray-700" size={24} />
                </button>
                <ul>
                    {links.map(link => (
                        <li key={link.href} className="mb-2">
                            <Link href={link.href} className={`block px-4 py-2 rounded ${pathname === link.href ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}>
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>  
            </nav>    
            {/* Dark overlay tap to close */}
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />
            )}
        </>
    )
}