import express from "express"
import { Program } from "../models/Program.model.js"
import { User } from "../models/User.model.js"
import { adminMiddleware } from "../middleware/auth.middleware.js"
import { validateProgram, validatePagination } from "../middleware/validation.middleware.js"
import { asyncHandler } from "../middleware/error.middleware.js"

const router = express.Router()

// Obtener todos los programas (con paginación y filtrado)
router.get(
    "/",
    validatePagination,
    asyncHandler(async (req, res) => {
        const page = Number.parseInt(req.query.page) || 1
        const limit = Number.parseInt(req.query.limit) || 10
        const offset = (page - 1) * limit
        const status = req.query.status || null

        const programs = await Program.findAll(limit, offset, status)
        const total = await Program.countAll(status)

        res.json({
            items: programs,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        })
    }),
)

// Obtener un solo programa
router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const program = await Program.findById(req.params.id)
        if (!program) {
            return res.status(404).json({ error: "Programa no encontrado" })
        }
        res.json(program)
    }),
)

// Obtener usuarios del programa
router.get(
    "/:id/users",
    asyncHandler(async (req, res) => {
        const page = Number.parseInt(req.query.page) || 1
        const limit = Number.parseInt(req.query.limit) || 10
        const offset = (page - 1) * limit

        const program = await Program.findById(req.params.id)
        if (!program) {
            return res.status(404).json({ error: "Programa no encontrado" })
        }

        const users = await Program.getProgramUsers(req.params.id, limit, offset)
        res.json({ users, program })
    }),
)

// Crear programa (sólo administrador)
router.post(
    "/",
    adminMiddleware,
    validateProgram,
    asyncHandler(async (req, res) => {
        const { name, description, startDate, status } = req.body
        const program = await Program.create(name, description, startDate, status)
        res.status(201).json(program)
    }),
)

// Actualizar programa (sólo administrador)
router.put(
    "/:id",
    adminMiddleware,
    validateProgram,
    asyncHandler(async (req, res) => {
        const program = await Program.update(req.params.id, req.body)
        if (!program) {
            return res.status(404).json({ error: "Programa no encontrado" })
        }
        res.json(program)
    }),
)

// Eliminar programa (sólo administrador)
router.delete(
    "/:id",
    adminMiddleware,
    asyncHandler(async (req, res) => {
        const result = await Program.delete(req.params.id)
        if (!result) {
            return res.status(404).json({ error: "Programa no encontrado" })
        }
        res.json({ message: "Programa eliminado exitosamente" })
    }),
)

// Inscribir al usuario en el programa (sólo administrador)
router.post(
    "/:programId/enroll",
    adminMiddleware,
    asyncHandler(async (req, res) => {
        const { userId } = req.body

        const program = await Program.findById(req.params.programId)
        if (!program) {
            return res.status(404).json({ error: "Programa no encontrado" })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" })
        }

        const enrollment = await Program.enrollUser(userId, req.params.programId)
        res.status(201).json({ message: "Usuario registrado exitosamente", enrollment })
    }),
)

// Dar de baja a un usuario del programa (solo administrador)
router.delete(
    "/:programId/enroll/:userId",
    adminMiddleware,
    asyncHandler(async (req, res) => {
        const result = await Program.unenrollUser(req.params.userId, req.params.programId)
        if (!result) {
            return res.status(404).json({ error: "No se encontró la inscripción" })
        }
        res.json({ message: "Usuario cancelado exitosamente" })
    }),
)

export default router
