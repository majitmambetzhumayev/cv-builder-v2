//src/coomponents/dashboard/DashboardSidebar.tsx
"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export default function DashboardSidebar() {
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
        <div className="hidden md:flex md:w-64 bg-white border-r p-4">      
                {/* Desktop sidebar — always visible */}
                <nav className="flex flex-col w-full">
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
            </div>
    );
}