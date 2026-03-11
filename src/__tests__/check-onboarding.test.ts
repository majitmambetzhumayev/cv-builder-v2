import { describe, expect, it} from "vitest"
import { POST } from '@/app/api/auth/onboarding/route'
import { vi } from 'vitest';
import { prisma } from '@/lib/db'
import type { User } from "@/generated/prisma/client"

vi.mock('@/lib/db', () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
            update: vi.fn()
        }
    }
}))

const { mockAuth } = vi.hoisted(() => ({ 
//vi.hoisted is needed so it loads a the beginning along with vi.mock, otherwise mockAuth doesn't exist for vi.mock
      mockAuth: vi.fn()
  }))

vi.mock('@/lib/auth', () => ({
    auth: mockAuth
}))



describe("POST /api/auth/onboarding", () => {
    it("returns error when user is not authenticated", async () => {
        mockAuth.mockResolvedValueOnce(null)
        const req = new Request("http://localhost/api/auth/onboarding", {
            method: "POST",
            body: JSON.stringify({username: "johndoe"}),
            headers: {"Content-Type": "application/json" }
        })
        const response = await POST(req)
        const data = await response.json()

        expect(data.error).toBe('UNAUTHORIZED')
    })
    it("returns error when fields are missing", async () => {
        mockAuth.mockResolvedValueOnce({user: {id: "user-123"}})
        const req = new Request("http://localhost/api/auth/onboarding", {
            method: "POST",
            body: JSON.stringify({username: "johndoe"}),
            headers: {"Content-Type": "application/json" }
        })
        const response = await POST(req)
        const data = await response.json()

        expect(data.error).toBe('MISSING_FIELDS')
    })
    it("checks if username is too long", async () => {
        mockAuth.mockResolvedValueOnce({user: {id: "user-123"}})
        const req = new Request("http://localhost/api/auth/onboarding", {
            method: "POST",
            body: JSON.stringify({username: "abracadabrathisnameiswaytoolong", jobTitle: "web dev", industry: "tech", cvLocales: [{ code: "en", label: "English" }]}),
            headers: {"Content-Type": "application/json" }
        })
        const response = await POST(req)
        const data = await response.json()

        expect(data.error).toBe('USERNAME_TOO_LONG')
    })
    it("checks if username is too short", async () => {
        mockAuth.mockResolvedValueOnce({user: {id: "user-123"}})
        const req = new Request("http://localhost/api/auth/onboarding", {
            method: "POST",
            body: JSON.stringify({username: "ab", jobTitle: "web dev", industry: "tech", cvLocales: [{ code: "en", label: "English" }]}),
            headers: {"Content-Type": "application/json" }
        })
        const response = await POST(req)
        const data = await response.json()

        expect(data.error).toBe('USERNAME_TOO_SHORT')
    })
    it("checks if username has invalid chars", async () => {
        mockAuth.mockResolvedValueOnce({user: {id: "user-123"}})
        const req = new Request("http://localhost/api/auth/onboarding", {
            method: "POST",
            body: JSON.stringify({username: "john@doe", jobTitle: "web dev", industry: "tech", cvLocales: [{ code: "en", label: "English" }]}),
            headers: {"Content-Type": "application/json" }
        })
        const response = await POST(req)
        const data = await response.json()

        expect(data.error).toBe('INVALID_USERNAME_CHARS')
    })
    it("checks if username is reserved", async () => {
        mockAuth.mockResolvedValueOnce({user: {id: "user-123"}})
        const req = new Request("http://localhost/api/auth/onboarding", {
            method: "POST",
            body: JSON.stringify({username: "registration", jobTitle: "web dev", industry: "tech", cvLocales: [{ code: "en", label: "English" }]}),
            headers: {"Content-Type": "application/json" }
        })
        const response = await POST(req)
        const data = await response.json()

        expect(data.error).toBe('USERNAME_RESERVED')
    })
    it("checks if username is taken", async () => {
        mockAuth.mockResolvedValueOnce({user: {id: "user-123"}})
        vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({id: "1"} as User)
        const req = new Request("http://localhost/api/auth/onboarding", {
            method: "POST",
            body: JSON.stringify({username: "johndoe", jobTitle: "web dev", industry: "tech", cvLocales: [{ code: "en", label: "English" }]}),
            headers: {"Content-Type": "application/json" }
        })
        const response = await POST(req)
        const data = await response.json()

        expect(data.error).toBe('USERNAME_TAKEN')
    })
    it("checks if onoboarding completes successfully", async () => {
        mockAuth.mockResolvedValueOnce({user: {id: "user-123"}})
        vi.mocked(prisma.user.update).mockResolvedValueOnce({ id: 'user-123', username: 'johndoe' } as User)
        vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null)
        const req = new Request("http://localhost/api/auth/onboarding", {
            method: "POST",
            body: JSON.stringify({username: "johndoe", jobTitle: "web dev", industry: "tech", cvLocales: [{ code: "en", label: "English" }]}),
            headers: {"Content-Type": "application/json" }
        })
        const response = await POST(req)
        const data = await response.json()

        expect(data.user.username).toBe('johndoe')
        expect(data.success).toBe(true)
    })
    it("returns internal server error when something throws", async () => {
        mockAuth.mockResolvedValueOnce({user: {id: "user-123"}})
        vi.mocked(prisma.user.findUnique).mockRejectedValueOnce(new Error("DB connection failed"))
        const req = new Request("http://localhost/api/auth/onboarding", {
            method: "POST",
            body: JSON.stringify({username: "johndoe", jobTitle: "web dev", industry: "tech", cvLocales: [{ code: "en", label: "English" }] }),
            headers: {"Content-Type": "application/json" }
        })
        const response = await POST(req)
        const data = await response.json()

        expect(data.error).toBe('INTERNAL_SERVER_ERROR')
    })
})