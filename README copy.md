# Quick Start - Backend

Sigue estos pasos para tener el backend funcionando en 5 minutos.

## 1. Configuración de PostgreSQL

### Windows
1. Abre Services (Presiona Windows + R y escribe services.msc)
2. Busca "postgresql" y verifica que esté en estado "Running"
3. Si no está corriendo, haz click derecho > Start

### Mac
```bash
brew services start postgresql
```

### Linux
```bash
sudo systemctl start postgresql
```

## 2. Crear Base de Datos

```bash
# Abre PostgreSQL CLI
psql -U postgres

# Dentro de psql, ejecuta:
CREATE DATABASE course_db;
\\q
```

## 3. Configurar .env

```bash
# En la carpeta backend/, copia el template
cp .env.template .env

# Edita .env y reemplaza:
# DATABASE_URL=postgresql://postgres:TU_CONTRASEÑA@localhost:5432/course_db
```

## 4. Instalar Dependencias

```bash
cd backend
npm install
```

## 5. Verificar Conexión

```bash
npm run test:connection
```

Deberías ver:
```
[SUCCESS] Conexión exitosa a PostgreSQL!
```

## 6. Ejecutar Setup Completo

```bash
npm run setup
```

Esto ejecuta:
1. Instala dependencias
2. Prueba la conexión
3. Crea las tablas (migrate)
4. Carga datos de prueba (seed)

## 7. Iniciar el Servidor

```bash
npm run dev
```

Deberías ver:
```
[Server] Running on http://localhost:5000
[GraphQL] Available at http://localhost:5000/graphql
```

## 8. Probar Endpoints

### Registrarse
```bash
curl -X POST http://localhost:5000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "Test@123456",
    "fullName": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "admin@coursesystem.com",
    "password": "Admin@123456"
  }'
```

Copia el token de la respuesta y úsalo en requests protegidos:

### Listar Programas
```bash
curl -X GET http://localhost:5000/api/programs \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Usuarios de Prueba Precargados

| Email | Password | Rol |
|-------|----------|-----|
| admin@coursesystem.com | Admin@123456 | admin |
| user1@example.com | User@123456 | user |
| user2@example.com | User@123456 | user |
| user3@example.com | User@123456 | user |

## Troubleshooting

### Error: "connect ECONNREFUSED"
PostgreSQL no está corriendo. Inicia el servicio.

### Error: "password authentication failed"
La contraseña en DATABASE_URL es incorrecta. Verifica en PostgreSQL.

### Error: "database course_db does not exist"
Ejecuta: \`psql -U postgres -c "CREATE DATABASE course_db;"\`

### Error: "Already exists"
Ejecuta: \`npm run drop\` y luego \`npm run setup\`

## Comandos Útiles

```bash
npm run dev              # Iniciar con hot reload
npm run test             # Ejecutar tests
npm run migrate          # Solo migración
npm run seed             # Solo cargar datos
npm run test:connection  # Verificar conexión a BD
npm run drop             # Limpiar todas las tablas
```

## URL del GraphQL Playground

Cuando el servidor esté corriendo:
http://localhost:5000/graphql

Ahí puedes escribir queries y mutations.

## Próximo Paso

Ve a la carpeta `frontend/` para iniciar el cliente React.
```
