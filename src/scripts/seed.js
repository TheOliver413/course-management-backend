import bcryptjs from "bcryptjs"
import { query } from "../db/connection.js"
import dotenv from "dotenv"

dotenv.config()

const seedDatabase = async () => {
    try {
        console.log("[SEED] Iniciando el seed de la base de datos...")

        // Crear usuario administrador
        const adminPassword = await bcryptjs.hash("Admin@123456", 10)
        await query(
            "INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
            ["admin@coursesystem.com", adminPassword, "System Admin", "admin"],
        )
        console.log("[SEED] Usuario administrador creado")

        // Crear usuarios regulares
        const userPassword = await bcryptjs.hash("User@123456", 10)
        const testUsers = [
            ["user1@example.com", "John Doe"],
            ["user2@example.com", "Jane Smith"],
            ["user3@example.com", "Bob Johnson"],
        ]

        for (const [email, fullName] of testUsers) {
            await query(
                "INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
                [email, userPassword, fullName, "user"],
            )
        }
        console.log("[SEED] Prueba de usuarios creados")

        // Crear programas
        const programs = [
            ["React Fundamentals", "Learn React basics and hooks", "2024-01-15", "active"],
            ["Node.js Mastery", "Advanced Node.js and Express", "2024-02-01", "active"],
            ["Full Stack Development", "Complete MERN stack course", "2024-03-01", "active"],
        ]

        for (const [name, description, date, status] of programs) {
            await query("INSERT INTO programs (name, description, start_date, status) VALUES ($1, $2, $3, $4)", [
                name,
                description,
                date,
                status,
            ])
        }
        console.log("[SEED] Programas creados")

        // Crear inscripciones
        const enrollments = [
            [1, 1],
            [1, 2],
            [2, 2],
            [2, 3],
            [3, 1],
            [3, 3],
        ]

        for (const [userId, programId] of enrollments) {
            await query("INSERT INTO program_enrollments (user_id, program_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [
                userId,
                programId,
            ])
        }
        console.log("[SEED] Inscripciones creadas")

        console.log("[SEED] El seed de la base de datos se completó exitosamente")
        process.exit(0)
    } catch (error) {
        console.error("[SEED] Error:", error.message)
        process.exit(1)
    }
}

seedDatabase()
