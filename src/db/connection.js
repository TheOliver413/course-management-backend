import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pg

const getDatabaseConfig = () => {
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
        throw new Error("DATABASE_URL no está definido en el archivo .env. Por favor, revise la configuración de su entorno.")
    }

    return {
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    }
}

const pool = new Pool(getDatabaseConfig())

pool.on("error", (err) => {
    console.error("[DB Error]", err.message)
})

pool.on("connect", () => {
    console.log("[DB] Conectado exitosamente a PostgreSQL")
})

export const query = (text, params) => {
    console.log("[DB Query]", text.substring(0, 50) + "...")
    return pool.query(text, params)
}

export const getClient = async () => {
    const client = await pool.connect()
    return client
}

export const closePool = async () => {
    await pool.end()
    console.log("[DB] Grupo de conexiones cerrado")
}

export default pool
