import fs from "fs"
import path from "path"
import { query } from "../db/connection.js"
import dotenv from "dotenv"

dotenv.config()

const migrate = async () => {
    try {
        console.log("[MIGRATE] Iniciar la migración de la base de datos...")

        const schemaPath = path.join(process.cwd(), "src/db/schema.sql")
        const schema = fs.readFileSync(schemaPath, "utf-8")

        // Split by semicolon and execute each statement
        const statements = schema.split(";").filter((stmt) => stmt.trim())

        for (const statement of statements) {
            await query(statement)
        }

        console.log("[MIGRATE] La migración de la base de datos se completó con éxito!")
        process.exit(0)
    } catch (error) {
        console.error("[MIGRATE] Error:", error.message)
        process.exit(1)
    }
}

migrate()
