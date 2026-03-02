import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import ExperienceList from "@/components/dashboard/ExperienceList";



export default async function ExperiencePage() {
    const session = await auth()
    const experiences = await prisma.experience.findMany({
        where: { userId: session!.user.id },
        orderBy: { startDate: 'desc' }
    });

    return (
            <div>
                <h1>Experiences</h1>
                <ExperienceList experiences={experiences.map(exp => ({
                    ...exp,
                    role: exp.role as Record<string, string> | null,
                    description: exp.description as Record<string, string> | null,
            }))} /> {/* we need to map du to role and description types which are jsonb in the db which we need to turn into Record<string, string> */}
            </div>
        );
}