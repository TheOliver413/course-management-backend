import express from "express"
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import { User } from "../models/User.model.js"
import { validateLogin, validateRegister } from "../middleware/validation.middleware.js"
import { asyncHandler } from "../middleware/error.middleware.js"

const router = express.Router()

router.post(
    "/register",
    validateRegister,
    asyncHandler(async (req, res) => {
        const { email, password, fullName } = req.body

        const existingUser = await User.findByEmail(email)
        if (existingUser) {
            return res.status(400).json({ error: "Correo electrónico ya registrado" })
        }

        const passwordHash = await bcryptjs.hash(password, 10)
        const user = await User.create(email, passwordHash, fullName)

        const token = jwt.sign({ id: user.id, email: user.email, role: "user" }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY,
        })

        res.status(201).json({
            message: "Usuario registrado exitosamente",
            user: { id: user.id, email: user.email, fullName: user.full_name },
            token,
        })
    }),
)

router.post(
    "/login",
    validateLogin,
    asyncHandler(async (req, res) => {
        const { email, password } = req.body

        const user = await User.findByEmail(email)
        if (!user) {
            return res.status(401).json({ error: "Credenciales no válidas" })
        }

        const passwordMatch = await bcryptjs.compare(password, user.password_hash)
        if (!passwordMatch) {
            return res.status(401).json({ error: "Credenciales no válidas" })
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY,
        })

        res.json({
            message: "Inicio de sesión exitoso",
            user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role },
            token,
        })
    }),
)

export default router
