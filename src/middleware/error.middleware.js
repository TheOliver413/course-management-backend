export const errorHandler = (err, req, res, next) => {
    console.error("[ERROR]", err)

    if (err.code === "VALIDATION_ERROR") {
        return res.status(400).json({ error: err.message, details: err.details })
    }

    if (err.code === "NOT_FOUND") {
        return res.status(404).json({ error: err.message })
    }

    if (err.code === "UNAUTHORIZED") {
        return res.status(401).json({ error: err.message })
    }

    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    })
}

export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}
