import { query } from "../db/connection.js"

export class Program {
    static async create(name, description, startDate, status = "active") {
        const result = await query(
            "INSERT INTO programs (name, description, start_date, status) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, description, startDate, status],
        )
        return result.rows[0]
    }

    static async findById(id) {
        const result = await query("SELECT * FROM programs WHERE id = $1", [id])
        return result.rows[0]
    }

    static async findAll(limit = 10, offset = 0, status = null) {
        let query_text = "SELECT * FROM programs"
        const params = []

        if (status) {
            query_text += " WHERE status = $1"
            params.push(status)
            query_text += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
            params.push(limit, offset)
        } else {
            query_text += ` LIMIT $1 OFFSET $2`
            params.push(limit, offset)
        }

        const result = await query(query_text, params)
        return result.rows
    }

    static async countAll(status = null) {
        let query_text = "SELECT COUNT(*) FROM programs"
        const params = []

        if (status) {
            query_text += " WHERE status = $1"
            params.push(status)
        }

        const result = await query(query_text, params)
        return Number.parseInt(result.rows[0].count)
    }

    static async update(id, { name, description, startDate, status }) {
        const result = await query(
            "UPDATE programs SET name = $1, description = $2, start_date = $3, status = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *",
            [name, description, startDate, status, id],
        )
        return result.rows[0]
    }

    static async delete(id) {
        const result = await query("DELETE FROM programs WHERE id = $1 RETURNING id", [id])
        return result.rows[0]
    }

    static async getProgramUsers(programId, limit = 10, offset = 0) {
        const result = await query(
            "SELECT u.id, u.email, u.full_name, pe.enrolled_at FROM users u JOIN program_enrollments pe ON u.id = pe.user_id WHERE pe.program_id = $1 LIMIT $2 OFFSET $3",
            [programId, limit, offset],
        )
        return result.rows
    }

    static async enrollUser(userId, programId) {
        const result = await query("INSERT INTO program_enrollments (user_id, program_id) VALUES ($1, $2) RETURNING *", [
            userId,
            programId,
        ])
        return result.rows[0]
    }

    static async unenrollUser(userId, programId) {
        const result = await query("DELETE FROM program_enrollments WHERE user_id = $1 AND program_id = $2 RETURNING *", [
            userId,
            programId,
        ])
        return result.rows[0]
    }
}
