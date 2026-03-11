import { describe, expect, it} from "vitest"
import { GET } from '@/app/api/auth/check-username/route'
import { NextRequest } from 'next/server'
import { vi } from 'vitest';
import { prisma } from '@/lib/db'
import type { User } from "@/generated/prisma/client"

vi.mock('@/lib/db', () => ({
    prisma: {
        user: {
            findUnique: vi.fn()
        }
    }
}))

describe("GET /api/auth/check-username", () => {
    it("checks if username is too short", async () => {
        const req = new NextRequest("http://localhost/api/auth/check-username?username=ab")
        const response = await GET(req)
        const data = await response.json()

        expect(data.error).toBe('USERNAME_TOO_SHORT')
    })
    it("checks if username is too long", async () => {
        const req = new NextRequest("http://localhost/api/auth/check-username?username=abracadabrathisnameiswaytoolong")
        const response = await GET(req)
        const data = await response.json()

        expect(data.error).toBe('USERNAME_TOO_LONG')
    })
    it("checks if username has invalid chars", async () => {
        const req = new NextRequest("http://localhost/api/auth/check-username?username=Jhondoe!")
        const response = await GET(req)
        const data = await response.json()

        expect(data.error).toBe('INVALID_USERNAME_CHARS')
    })
    it("checks if username is reserved", async () => {
        const req = new NextRequest("http://localhost/api/auth/check-username?username=registration")
        const response = await GET(req)
        const data = await response.json()

        expect(data.error).toBe('USERNAME_RESERVED')
    })
    it("checks if username is taken", async () => {
        vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({id: "1"} as User)
        const req = new NextRequest("http://localhost/api/auth/check-username?username=johndoe")
        const response = await GET(req)
        const data = await response.json()

        expect(data.available).toBe(false)
        expect(data.error).toBe('USERNAME_TAKEN')
    })
    it("checks if username is available", async () => {
        vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null)
        const req = new NextRequest("http://localhost/api/auth/check-username?username=johndoe")
        const response = await GET(req)
        const data = await response.json()

        expect(data.available).toBe(true)
        expect(data.message).toBe('USERNAME_AVAILABLE')
    })
    it("returns unavailable when no username is provided", async () => {
        const req = new NextRequest("http://localhost/api/auth/check-username")
        const response = await GET(req)
        const data = await response.json()

        expect(data.available).toBe(false)
    })
})