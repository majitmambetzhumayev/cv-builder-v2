//src/app/[locale]/(protected)/layout.tsx

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ 
    children, params }: { 
        children: React.ReactNode
        params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const session = await auth();
    if (!session) redirect(`/${locale}/login`);
    return <>{children}</>;
}