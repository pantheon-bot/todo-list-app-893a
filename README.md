# Todo List App - Next.js + TiDB Cloud

A multi-user todo list application built with Next.js, TypeScript, and TiDB Cloud Serverless using Kysely as the type-safe SQL query builder.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: TiDB Cloud Serverless (MySQL-compatible)
- **Query Builder**: Kysely (type-safe SQL query builder)
- **Styling**: Tailwind CSS v4

## Database Schema

### Users Table
```sql
users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

### Todos Table
```sql
todos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  is_completed TINYINT(1) NOT NULL DEFAULT 0,
  due_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

## Getting Started

### Prerequisites

1. Node.js 20+ installed
2. TiDB Cloud Serverless cluster (or branch) with connection URL
3. Environment variables configured

### Environment Setup

Create a `.env.local` file in the root directory:

```bash
DATABASE_URL=https://[username]:[password]@[host]:4000/[database]
```

### Installation

```bash
npm install
```

### Running Migrations

Before running the application for the first time, execute the database migrations:

```bash
npm run migrate
```

This will:
- Create the `users` table
- Create the `todos` table with proper foreign key relationships
- Set up indexes for optimal query performance

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Users

#### Create a User
```http
POST /api/users
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe"
}
```

Response (201 Created):
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "created_at": "2025-11-27T07:00:00.000Z",
    "updated_at": "2025-11-27T07:00:00.000Z"
  }
}
```

#### List All Users
```http
GET /api/users
```

Response (200 OK):
```json
{
  "users": [...]
}
```

### Todos

#### Create a Todo
```http
POST /api/todos
Content-Type: application/json

{
  "user_id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive README",
  "due_date": "2025-12-01T00:00:00.000Z"
}
```

Response (201 Created):
```json
{
  "todo": {
    "id": 1,
    "user_id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive README",
    "is_completed": 0,
    "due_date": "2025-12-01T00:00:00.000Z",
    "created_at": "2025-11-27T07:00:00.000Z",
    "updated_at": "2025-11-27T07:00:00.000Z"
  }
}
```

#### List Todos for a User
```http
GET /api/todos?user_id=1
GET /api/todos?user_id=1&is_completed=true
```

Response (200 OK):
```json
{
  "todos": [...]
}
```

Query Parameters:
- `user_id` (required): Filter todos by user ID
- `is_completed` (optional): Filter by completion status (true/false)

#### Get a Specific Todo
```http
GET /api/todos/1
```

Response (200 OK):
```json
{
  "todo": {...}
}
```

#### Update a Todo
```http
PATCH /api/todos/1
Content-Type: application/json

{
  "title": "Updated title",
  "is_completed": true
}
```

Updatable fields:
- `title`: string (max 500 characters)
- `description`: string or null
- `is_completed`: boolean
- `due_date`: ISO 8601 date string or null

Response (200 OK):
```json
{
  "todo": {...}
}
```

#### Delete a Todo
```http
DELETE /api/todos/1
```

Response (200 OK):
```json
{
  "message": "Todo deleted successfully"
}
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── todos/
│   │   │   ├── route.ts         # List & create todos
│   │   │   └── [id]/
│   │   │       └── route.ts     # Get, update, delete todo
│   │   └── users/
│   │       └── route.ts         # List & create users
│   ├── layout.tsx
│   └── page.tsx
└── lib/
    └── db/
        ├── db.ts                # Kysely database instance
        ├── schema.d.ts          # TypeScript type definitions
        ├── index.ts             # Export db and types
        └── migrations/
            ├── 001_initial_schema.sql    # Migration SQL
            └── run-migrations.ts         # Migration runner

```

## Database Access Layer

This project uses [Kysely](https://kysely.dev/) for type-safe SQL queries. All database interactions are fully typed, providing excellent IDE support and compile-time safety.

Example query:
```typescript
import db from '@/lib/db';

// Fully typed query
const todos = await db
  .selectFrom('todos')
  .selectAll()
  .where('user_id', '=', userId)
  .where('is_completed', '=', 0)
  .execute();
```

## Error Handling

All API endpoints include proper error handling:
- **400 Bad Request**: Invalid input or missing required fields
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Duplicate email/username
- **500 Internal Server Error**: Database or server errors

## Future Enhancements

Potential features to implement:
- User authentication (OAuth, JWT)
- Todo sharing and collaboration
- Todo categories/tags
- Priority levels
- Search functionality
- Pagination for large lists
- Rate limiting
- API documentation with OpenAPI/Swagger

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the project in Vercel
3. Set the `DATABASE_URL` environment variable
4. Deploy

The migrations should be run manually or via a deployment script before the first deployment.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Kysely Documentation](https://kysely.dev/)
- [TiDB Cloud Documentation](https://docs.pingcap.com/tidbcloud/)

## License

MIT
