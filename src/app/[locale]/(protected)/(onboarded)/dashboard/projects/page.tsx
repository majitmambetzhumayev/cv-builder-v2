import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import ProjectList from "@/components/dashboard/ProjectList";



export default async function ProjectsPage() {
    const session = await auth()
    const projects = await prisma.project.findMany({
        where: { userId: session!.user.id },
        orderBy: { sortOrder: 'desc' }
    });

    return (
            <div>
                <h1>Projects</h1>
                <ProjectList projects={projects.map(pro => ({
                    ...pro,
                    title: pro.title as Record<string, string> | null,
                    description: pro.description as Record<string, string> | null,
            }))} /> {/* we need to map du to role and description types which are jsonb in the db which we need to turn into Record<string, string> */}
            </div>
        );
}