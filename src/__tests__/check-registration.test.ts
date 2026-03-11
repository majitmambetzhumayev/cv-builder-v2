import { describe, expect, it} from "vitest"
import { POST } from '@/app/api/auth/registration/route'
import { vi } from 'vitest';
import { prisma } from '@/lib/db'
import type { User } from "@/generated/prisma/client"

vi.mock('@/lib/db', () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
            create: vi.fn()
        }
    }
}))

describe("POST /api/auth/registration", () => {
    it("returns error when fields are missing", async () => {
        const req = new Request("http://localhost/api/auth/registration", {
            method: "POST",
            body: JSON.stringify({name: "john"}),
            headers: {"Content-Type": "application/json" }
        })
        const response = await POST(req)
        const data = await response.json()

        expect(data.error).toBe('MISSING_FIELDS')
    })
    it("check if password is too short", async () => {
        const req = new Request("http://localhost/api/auth/registration", {
            method: "POST",
            body: JSON.stringify({name: "John", email: "john@test.com", password: "1234567" }),//without all fields we're just hitting the missing fields guard
            headers: {"Content-Type": "application/json" }
        })
        const response = await POST(req)
        const data = await response.json()

        expect(data.error).toBe('PASSWORD_TOO_SHORT')
    })
    it("check if email already exists", async () => {
        vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({id: "1"} as User)
        const req = new Request("http://localhost/api/auth/registration", {
            method: "POST",
            body: JSON.stringify({name: "John", email: "john@test.com", password: "12345678" }),
            //without all fields we're just hitting the missing fields guard, also here the password needs to be at least 8 long
            headers: {"Content-Type": "application/json" }
        })
        const response = await POST(req)
        const data = await response.json()

        expect(data.error).toBe('EMAIL_ALREADY_EXISTS')
    })
    it("creats a user successfully", async () => {
        vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null)
        vi.mocked(prisma.user.create).mockResolvedValueOnce({
            id: '1',
            email: 'john@test.com',
            name: 'John'
        } as User)
        const req = new Request("http://localhost/api/auth/registration", {
            method: "POST",
            body: JSON.stringify({name: "John", email: "john@test.com", password: "12345678" }),
            //without all fields we're just hitting the missing fields guard, also here the password needs to be at least 8 long
            headers: {"Content-Type": "application/json" }
        })
        const response = await POST(req)
        const data = await response.json()

        expect(data.success).toBe(true)
        expect(data.user.email).toBe("john@test.com")
    })
    it("returns internal server error when something throws", async () => {
        vi.mocked(prisma.user.findUnique).mockRejectedValueOnce(new Error("DB connection failed"))
        const req = new Request("http://localhost/api/auth/registration", {
            method: "POST",
            body: JSON.stringify({name: "John", email: "john@test.com", password: "12345678" }),
            //without all fields we're just hitting the missing fields guard, also here the password needs to be at least 8 long
            headers: {"Content-Type": "application/json" }
        })
        const response = await POST(req)
        const data = await response.json()

        expect(data.error).toBe('INTERNAL_SERVER_ERROR')
    })
})