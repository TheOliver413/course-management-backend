import { body, validationResult, query } from "express-validator"

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: "La validación falló",
            details: errors.array(),
        })
    }
    next()
}

export const validateLogin = [
    body("email").isEmail().withMessage("Correo electrónico no válido"),
    body("password").notEmpty().withMessage("Se requiere contraseña"),
    validateRequest,
]

export const validateRegister = [
    body("email").isEmail().withMessage("Correo electrónico no válido"),
    body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    body("fullName").notEmpty().withMessage("Nombre completo requerido"),
    validateRequest,
]

export const validateProgram = [
    body("name").notEmpty().withMessage("Nombre del programa requerido"),
    body("description").notEmpty().withMessage("Descripción requerida"),
    body("startDate").isISO8601().withMessage("Formato de fecha no válido"),
    validateRequest,
]

export const validatePagination = [
    query("page").optional().isInt({ min: 1 }).withMessage("La página debe ser >= 1"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("El límite debe estar entre 1 y 100"),
    validateRequest,
]
