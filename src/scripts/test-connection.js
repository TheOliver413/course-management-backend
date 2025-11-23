import dotenv from "dotenv"
import pool from "../db/connection.js"

dotenv.config()

const testConnection = async () => {
    try {
        console.log("[TEST] Verificando conexión a la base de datos...")
        console.log("[TEST] DATABASE_URL:", process.env.DATABASE_URL.substring(0, 50) + "...")

        const result = await pool.query("SELECT NOW()")

        console.log("[SUCCESS] Conexión exitosa a PostgreSQL!")
        console.log("[SUCCESS] Timestamp del servidor:", result.rows[0].now)
        process.exit(0)
    } catch (error) {
        console.error("[ERROR] Conexión fallida:")
        console.error("[ERROR] Mensaje:", error.message)
        console.error("\nVerifica que:")
        console.error("1. PostgreSQL esté corriendo en localhost:5432")
        console.error("2. La base de datos 'course_db' exista")
        console.error("3. La contraseña en DATABASE_URL sea correcta")
        console.error("4. El archivo .env esté en la carpeta backend/")
        process.exit(1)
    }
}

testConnection()
