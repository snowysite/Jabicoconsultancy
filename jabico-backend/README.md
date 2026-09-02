# Jabico Consultancy — Backend API

A working Node/Express backend built to match the existing frontend code
exactly — every endpoint referenced in `js/admin-students.js`,
`js/admin-cohorts.js`, `js/admin-resources.js`, `js/documents.js`,
`js/my-courses.js`, `js/notifications.js`, `js/schedule.js`, and the
student registration/login flow inside `index.html`.

No native dependencies (no `better-sqlite3`, no compiled bindings) — data
is stored in a JSON file (`src/data/db.json`), so `npm install` never
needs a build step and this runs anywhere Node runs.

---

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Server runs on `http://localhost:4000` by default (change `PORT` in `.env`).

## Demo accounts

**Admin** (matches `js/admin-login.js`):
```
email:    admin@jabicoconsultancy.com
password: Admin@123
```

**Student** (any seeded student, e.g. Amara Okafor):
```
firstName: Amara
lastName:  Okafor
password:  Student@123
```

---

## Important: a bug this backend surfaced

`index.html`'s student login handler checks `student.status !== "approved"`,
but nothing in the codebase ever sets that exact string — approving a
student (`js/admin-students.js`) sets status to `"active"`. This backend
uses `"active"` as the canonical approved state (consistent with
`admin-students.js`). **You should update `index.html`'s check from
`"approved"` to `"active"`** so it matches once you wire the frontend to
this API.

---

## Data model note: Applications = pending students

`index.html`'s registration form only collects `firstName`, `lastName`,
`email`, and `password` — there's no separate "application" record with
its own fields. So a pending student registration **is** the application
waiting on admin review. Approving an application activates that same
student record; rejecting it deletes the registration.

If you want applications to capture extra fields (phone, cohort choice,
a motivation statement), that needs to be added to `index.html`'s
registration form first — the backend can be extended to store them once
they exist on the frontend.

---

## Endpoints

All `/api/admin/*` routes (except `/api/admin/auth/login`) require:
`Authorization: Bearer <admin token>`

All `/api/student/*` and `/api/documents` routes (except
`/api/student/auth/*`) require: `Authorization: Bearer <student token>`

### Auth
| Method | Path | Matches |
|---|---|---|
| POST | `/api/admin/auth/login` | `js/admin-login.js` |
| POST | `/api/student/auth/register` | `index.html` registerForm |
| POST | `/api/student/auth/login` | `index.html` loginForm |

### Students — `js/admin-students.js`
| Method | Path |
|---|---|
| GET | `/api/admin/students?search=&cohort=&status=&sort=` |
| GET | `/api/admin/students/:id` |
| POST | `/api/admin/students` |
| PUT | `/api/admin/students/:id` |
| PATCH | `/api/admin/students/:id/status` |
| DELETE | `/api/admin/students/:id` |

### Applications — pending students
| Method | Path |
|---|---|
| GET | `/api/admin/applications?status=pending\|approved\|all` |
| GET | `/api/admin/applications/:id` |
| POST | `/api/admin/applications/:id/approve` |
| POST | `/api/admin/applications/:id/reject` |
| DELETE | `/api/admin/applications/:id` |

### Cohorts — `js/admin-cohorts.js`
| Method | Path |
|---|---|
| GET | `/api/admin/cohorts` |
| GET | `/api/admin/cohorts/:id` |
| POST | `/api/admin/cohorts` |
| PUT | `/api/admin/cohorts/:id` |
| DELETE | `/api/admin/cohorts/:id` |

### Resources & Announcements — `js/admin-resources.js`
| Method | Path |
|---|---|
| GET / POST / DELETE | `/api/admin/resources` |
| GET / POST / DELETE | `/api/admin/announcements` |

### Student portal
| Method | Path | Matches |
|---|---|---|
| GET | `/api/student/courses` | `js/my-courses.js` |
| GET | `/api/student/schedule` | `js/schedule.js` |
| GET | `/api/student/notifications` | `js/notifications.js` |
| PATCH | `/api/student/notifications/:id/read` | `js/notifications.js` |
| GET | `/api/documents` | `js/documents.js` |

### Health
| Method | Path |
|---|---|
| GET | `/api/health` |

---

## Testing it yourself

```bash
# Admin login
curl -X POST http://localhost:4000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jabicoconsultancy.com","password":"Admin@123"}'

# Use the returned token
curl http://localhost:4000/api/admin/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Connecting the frontend

Right now the frontend pages use hardcoded demo arrays in the HTML
(`data-*` attributes) instead of calling this API. To wire them up:

1. Replace `loadStudentsFromDOM()` in `js/admin-students.js` with a
   `fetch("/api/admin/students", { headers: { Authorization: ... } })` call.
2. Store the admin JWT from `/api/admin/auth/login` in `localStorage` after
   a successful login in `js/admin-login.js`, and attach it to every
   subsequent admin fetch.
3. Do the same for the student side: after `/api/student/auth/login`
   succeeds, store the token instead of (or alongside) the current
   `jabicoStudentSession` localStorage object.
4. Set `CORS`-appropriate origins in `server.js` if you deploy the frontend
   and backend on different domains (currently wide open for local dev).

## Project structure

```
backend/
  server.js                        entry point, route mounting
  .env.example                     copy to .env
  src/
    data/db.json                   seed data (mirrors frontend demo data)
    lib/db.js                      read/write helpers
    lib/auth.js                    JWT + bcrypt helpers
    middleware/requireAdminAuth.js
    middleware/requireStudentAuth.js
    routes/
      adminAuth.routes.js
      studentAuth.routes.js
      students.routes.js
      applications.routes.js
      cohorts.routes.js
      resources.routes.js
      announcements.routes.js
      studentPortal.routes.js
      documents.routes.js
```
