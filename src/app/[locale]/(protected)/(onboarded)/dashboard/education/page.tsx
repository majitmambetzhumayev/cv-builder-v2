import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import EducationList from "@/components/dashboard/EducationList";



export default async function EducationPage() {
    const session = await auth()
    const education = await prisma.education.findMany({
        where: { userId: session!.user.id },
        orderBy: { startDate: 'desc' }
    });

    return (
            <div>
                <h1>Education</h1>
                <EducationList education={education.map(edu => ({
                    ...edu,
                    school: edu.school as Record<string, string> | null,
                    diploma: edu.diploma as Record<string, string> | null,
                    description: edu.description as Record<string, string> | null,
            }))} /> {/* we need to map due to role, diploma and description types which are jsonb in the db which we need to turn into Record<string, string> */}
            </div>
        );
}