import { query } from "../db/connection.js"
import dotenv from "dotenv"

dotenv.config()

const dropDatabase = async () => {
    try {
        console.log("[DROP] Empezando a eliminar todas las tablas...")

        await query("DROP TABLE IF EXISTS program_enrollments CASCADE")
        console.log("[DROP] Tabla caída: program_enrollments")

        await query("DROP TABLE IF EXISTS programs CASCADE")
        console.log("[DROP] Tabla caída: programs")

        await query("DROP TABLE IF EXISTS users CASCADE")
        console.log("[DROP] Tabla caída: users")

        console.log("[DROP] Todas las tablas cayeron exitosamente!")
        console.log("[DROP] Ahora puedes ejecutar: npm run migrate && npm run seed")
        process.exit(0)
    } catch (error) {
        console.error("[DROP] Error:", error.message)
        process.exit(1)
    }
}

dropDatabase()
