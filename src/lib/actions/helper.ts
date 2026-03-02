"use server"

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function withAuth(
    locale: string,
    path: string,
    fn: (userId: string) => Promise<unknown> //takes in the db function. Promise is unknown because the return could be more than on type
): Promise<{ success: true }| { error: string }> {
    const session = await auth()
      if (!session) return { error: 'UNAUTHORIZED' }
      try {
          await fn(session.user.id)
      } catch (error) {
          console.error(error)
          return { error: 'INTERNAL_SERVER_ERROR' }
      }
      revalidatePath(`/${locale}/${path}`)
      return { success: true }
}