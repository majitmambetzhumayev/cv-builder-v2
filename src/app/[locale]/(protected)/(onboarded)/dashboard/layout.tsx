//src/app/[locale]/(protected)/(onboarded)/dashboard/layout.tsx

import DashboardMobileNav from "@/components/dashboard/DashboardMobileNav";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { CvLocaleProvider } from "@/lib/contexts/cvLocale";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import CvLocaleSwitcher from "@/components/dashboard/CvLocaleSwitcher";


export default async function DashboardLayout({
    children }: { 
        children: React.ReactNode }) {
    const session = await auth()
    const user = await prisma.user.findUnique({
        where: { id: session!.user.id },
        select: { cvLocales: true }
    });
    const cvLocales = user?.cvLocales as {code: string, label: string}[] || [];

    return (
            <CvLocaleProvider cvLocales={cvLocales}>
                <div className="min-h-screen flex flex-col">
                    <DashboardMobileNav />
                    <div className="flex flex-1">
                        <DashboardSidebar />
                        <main className="flex-1 p-4">
                            <div className="hidden md:flex justify-end mb-4">
                                <CvLocaleSwitcher />
                            </div>
                            {children}
                        </main>
                    </div>
                </div>
            </CvLocaleProvider>
            );
}