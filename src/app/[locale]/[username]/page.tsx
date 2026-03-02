//app/src/app/[locale]/[username]/page.tsx
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"

export default async function UsernamePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
        notFound();
    }

    return <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard Home</h1>
        <p>Welcome to your dashboard! Use the sidebar to navigate through your profile, experiences, skills, and more.</p>
    </div>
}