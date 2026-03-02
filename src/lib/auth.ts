import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./db"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "database",
    },
    providers: [
        GitHub({ clientId: process.env.GITHUB_CLIENT_ID!, clientSecret: process.env.GITHUB_CLIENT_SECRET! }),
        Google({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! }),
        Credentials({
            credentials: {
                identifier: {},
                password: {},
            },
            
            authorize: async (credentials) => {
                if (!credentials?.identifier || !credentials?.password) return null
                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { username: credentials.identifier as string },
                            { email: credentials.identifier as string },
                        ]
                    }
                })

                if(!user || !user.passwordHash) return null
                const valid = await bcrypt.compare(credentials.password as string, user.passwordHash)
                if (!valid) return null
                return user
            },
        }),
    ],
    callbacks: {
    session: async ({ session, user }) => {
      session.user.id = user.id
      session.user.username = user.username
      session.user.onboardingStatus = user.onboardingStatus
      return session
    }
  }
})