import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import SkillCategoryManager from "@/components/dashboard/SkillCategoryManager";



export default async function SkillsPage() {
    const session = await auth()
    const [skills, categories] = await Promise.all([
        prisma.skill.findMany({ where: { userId: session!.user.id } }),
        prisma.skillsCategory.findMany({ where: { userId: session!.user.id } })
    ])

    return (
            <div>
                <h1>Skills</h1>
                <SkillCategoryManager
                    categories={categories.map(c => ({
                        id: c.id,
                        title: c.title as Record<string, string>
                    }))}
                    skills={skills.map(s => ({
                        id: s.id,
                        title: s.title as Record<string, string>,
                        categoryId: s.categoryId
                    }))}
                /> {/* we need to map du to title type which is jsonb in the db which we need to turn into Record<string, string> */}
            </div>
        );
}