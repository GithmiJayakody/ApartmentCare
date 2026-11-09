# 🏢 ApartmentCare – Apartment Maintenance Management System

**ApartmentCare** is a web-based apartment maintenance management system designed to simplify and streamline maintenance operations within apartment complexes. It provides a centralized platform where residents can report maintenance issues, technicians can manage and resolve assigned tasks, and managers can monitor and coordinate maintenance activities.

The system aims to improve communication, reduce manual work, and ensure efficient maintenance management.

## 🚀 Key Features

### 👤 Resident
- Submit maintenance requests.
- View submitted maintenance requests.
- Track maintenance request status.
- View updates on reported issues.

### 🔧 Technician
- View assigned maintenance requests.
- Manage assigned maintenance tasks.
- Update maintenance request status.
- Provide maintenance progress updates.

### 🏢 Manager
- Manage residents and technicians.
- View and monitor maintenance requests.
- Assign maintenance tasks to technicians.
- Track overall maintenance activities.

## 🛠️ Technology Stack

### Frontend
- React.js
- TypeScript
- Tailwind CSS
- Nginx

### Backend
- Node.js
- Express.js
- JavaScript

### Database
- MongoDB

### DevOps & Deployment
- Docker
- Docker Compose
- Git & GitHub

## 🏗️ System Architecture

ApartmentCare follows a client-server architecture consisting of a frontend, backend API, and database.

```text
             Users
               |
               v
       React Frontend
          (Nginx)
               |
               v
       Node.js Backend
         (Express.js)
               |
               v
           MongoDB
```

The application components are containerized using Docker and managed through Docker Compose.

## 📁 Project Structure

```text
ApartmentCare/
│
├── Backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env
│   └── ...
│
├── Frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── ...
│
├── docker-compose.yml
│
└── README.md
```

## ⚙️ Prerequisites

Before running the project, make sure you have installed:

- Git
- Node.js and npm
- Docker Desktop
- Docker Compose

## 📥 Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Githmijayakody/ApartmentCare.git
```

Navigate to the project directory:

```bash
cd ApartmentCare
```

### 2. Configure Environment Variables

Create a `.env` file inside the `Backend` directory.

Example:

```env
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/ApartmentCare
JWT_SECRET=your_jwt_secret
```

**Note:** Replace the example JWT secret with a secure secret. Never commit actual credentials or `.env` files to GitHub.

### 3. Install Dependencies (Without Docker)

If you want to run the frontend and backend separately:

**Backend:**

```bash
cd Backend
npm install
npm run dev
```

**Frontend:**

Open another terminal:

```bash
cd Frontend
npm install
npm run dev
```

### 4. Run Using Docker Compose

To build and start the containerized application, run the following command from the project root directory:

```bash
docker compose up --build
```

To run the containers in detached mode:

```bash
docker compose up --build -d
```

To check running containers:

```bash
docker compose ps
```

To view container logs:

```bash
docker compose logs -f
```

To stop the containers:

```bash
docker compose down
```

**Note:** The local MongoDB service must be configured in `docker-compose.yml` with a persistent volume. The backend should connect to it using the Docker service hostname `mongodb`.

## 🌐 Application Access

After successfully starting the containers:

| Component | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| MongoDB | mongodb://localhost:27017 |

## 🐳 Dockerization

The project uses Docker to package the frontend and backend into separate containers.

Docker Compose is used to coordinate the application services.

Benefits include:

- Consistent development and deployment environments.
- Simplified application setup.
- Easier deployment across different machines.
- Containerized application services.
- Persistent database storage using Docker volumes.

## 👥 User Roles

ApartmentCare supports three main user roles:

1. **Resident** – Reports and tracks apartment maintenance issues.
2. **Technician** – Handles assigned maintenance requests.
3. **Manager** – Coordinates maintenance operations and manages users.

## 🎯 Project Objectives

- Digitize apartment maintenance management.
- Improve communication between residents, technicians, and managers.
- Reduce manual maintenance coordination.
- Provide real-time visibility into maintenance request progress.
- Demonstrate containerization and application deployment using Docker.

## 👨‍💻 Development Team

Developed as part of the **EC5205 – DevOps Engineering / Network Programming project**.

**Project:** ApartmentCare – Apartment Maintenance Management System

**Institution:** Faculty of Engineering, University of Ruhuna, Sri Lanka.

---

⭐ If you find this project useful, feel free to explore the repository!