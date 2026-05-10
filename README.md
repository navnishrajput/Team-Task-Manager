
# 🚀 Team Task Manager

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.1.5-green.svg)
![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)
![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)

A full-stack collaborative task management web application built with **React**, **Spring Boot**, and **PostgreSQL**.

*Simplified Trello/Asana clone for team productivity*

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Docs](#-api-documentation) • [Screenshots](#-screenshots)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Role-Based Access](#-role-based-access)
- [Screenshots](#-screenshots)
- [Postman Collection](#-postman-collection)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 Overview

**Team Task Manager** is a full-stack web application that enables teams to collaborate on projects, manage tasks, and track progress in real-time. Users can create projects, assign tasks, update statuses via a Kanban board, and view dashboards with analytics.

### Key Highlights:
- 🔐 **JWT Authentication** with role-based access control
- 📊 **Interactive Dashboard** with charts and statistics
- 📋 **Kanban Board** with drag-and-drop functionality
- 👥 **Team Management** - Add/remove members from projects
- 🎯 **Task Tracking** - Priority levels, due dates, overdue alerts
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS

---

## ✨ Features

### 🔐 Authentication & Authorization
- [x] User registration with name, email, password
- [x] Secure login with JWT (30-day validity)
- [x] Role-based access: **Admin** & **Member**
- [x] Protected routes on frontend

### 📁 Project Management
- [x] Create, update, delete projects
- [x] Admin can add/remove team members
- [x] Members can view assigned projects
- [x] First user automatically becomes Admin

### ✅ Task Management
- [x] Create tasks with title, description, priority, due date
- [x] Assign tasks to team members
- [x] Update task status: **To Do → In Progress → Done**
- [x] Kanban board with drag-and-drop
- [x] List view with inline status editing
- [x] Overdue task detection
- [x] Priority levels: Low, Medium, High, Urgent

### 📊 Dashboard
- [x] Total tasks count
- [x] Tasks by status (bar chart)
- [x] Task distribution (pie chart)
- [x] Tasks per user
- [x] Overdue tasks list
- [x] Recent tasks

### 👥 Role-Based Access
- **Admin:** Full control - manage tasks, users, projects
- **Member:** View and update only assigned tasks

### 🎨 UI/UX
- [x] Responsive design (mobile-friendly)
- [x] Sidebar navigation
- [x] Search and filter tasks
- [x] Profile dropdown
- [x] Settings page
- [x] Loading states & error handling
- [x] Confirmation dialogs for destructive actions

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React (Vite) | 18.3.1 |
| **Styling** | Tailwind CSS | 3.4.0 |
| **Icons** | Lucide React | 0.400.0 |
| **Charts** | Recharts | 2.12.0 |
| **Routing** | React Router DOM | 6.26.0 |
| **HTTP Client** | Axios | 1.7.0 |
| **Backend** | Spring Boot | 3.1.5 |
| **Language** | Java | 17 |
| **Security** | Spring Security + JWT | jjwt 0.12.3 |
| **Database** | PostgreSQL | 15+ |
| **ORM** | Hibernate / JPA | - |
| **Build Tool** | Maven | 3.x |
| **API Testing** | Postman | - |
| **Containerization** | Docker | - |

---

## 📂 Project Structure

```
team-task-manager/
│
├── backend/                          # Spring Boot Application
│   ├── pom.xml                       # Maven dependencies
│   ├── Dockerfile                    # Docker configuration
│   └── src/main/java/com/teamtask/manager/
│       ├── TeamTaskManagerApplication.java
│       ├── config/                   # Security, JWT, CORS config
│       ├── controller/               # REST API controllers
│       ├── dto/                      # Data Transfer Objects
│       ├── model/                    # JPA Entities & Enums
│       ├── repository/               # Spring Data JPA Repositories
│       ├── service/                  # Business logic
│       ├── exception/                # Custom exceptions & handlers
│       └── util/                     # Utility classes
│
├── frontend/                         # React Application
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── api/                      # API service layer
│       ├── context/                  # Auth context
│       ├── hooks/                    # Custom React hooks
│       ├── pages/                    # Page components
│       ├── components/               # Reusable components
│       └── utils/                    # Constants & helpers
│
├── postman/                          # Postman collection
├── docker-compose.yml                # PostgreSQL container
└── README.md
```

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Java 17** or higher ([Download](https://adoptium.net/))
- **Maven 3.x** ([Download](https://maven.apache.org/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **PostgreSQL 15+** ([Download](https://www.postgresql.org/))
- **Docker** (optional, for PostgreSQL container)
- **Postman** (optional, for API testing)

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd team-task-manager
```

### Step 2: Setup Database

**Option A: Using Docker (Recommended)**

```bash
docker compose up -d
```

This creates a PostgreSQL container with:
- Database: `team_task_manager`
- Username: `postgres`
- Password: `root`
- Port: `5432`

**Option B: Using Existing PostgreSQL**

```sql
CREATE DATABASE team_task_manager;
```

### Step 3: Configure Backend

Navigate to `backend/src/main/resources/application.properties` and update if needed:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/team_task_manager
spring.datasource.username=postgres
spring.datasource.password=root
```

### Step 4: Run Backend

```bash
cd backend
mvn clean package -DskipTests
mvn spring-boot:run
```

✅ Backend running at: **http://localhost:8080/api**

### Step 5: Run Frontend

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

### Step 6: Create Admin User

The **first user** to sign up automatically gets `ADMIN` role.  
Alternatively, update manually:

```sql
UPDATE users SET role = 'ADMIN' WHERE id = 1;
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌──────────┐       ┌─────────────────┐       ┌───────────┐
│  users   │       │ project_members │       │ projects  │
├──────────┤       ├─────────────────┤       ├───────────┤
│ id (PK)  │──1:M──│ user_id (FK)    │──M:1──│ id (PK)   │
│ name     │       │ project_id (FK) │       │ name      │
│ email    │       │ role            │       │ desc      │
│ password │       │ joined_at       │       │ creator   │
│ role     │       └─────────────────┘       │ created   │
└──────────┘                                 └─────┬─────┘
     │                                             │
     │                                             │ 1:M
     │                                             │
     └────────────────1:M──────────────────────────┘
                                                   │
                                              ┌────┴────┐
                                              │  tasks   │
                                              ├──────────┤
                                              │ id (PK)  │
                                              │ title    │
                                              │ status   │
                                              │ priority │
                                              │ due_date │
                                              │ project  │── FK
                                              │ assignee │── FK
                                              │ created  │── FK
                                              └──────────┘
```

### Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts with roles |
| `projects` | Project details |
| `project_members` | Many-to-many join with role |
| `tasks` | Task details with status, priority |

---

## 🌐 API Documentation

**Base URL:** `http://localhost:8080/api`

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | Public | Register new user |
| POST | `/auth/login` | Public | Login & get JWT |
| POST | `/auth/logout` | Auth | Logout |
| GET | `/auth/check` | Auth | Verify token |

### Project Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/projects` | Any | Create project |
| GET | `/projects` | Any | List user's projects |
| GET | `/projects/{id}` | Member | Get project details |
| PUT | `/projects/{id}` | Admin | Update project |
| DELETE | `/projects/{id}` | Admin | Delete project |
| POST | `/projects/{id}/members` | Admin | Add member |
| DELETE | `/projects/{id}/members/{mid}` | Admin | Remove member |

### Task Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/projects/{pid}/tasks` | Member | Create task |
| GET | `/projects/{pid}/tasks` | Member | List tasks |
| GET | `/projects/{pid}/tasks/{tid}` | Member | Get task |
| PUT | `/projects/{pid}/tasks/{tid}` | Member | Update task |
| PATCH | `/projects/{pid}/tasks/{tid}/status` | Assignee | Update status |
| DELETE | `/projects/{pid}/tasks/{tid}` | Admin | Delete task |

### Dashboard Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/project/{pid}` | Project statistics |
| GET | `/dashboard/me` | Personal statistics |

### Standard Error Response

```json
{
  "status": 400,
  "message": "Error description",
  "timestamp": "2024-01-01T12:00:00",
  "errors": {
    "field": "Validation message"
  }
}
```

---

## 👥 Role-Based Access

| Action | Admin | Member |
|--------|:-----:|:------:|
| Create project | ✅ | ✅ |
| Delete project | ✅ | ❌ |
| Add/remove members | ✅ | ❌ |
| Create task | ✅ | ✅ |
| Edit any task | ✅ | ❌ |
| Edit assigned task | ✅ | ✅ |
| Delete task | ✅ | ❌ |
| Update any status | ✅ | ❌ |
| Update assigned status | ✅ | ✅ |
| View all tasks | ✅ | ❌ |
| View assigned tasks | ✅ | ✅ |
| View dashboard | ✅ | ✅ |

---

## 📸 Screenshots

### Login Page
![Login](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Projects Grid
![Projects](screenshots/projects.png)

### Kanban Board
![Kanban](screenshots/kanban.png)

### Task Management
![Tasks](screenshots/tasks.png)

---

## 📮 Postman Collection

A complete Postman collection is included for API testing.

**Location:** `postman/Team_Task_Manager.postman_collection.json`

### Import Steps:
1. Open Postman
2. Click **Import**
3. Select the JSON file
4. Collection variables auto-configure (`baseUrl`, `token`, `projectId`, `taskId`)

### Test Flow:
1. **Signup** → Auto-saves token
2. **Create Project** → Auto-saves projectId
3. **Create Task** → Auto-saves taskId
4. **Update Status** → Test status transitions
5. **Get Dashboard** → Verify statistics

---

## 🚢 Deployment

### Backend (Railway)

1. Create a Railway account
2. Connect GitHub repository
3. Set environment variables:
   ```
   SPRING_DATASOURCE_URL=jdbc:postgresql://...
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=***
   JWT_SECRET=your-secret-key
   ```
4. Deploy with `spring.profiles.active=prod`

### Frontend (Vercel/Netlify)

1. Build: `npm run build`
2. Deploy the `dist/` folder
3. Set `VITE_API_BASE_URL` to production backend URL

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Port 5432 in use** | Stop existing PostgreSQL service |
| **Port 8080 in use** | Kill process: `netstat -ano \| findstr :8080` then `taskkill /PID <id> /F` |
| **403 Forbidden** | Check user role in database: `SELECT * FROM users;` |
| **401 Unauthorized** | Token expired - login again |
| **CORS errors** | Verify `vite.config.js` proxy is configured |
| **Database connection** | Check PostgreSQL is running: `docker ps` or `Get-Service postgresql*` |
| **npm install fails** | Delete `node_modules` and `package-lock.json`, then retry |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Recharts](https://recharts.org/)
- [PostgreSQL](https://www.postgresql.org/)

---

<div align="center">

**Built with ❤️ by Navnish Rajput**

⭐ Star this repo if you found it helpful!

</div>
```

---
