import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import CertificationList from "@/components/dashboard/CertificationList";



export default async function CertificationsPage() {
    const session = await auth()
    const certifications = await prisma.certification.findMany({
        where: { userId: session!.user.id },
        orderBy: { date: "desc"}
    });

    return (
            <div>
                <h1>Certifications</h1>
                <CertificationList certifications={certifications.map(exp => ({
                    ...exp,
                    title: exp.title as Record<string, string> | null,
                    school: exp.school as Record<string, string> | null,
                    description: exp.description as Record<string, string> | null,
            }))} /> {/* we need to map du to role and description types which are jsonb in the db which we need to turn into Record<string, string> */}
            </div>
        );
}