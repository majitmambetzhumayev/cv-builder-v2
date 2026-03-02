import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import ProfileForm from "@/components/dashboard/ProfileForm";

export default async function ProfilePage() {

    const session = await auth();
    const profile = await prisma.profile.findUnique({
        where: { userId: session!.user.id }
    });

    return (
        <div>
            <h1>Profile Page</h1>
            <ProfileForm profile={profile ? {
                ...profile,
                headline: profile.headline as Record<string, string> | null,
                summary: profile.summary as Record<string, string> | null,
            } : null} />
        </div>
    );
}