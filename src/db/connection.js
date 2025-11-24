import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pg

const getDatabaseConfig = () => {
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
        throw new Error(
            "DATABASE_URL no está definido en el archivo .env. Por favor, revise la configuración de su entorno."
        )
    }

    return {
        connectionString: databaseUrl,
        ssl: {
            rejectUnauthorized: false, // necesario para Render y certificados autofirmados
        },
        max: 5, // número máximo de conexiones simultáneas
    }
}

const pool = new Pool(getDatabaseConfig())

pool.on("error", (err) => {
    console.error("[DB Error]", err.message)
})

pool.on("connect", () => {
    console.log("[DB] Conectado exitosamente a PostgreSQL")
})

export const query = async (text, params) => {
    console.log("[DB Query]", text.substring(0, 50) + "...")
    try {
        const res = await pool.query(text, params)
        return res
    } catch (error) {
        console.error("[DB Query Error]", error)
        throw error
    }
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
