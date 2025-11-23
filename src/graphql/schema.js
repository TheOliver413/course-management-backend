import { gql } from "graphql-tag"
import { Program } from "../models/Program.model.js"
import jwt from "jsonwebtoken"

export const typeDefs = gql`
  type Program {
    id: Int!
    name: String!
    description: String
    startDate: String!
    status: String!
    createdAt: String!
  }

  type User {
    id: Int!
    email: String!
    fullName: String!
    role: String!
    createdAt: String!
  }

  type ProgramsResponse {
    items: [Program!]!
    total: Int!
    page: Int!
    limit: Int!
    pages: Int!
  }

  type Query {
    programs(page: Int, limit: Int, status: String): ProgramsResponse!
    program(id: Int!): Program
    programUsers(programId: Int!, page: Int, limit: Int): [User!]!
  }

  type Mutation {
    createProgram(name: String!, description: String!, startDate: String!): Program
    updateProgram(id: Int!, name: String!, description: String!, startDate: String!): Program
    deleteProgram(id: Int!): Boolean
  }
`

export const resolvers = {
    Query: {
        programs: async (_, { page = 1, limit = 10, status }) => {
            const offset = (page - 1) * limit
            const programs = await Program.findAll(limit, offset, status)
            const total = await Program.countAll(status)

            return {
                items: programs,
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            }
        },
        program: async (_, { id }) => {
            return await Program.findById(id)
        },
        programUsers: async (_, { programId, page = 1, limit = 10 }) => {
            const offset = (page - 1) * limit
            return await Program.getProgramUsers(programId, limit, offset)
        },
    },
    Mutation: {
        createProgram: async (_, { name, description, startDate }, context) => {
            try {
                const decoded = jwt.verify(context.userId, process.env.JWT_SECRET)
                if (decoded.role !== "admin") {
                    throw new Error("Se requiere acceso de administrador")
                }
            } catch (error) {
                throw new Error("Error de autenticación: " + error.message)
            }
            return await Program.create(name, description, startDate)
        },
        updateProgram: async (_, { id, name, description, startDate }, context) => {
            try {
                const decoded = jwt.verify(context.userId, process.env.JWT_SECRET)
                if (decoded.role !== "admin") {
                    throw new Error("Se requiere acceso de administrador")
                }
            } catch (error) {
                throw new Error("Error de autenticación: " + error.message)
            }
            return await Program.update(id, { name, description, startDate })
        },
        deleteProgram: async (_, { id }, context) => {
            try {
                const decoded = jwt.verify(context.userId, process.env.JWT_SECRET)
                if (decoded.role !== "admin") {
                    throw new Error("Se requiere acceso de administrador")
                }
            } catch (error) {
                throw new Error("Error de autenticación: " + error.message)
            }
            await Program.delete(id)
            return true
        },
    },
}
