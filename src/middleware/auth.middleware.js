import jwt from "jsonwebtoken"

export const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({ error: "No se proporciona ningún token" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.id
        req.userRole = decoded.role
        next()
    } catch (error) {
        return res.status(403).json({ error: "Token no válido o caducado" })
    }
}

export const adminMiddleware = (req, res, next) => {
    if (req.userRole !== "admin") {
        return res.status(403).json({ error: "Se requiere acceso de administrador" })
    }
    next()
}
