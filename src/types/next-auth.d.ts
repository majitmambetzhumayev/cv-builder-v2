import { OnBoardingStatus } from "@/generated/prisma/client"
import type { DefaultSession } from "next-auth"

    declare module "next-auth" {
        interface Session {
        user: {
            id: string
            username: string | null
            onboardingStatus: OnBoardingStatus
        } & DefaultSession["user"]
        }

        interface User {
            username: string | null
            onboardingStatus: OnBoardingStatus
        }
    }

    declare module "@auth/core/adapters" {
        interface AdapterUser {
            username: string | null
            onboardingStatus: OnBoardingStatus
        }
    }