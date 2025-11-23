import { query } from "../db/connection.js"

export class User {
    static async create(email, passwordHash, fullName, role = "user") {
        const result = await query(
            "INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role, created_at",
            [email, passwordHash, fullName, role],
        )
        return result.rows[0]
    }

    static async findByEmail(email) {
        const result = await query("SELECT * FROM users WHERE email = $1", [email])
        return result.rows[0]
    }

    static async findById(id) {
        const result = await query("SELECT id, email, full_name, role, created_at FROM users WHERE id = $1", [id])
        return result.rows[0]
    }

    static async findAll(limit = 10, offset = 0) {
        const result = await query("SELECT id, email, full_name, role, created_at FROM users LIMIT $1 OFFSET $2", [
            limit,
            offset,
        ])
        return result.rows
    }

    static async countAll() {
        const result = await query("SELECT COUNT(*) FROM users")
        return Number.parseInt(result.rows[0].count)
    }

    static async update(id, { fullName, role }) {
        const result = await query(
            "UPDATE users SET full_name = $1, role = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
            [fullName, role, id],
        )
        return result.rows[0]
    }

    static async delete(id) {
        const result = await query("DELETE FROM users WHERE id = $1 RETURNING id", [id])
        return result.rows[0]
    }

    static async getUserPrograms(userId) {
        const result = await query(
            "SELECT p.* FROM programs p JOIN program_enrollments pe ON p.id = pe.program_id WHERE pe.user_id = $1",
            [userId],
        )
        return result.rows
    }
}
