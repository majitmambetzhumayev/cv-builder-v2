import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import SiteSettingsForm from "@/components/dashboard/SiteSettingsForm";
import ContactSettingsForm from "@/components/dashboard/ContactSettingsForm";



export default async function SettingsPage() {
    const session = await auth()
    const [contactSettings, siteSettings] = await Promise.all([
        prisma.contactSettings.findUnique({ where: { userId: session!.user.id } }),
        prisma.siteSettings.findUnique({ where: { userId: session!.user.id } })
    ])

    return (
            <div>
                <h1>Skills</h1>
                <ContactSettingsForm contactSettings={contactSettings ? {
                    public: contactSettings.public,
                    sectionTitle: contactSettings.sectionTitle as Record<string, string> | null,
                    subtitle: contactSettings.subtitle as Record<string, string> | null,
                    successMessage: contactSettings.successMessage as Record<string, string> | null,
                    errorMessage: contactSettings.errorMessage as Record<string, string> | null,
                } : null} />
                <SiteSettingsForm siteSettings={siteSettings ? {
                    layoutId: siteSettings.layoutId,
                    themeMode: siteSettings.themeMode,
                    accentColor: siteSettings.accentColor,
                    sectionOrder: siteSettings.sectionOrder as string[],
                } : null} />
            </div>
        );
}