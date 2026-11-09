# ApartmentCare – Apartment Maintenance Management System

ApartmentCare is a web-based apartment maintenance management system designed to simplify maintenance operations and improve communication between apartment residents, technicians, and management.

The application provides a centralized platform where residents can submit maintenance requests, technicians can manage assigned tasks, and managers can oversee apartment maintenance activities.

The application UI currently uses **Livora** as its branding name.

## Features

### 1. Resident Features
- User Registration and Login
- Submit Maintenance Requests
- View Submitted Maintenance Requests
- Track Maintenance Request Status
- Communicate maintenance-related information

### 2. Technician Features
- Technician Login
- View Assigned Maintenance Tasks
- Manage Assigned Tasks
- Update Maintenance Progress
- Track Task Status

### 3. Manager Features
- Manager Login
- Manage Residents
- Assign Technicians to Maintenance Requests
- Monitor Maintenance Activities
- Oversee Maintenance Operations

### 4. System Features
- Role-Based User Access
- Secure User Authentication
- Frontend and Backend Integration
- RESTful API Communication
- MongoDB Database Integration


## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React |
| Backend | Node.js |
| Backend Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JSON Web Token (JWT) |
| Containerization | Docker |
| Container Orchestration | Docker Compose |
| Web Server | Nginx |
| Version Control | Git and GitHub |

## Project Structure

```text
ApartmentCare/
│
├── Backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── tests/
│   ├── .dockerignore
│   ├── .gitignore
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── Frontend/
│   ├── public/
│   ├── src/
│   ├── tests/
│   ├── .dockerignore
│   ├── .gitignore
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   ├── package-lock.json
│   ├── playwright.config.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
├── docker-compose.yml
├── .gitignore
├── INTEGRATION_REPORT.md
└── README.md
```

## System Architecture

ApartmentCare follows a containerized architecture consisting of three main services.

### Frontend
Provides the user interface for residents, technicians, and managers. The frontend application is served using Nginx.

### Backend
Handles application logic, authentication, maintenance request processing, and API communication using Node.js and Express.js.

### Database
MongoDB stores user information, maintenance requests, and other application-related data.

### Docker Architecture

The three services communicate through a dedicated Docker network managed by Docker Compose.

```text
             Users
               |
               v
          Frontend
           (Nginx)
               |
               v
           Backend
        (Node.js / Express)
               |
               v
           MongoDB
           Database
```

## Installation and Setup

### Prerequisites

Make sure the following tools are installed:

- Git
- Docker Desktop (Windows) or Docker Engine (Linux)
- Docker Compose

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd ApartmentCare
```

### 2. Configure Environment Variables

Create a `.env` file inside the `Backend` directory.

```env
PORT=5000
JWT_SECRET=your_secure_random_secret
MONGO_URI=mongodb://mongodb:27017/ApartmentCare
```

Replace the JWT secret with a strong, randomly generated secret.

### 3. Build Docker Images

Run the following command from the project root directory:

```bash
docker compose build
```

### 4. Start the Application

```bash
docker compose up -d
```

This starts all three services:

- Frontend
- Backend
- MongoDB

### 5. Verify Running Containers

```bash
docker compose ps
```

All three containers should show a running status.

### 6. Access the Application

Open the following URL in your browser:

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

### 7. Stop the Application

```bash
docker compose down
```

**Note:** MongoDB data is stored in a Docker named volume and remains available when containers are stopped using `docker compose down`.


## Project Objectives

- Simplify apartment maintenance request management.
- Improve communication between residents, technicians, and managers.
- Provide an organized maintenance task management process.
- Centralize apartment maintenance information.
- Apply DevOps practices through Docker containerization and service orchestration.
- Support consistent application deployment across different environments.


---

*Developed as a DevOps Engineering project.*