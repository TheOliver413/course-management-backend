import express from "express"
import { User } from "../models/User.model.js"
import { adminMiddleware } from "../middleware/auth.middleware.js"
import { validatePagination } from "../middleware/validation.middleware.js"
import { asyncHandler } from "../middleware/error.middleware.js"

const router = express.Router()

// Obtener usuario actual
router.get(
    "/profile/me",
    asyncHandler(async (req, res) => {
        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" })
        }
        res.json(user)
    }),
)

// Obtener programas de usuario
router.get(
    "/programs/me",
    asyncHandler(async (req, res) => {
        const programs = await User.getUserPrograms(req.userId)
        res.json(programs)
    }),
)

// Obtener todos los usuarios (solo administradores)
router.get(
    "/",
    adminMiddleware,
    validatePagination,
    asyncHandler(async (req, res) => {
        const page = Number.parseInt(req.query.page) || 1
        const limit = Number.parseInt(req.query.limit) || 10
        const offset = (page - 1) * limit

        const users = await User.findAll(limit, offset)
        const total = await User.countAll()

        res.json({
            items: users,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        })
    }),
)

export default router
