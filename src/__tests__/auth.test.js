import request from "supertest"
import express from "express"
import authRoutes from "../routes/auth.routes.js"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(express.json())
app.use("/api/auth", authRoutes)

describe("Auth Routes", () => {
    describe("POST /api/auth/register", () => {
        it("should register a new user", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    email: `test${Date.now()}@example.com`,
                    password: "Test@123456",
                    fullName: "Test User",
                })

            expect(res.statusCode).toBe(201)
            expect(res.body).toHaveProperty("token")
            expect(res.body.user).toHaveProperty("email")
        })

        it("should return error for invalid email", async () => {
            const res = await request(app).post("/api/auth/register").send({
                email: "invalid-email",
                password: "Test@123456",
                fullName: "Test User",
            })

            expect(res.statusCode).toBe(400)
        })

        it("should return error for short password", async () => {
            const res = await request(app).post("/api/auth/register").send({
                email: "test@example.com",
                password: "123",
                fullName: "Test User",
            })

            expect(res.statusCode).toBe(400)
        })
    })

    describe("POST /api/auth/login", () => {
        it("should login existing user", async () => {
            // First register
            await request(app).post("/api/auth/register").send({
                email: "login-test@example.com",
                password: "Test@123456",
                fullName: "Login Test",
            })

            // Then login
            const res = await request(app).post("/api/auth/login").send({
                email: "login-test@example.com",
                password: "Test@123456",
            })

            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty("token")
        })

        it("should return error for invalid credentials", async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: "nonexistent@example.com",
                password: "WrongPassword",
            })

            expect(res.statusCode).toBe(401)
        })
    })
})
