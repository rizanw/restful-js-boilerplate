# RESTful API Boilerplate — Express, MongoDB, JWT

A starter for building REST APIs in Node.js: Express with MongoDB (Mongoose), JWT authentication, role-based authorization, input validation, centralized error handling, and structured logging. Clone it, add your models and routes, and build from there.

## Features

- **Authentication**: register and log in with bcrypt-hashed passwords and JWT access tokens
- **Role-based authorization**: `user` and `superuser` roles, with a `requireRole()` middleware to protect routes
- **Ownership checks**: users can only edit or delete their own posts; superusers can manage any
- **Safe defaults**: new accounts always get the `user` role, passwords are never returned, login errors don't reveal which emails exist
- **Validation and errors**: request validation, 404 for unknown or malformed IDs, and one error handler that never leaks stack traces to clients
- **Security headers and CORS**: Helmet, plus a configurable CORS allow-list
- **Logging**: HTTP and application logs through Winston, to the console and `logs/`

## Getting started

Requires Node.js 18+ and MongoDB.

```bash
git clone https://github.com/rizanw/restful-js-boilerplate.git
cd restful-js-boilerplate
yarn install            # or: npm install
cp .env.sample .env     # then set JWT_SECRET (openssl rand -hex 64) and MONGODB
yarn dev                # or: npm run dev (restarts on changes)
```

The server starts at `http://localhost:5000` and creates the `user` and `superuser` roles on first run.

### Creating a superuser

Register an account, add its email to `SUPERUSER_EMAILS` in `.env`, and restart. Existing accounts with those emails are promoted on startup. After that, a superuser can change anyone's roles through the API.

## API

All routes are prefixed with `API_URI` (default `/api/v1`). Protected routes need an `Authorization: Bearer <accessToken>` header.

### Auth

| Method | Route | Auth | Body |
|---|---|---|---|
| `POST` | `/register` | — | `name`, `email`, `password` (8+ chars) |
| `POST` | `/login` | — | `email`, `password` |

Both return the user and an `accessToken`.

### Posts

| Method | Route | Auth | Notes |
|---|---|---|---|
| `GET` | `/posts` | — | newest first, with author name |
| `GET` | `/post/:id` | — | |
| `POST` | `/post` | user | `title`, `content`; you become the author |
| `PATCH` | `/post/:id` | author or superuser | `title` and/or `content` |
| `DELETE` | `/post/:id` | author or superuser | |

### Account

| Method | Route | Auth | Body |
|---|---|---|---|
| `GET` | `/profile` | user | |
| `PATCH` | `/change-email` | user | `email` |
| `PATCH` | `/change-password` | user | `oldPassword`, `newPassword` |
| `DELETE` | `/profile` | user | `password` (confirmation) |

### Admin

| Method | Route | Auth | Body |
|---|---|---|---|
| `GET` | `/users` | superuser | |
| `PATCH` | `/users/:id/roles` | superuser | `roles`, e.g. `["user", "superuser"]` |

### Example

```bash
curl -X POST http://localhost:5000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ann","email":"ann@example.com","password":"supersecret"}'

curl -X POST http://localhost:5000/api/v1/post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{"title":"Hello","content":"First post"}'
```

Responses share one shape: `{ "success": true, "message": "...", "data": ... }`.

## Configuration

| Variable | Default | Description |
|---|---|---|
| `APP_NAME` | `restful-js-boilerplate` | name shown on `GET /` |
| `APP_URL` | `http://localhost` | base URL, used for logs and the default CORS origin |
| `APP_PORT` | `8080` | port to listen on |
| `CORS_ORIGINS` | `APP_URL:APP_PORT` | comma-separated browser origins allowed to call the API |
| `API_URI` | `/api/v1` | route prefix |
| `MONGODB` | — | MongoDB connection string |
| `JWT_SECRET` | — (**required**) | secret for signing tokens; the server won't start without it |
| `JWT_EXPIRES_IN` | `6h` | token lifetime |
| `SUPERUSER_EMAILS` | — | comma-separated emails to promote to superuser on startup |
| `LOG_LEVEL` | `http` | Winston log level |

## Project structure

```
index.js                  Express app: security headers, CORS, parsers, routes, error handling
src/
├── config/               app, API, and auth settings from environment variables
├── controllers/          request handlers for auth, posts, and users
├── db/                   MongoDB connection, role seeding, superuser promotion
├── middlewares/          JWT verification, role checks, register validation, error handler
├── models/               Mongoose schemas: User, Role, Post
├── routes/               route definitions
└── utils/                logger, async handler wrapper
```

### Adding a resource

1. Create a schema in `src/models/` and register it in `src/models/index.js`.
2. Add handlers in `src/controllers/`, wrapped in `asyncHandler` so errors reach the error middleware.
3. Define routes in `src/routes/`, using `verifyToken` and `requireRole("superuser")` where needed, and register them in `index.js`.

## Tech stack

Express · Mongoose · jsonwebtoken · bcryptjs · Helmet · cors · Morgan · Winston · dotenv

## License

[MIT](LICENSE)
