import request from "supertest"
import express from "express"
import programRoutes from "../routes/program.routes.js"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(express.json())

// Mock middleware to bypass real JWT
app.use((req, res, next) => {
    req.userId = 1
    req.userRole = "admin"
    next()
})

app.use("/api/programs", programRoutes)

describe("Program Routes", () => {
    describe("GET /api/programs", () => {
        it("should get all programs with pagination", async () => {
            const res = await request(app).get("/api/programs?page=1&limit=10")
            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty("items")
            expect(res.body).toHaveProperty("total")
            expect(res.body).toHaveProperty("pages")
        })

        it("should filter programs by status", async () => {
            const res = await request(app).get("/api/programs?status=active")
            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty("items")
        })
    })

    describe("POST /api/programs", () => {
        it("should create a new program", async () => {
            const res = await request(app).post("/api/programs").send({
                name: "Test Program",
                description: "Test Description",
                startDate: "2024-01-15",
                status: "active",
            })

            expect(res.statusCode).toBe(201)
            expect(res.body).toHaveProperty("id")
            expect(res.body.name).toBe("Test Program")
        })

        it("should return error for missing required fields", async () => {
            const res = await request(app).post("/api/programs").send({
                name: "Test Program",
            })

            expect(res.statusCode).toBe(400)
        })
    })
})
