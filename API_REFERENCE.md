# API Reference

Documentación rápida de todos los endpoints disponibles.

## Base URL

```
http://localhost:5000
```

## Authentication Endpoints (sin token requerido)

### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 4,
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@coursesystem.com",
  "password": "Admin@123456"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "admin@coursesystem.com",
    "fullName": "System Admin",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Programs Endpoints (requieren token)

**Authorization Header:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### List Programs
```
GET /api/programs?page=1&limit=10&search=React
```

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "React Fundamentals",
      "description": "Learn React basics and hooks",
      "startDate": "2024-01-15",
      "status": "active",
      "createdAt": "2024-01-10T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### Get Single Program
```
GET /api/programs/:id
```

### Create Program (Admin Only)
```
POST /api/programs
Content-Type: application/json
Authorization: Bearer ADMIN_TOKEN

{
  "name": "Advanced React",
  "description": "Deep dive into React ecosystem",
  "startDate": "2024-02-01",
  "status": "active"
}
```

### Update Program (Admin Only)
```
PUT /api/programs/:id
Content-Type: application/json
Authorization: Bearer ADMIN_TOKEN

{
  "name": "Advanced React - Updated",
  "description": "Updated description",
  "status": "active"
}
```

### Delete Program (Admin Only)
```
DELETE /api/programs/:id
Authorization: Bearer ADMIN_TOKEN
```

## Users Endpoints (requieren token)

### List All Users
```
GET /api/users?page=1&limit=10
```

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "email": "admin@coursesystem.com",
      "fullName": "System Admin",
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 4,
  "page": 1
}
```

### Get User by ID
```
GET /api/users/:id
```

### Enroll in Program
```
POST /api/users/:userId/programs/:programId
Authorization: Bearer USER_TOKEN
```

**Response:**
```json
{
  "message": "Successfully enrolled in program",
  "enrollment": {
    "userId": 2,
    "programId": 1,
    "enrolledAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get User Programs
```
GET /api/users/:id/programs
Authorization: Bearer USER_TOKEN
```

**Response:**
```json
{
  "programs": [
    {
      "id": 1,
      "name": "React Fundamentals",
      "description": "Learn React basics",
      "status": "active",
      "enrolledAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## GraphQL Endpoint

```
POST /graphql
```

### Query Programs
```graphql
query {
  programs(page: 1, limit: 10, search: "React") {
    items {
      id
      name
      description
      startDate
      status
    }
    total
  }
}
```

### Mutation: Create Program
```graphql
mutation {
  createProgram(
    name: "New Course"
    description: "Course description"
    startDate: "2024-03-01"
    status: "active"
  ) {
    id
    name
    createdAt
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email already registered"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Program not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error"
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Token missing/invalid |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

## Health Check

```
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

## Rate Limiting

No hay rate limiting implementado en desarrollo. Para producción, considera agregar:
- express-rate-limit
- redis para almacenar tokens

## Paginación

Endpoints que soportan paginación:
- \`GET /api/programs?page=1&limit=10\`
- \`GET /api/users?page=1&limit=10\`

Query parameters:
- \`page\`: Número de página (default: 1)
- \`limit\`: Resultados por página (default: 10, max: 100)

## Búsqueda

Endpoints que soportan búsqueda:
- \`GET /api/programs?search=keyword\`

Search busca en:
- Nombre del programa
- Descripción del programa

```
