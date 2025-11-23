import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import authRoutes from "./routes/auth.routes.js"
import programRoutes from "./routes/program.routes.js"
import userRoutes from "./routes/user.routes.js"
import { authMiddleware } from "./middleware/auth.middleware.js"
import { errorHandler } from "./middleware/error.middleware.js"
import { typeDefs, resolvers } from "./graphql/schema.js"

dotenv.config()

const validateEnvironment = () => {
    const required = ["DATABASE_URL", "JWT_SECRET", "PORT"]
    const missing = required.filter((key) => !process.env[key])

    if (missing.length > 0) {
        console.error("[ERROR] Variables de entorno requeridas faltantes:")
        missing.forEach((key) => console.error(`  - ${key}`))
        console.error("\nPor favor revise su archivo .env")
        process.exit(1)
    }

    console.log("[Config] Se establecen todas las variables de entorno necesarias")
    console.log("[Config] DATABASE_URL:", process.env.DATABASE_URL.substring(0, 50) + "...")
}

const app = express()

const startServer = async () => {
    try {
        validateEnvironment()

        // Middleware
        app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }))
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))

        // Routes públicas
        app.use("/api/auth", authRoutes)

        // Routes protegidas
        app.use("/api/programs", authMiddleware, programRoutes)
        app.use("/api/users", authMiddleware, userRoutes)

        // Apollo GraphQL Server with @apollo/server 4.x
        const server = new ApolloServer({
            typeDefs,
            resolvers,
        })

        await server.start()

        app.use(
            "/graphql",
            express.json(),
            expressMiddleware(server, {
                context: async ({ req }) => ({
                    userId: req.headers.authorization?.split(" ")[1],
                }),
            }),
        )

        // Health check
        app.get("/health", (req, res) => {
            res.json({ status: "OK", timestamp: new Date() })
        })

        // Error handling
        app.use(errorHandler)

        // 404 handler
        app.use((req, res) => {
            res.status(404).json({ error: "Ruta no encontrada" })
        })

        const PORT = process.env.PORT || 5000
        app.listen(PORT, () => {
            console.log(`[Server] Corriendo en http://localhost:${PORT}`)
            console.log(`[GraphQL] Disponible en http://localhost:${PORT}/graphql`)
            console.log(`[API] Endpoints de autenticación disponibles en http://localhost:${PORT}/api/auth`)
        })
    } catch (error) {
        console.error("[Server Error]", error.message)
        process.exit(1)
    }
}

startServer()
