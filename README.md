# Student Election Voting System

A simple, responsive full-stack web application for college/student-council elections.

## Stack

- Frontend: React + Vite + React Router
- Backend: Java 17 + Spring Boot + Spring Data JPA (Hibernate)
- Database: PostgreSQL for production, H2 for quick local development
- Styling: Custom responsive CSS with a floral/soft pastel palette
- No Spring Security, JWT, OAuth, or token-based authentication
- REST API between React and Spring Boot

> **Important:** This project intentionally uses simple login because you requested no security/tokens. Passwords are stored as plain text for this demo/academic project. Do not use this authentication design for a real public election system.

## Features

### Admin
- Admin login
- Create elections with title, description, start time, end time
- Add posts/positions to an election
- Add candidates to each post
- View elections, posts, candidates and results

### Student
- Student login
- View available elections
- Vote exactly once per post
- Voting is allowed only during the election period
- Students cannot vote twice for the same post
- Results become visible automatically after the election closes

### UI
- Responsive desktop/tablet/mobile layout
- Floral-inspired pastel palette
- Small transitions, hover effects, voting animations and result bars
- Clean dashboard cards and forms

---

# 1. Prerequisites

Install:

- Java 17+
- Maven 3.9+
- Node.js 20+
- npm
- Git
- VS Code

For local development you do NOT need PostgreSQL because the default profile uses an in-memory H2 database.

---

# 2. Project Structure

```text
student-election-voting-system/
├── backend/
│   ├── pom.xml
│   ├── src/main/java/com/example/election/
│   │   ├── ElectionApplication.java
│   │   ├── config/CorsConfig.java
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── exception/
│   │   ├── repository/
│   │   └── service/
│   └── src/main/resources/application.properties
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── api.js
│       ├── App.jsx
│       ├── main.jsx
│       ├── styles.css
│       ├── components/
│       └── pages/
│
├── render.yaml
└── README.md
```

---

# 3. Run Backend in VS Code

Open the project folder in VS Code.

Open a terminal:

```bash
cd backend
mvn spring-boot:run
```

Backend:

```text
http://localhost:8080
```

The default local database is H2 and is reset when the application restarts.

H2 console:

```text
http://localhost:8080/h2-console
```

Use:

```text
JDBC URL: jdbc:h2:mem:electiondb
User: sa
Password: 
```

---

# 4. Run Frontend in VS Code

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

The frontend automatically calls:

```text
http://localhost:8080/api
```

unless `VITE_API_URL` is configured.

---

# 5. Demo Accounts

The application automatically creates these accounts on first backend startup:

### Admin

```text
Username: admin
Password: admin123
```

### Students

```text
Username: student1
Password: student123
```

```text
Username: student2
Password: student123
```

These are demo credentials only.

---

# 6. Demo Data

The backend also creates a sample election on first startup:

- Student Council Election 2026
- President
- General Secretary
- Cultural Secretary

Sample candidates are created automatically.

The sample election is initially configured as an active election so that you can immediately test voting.

---

# 7. API Overview

## Login

```http
POST /api/auth/login
```

Example:

```json
{
  "username": "student1",
  "password": "student123"
}
```

## Get elections

```http
GET /api/elections
```

## Get election

```http
GET /api/elections/{id}
```

## Create election

```http
POST /api/elections
```

## Add post

```http
POST /api/elections/{electionId}/posts
```

## Add candidate

```http
POST /api/posts/{postId}/candidates
```

## Cast vote

```http
POST /api/votes
```

Example:

```json
{
  "studentId": 2,
  "postId": 1,
  "candidateId": 1
}
```

## Results

```http
GET /api/elections/{id}/results
```

Results are returned only after the election end time.

---

# 8. PostgreSQL Production Setup

For deployment, use PostgreSQL.

Set these backend environment variables:

```text
DB_URL=jdbc:postgresql://HOST:5432/DATABASE
DB_USERNAME=USERNAME
DB_PASSWORD=PASSWORD
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

The backend uses:

```text
spring.jpa.hibernate.ddl-auto=update
```

so tables are created/updated automatically.

For a serious production election system, use migrations such as Flyway, proper authentication, encrypted passwords, HTTPS, audit logs and stronger authorization.

---

# 9. Deploy Backend to Render

1. Push this project to GitHub.
2. Open Render.
3. Create a PostgreSQL database.
4. Create a new Web Service from the GitHub repository.
5. Set Root Directory to:

```text
backend
```

6. Build Command:

```bash
mvn clean package -DskipTests
```

7. Start Command:

```bash
java -jar target/student-election-backend-1.0.0.jar
```

8. Add environment variables:

```text
DB_URL=jdbc:postgresql://...
DB_USERNAME=...
DB_PASSWORD=...
CORS_ALLOWED_ORIGINS=https://YOUR-FRONTEND-DOMAIN
```

After deployment, copy your Render backend URL, for example:

```text
https://student-election-api.onrender.com
```

Your API URL becomes:

```text
https://student-election-api.onrender.com/api
```

---

# 10. Deploy Frontend to Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Set Root Directory to:

```text
frontend
```

4. Framework preset:

```text
Vite
```

5. Build command:

```bash
npm run build
```

6. Output directory:

```text
dist
```

7. Add environment variable:

```text
VITE_API_URL=https://YOUR-RENDER-BACKEND.onrender.com/api
```

8. Deploy.

Then update the Render environment variable:

```text
CORS_ALLOWED_ORIGINS=https://YOUR-VERCEL-DOMAIN.vercel.app
```

Redeploy the backend if required.

---

# 11. Deploy Frontend to Netlify

Use:

```text
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

Environment variable:

```text
VITE_API_URL=https://YOUR-RENDER-BACKEND.onrender.com/api
```

---

# 12. Git Commands

From the project root:

```bash
git init
git add .
git commit -m "Initial student election voting system"
```

Create a GitHub repository named:

```text
student-election-voting-system
```

Then:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/student-election-voting-system.git
git push -u origin main
```

For future changes:

```bash
git add .
git commit -m "Update election functionality"
git push
```

---

# 13. Recommended VS Code Workflow

Open the project root:

```text
student-election-voting-system
```

Terminal 1:

```bash
cd backend
mvn spring-boot:run
```

Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# 14. Functional Flow

### Admin

Login → Dashboard → Create Election → Add Posts → Add Candidates → Monitor Election → View Results

### Student

Login → Available Elections → Select Election → Select One Candidate Per Post → Submit Vote → Confirmation

### After Closing

Student opens the election → Results are displayed automatically → Vote counts are shown with animated result bars.

---

# 15. Important Design Note

This is intentionally a simple academic/demo application without:

- Spring Security
- JWT
- OAuth
- session tokens
- password hashing
- role-based authorization middleware

The UI hides role-specific screens, and the backend performs basic validation, but this should not be considered secure enough for a real institutional election.

For a production election platform, authentication and authorization must be implemented properly.

---

# 16. Vercel / Netlify SPA Routing

The frontend includes:

- `vercel.json` for Vercel route fallback
- `netlify.toml` for Netlify route fallback

This prevents React Router URLs such as `/student/election/1` from returning a 404 after deployment.

# 17. Database Notes

Local development uses H2 by default.

Production should use PostgreSQL. Do not commit real database credentials into GitHub.

Use environment variables on Render for:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
CORS_ALLOWED_ORIGINS
```

For the PostgreSQL URL, use the JDBC form:

```text
jdbc:postgresql://HOST:5432/DATABASE
```

