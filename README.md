# HRMS Lite

## Live Deployments

- **Frontend:** [https://hrms-lite-frontent-4qqptogqt-summi51s-projects.vercel.app/](https://hrms-lite-frontend-seven-dusky.vercel.app/)
- **Backend API:** [https://hrms-lite-backend-eight.vercel.app/](https://hrms-lite-backend-eight.vercel.app)

A lightweight Human Resource Management System (HRMS) with separate backend (Node.js/Express/MongoDB) and frontend (React/Vite/MUI) applications.

---

## Project Structure

```
hrms-lite/
│
├── hrms-lite-backend/   # Node.js/Express backend API
│   ├── model/           # Mongoose models (User, Employee, Attendance)
│   ├── routes/          # Express route handlers
│   ├── middleware/      # Auth middleware
│   ├── db.js            # MongoDB connection
│   ├── index.js         # App entry point
│   └── .env             # Environment variables (not committed)
│
├── hrms-lite-frontend/  # React frontend (Vite, MUI)
│   ├── src/
│   │   ├── pages/       # Main pages (Login, Register, Dashboard, Employees, Attendance)
│   │   ├── components/  # Shared UI components
│   │   ├── context/     # Auth context
│   │   └── api/         # API utilities
│   └── public/          # Static assets
└── README.md            # Project overview (this file)
```

---

## Features
- User authentication (JWT)
- Employee management (CRUD)
- Attendance tracking
- Dashboard overview
- Protected routes (frontend)

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)

### 1. Backend Setup
```bash
cd hrms-lite-backend
npm install
# Create a .env file with your MongoDB URI and JWT secret:
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret
npm run dev
```

### 2. Frontend Setup
```bash
cd hrms-lite-frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` (default Vite port).

---

## Usage
- Register a new user or login.
- Add/manage employees.
- Mark and view attendance.
- View dashboard stats.

---

## Tech Stack
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- **Frontend:** React, Vite, Material UI, Axios, React Router

---

## Development Scripts

### Backend
- `npm run dev` — Start backend with nodemon
- `npm start` — Start backend normally

### Frontend
- `npm run dev` — Start frontend dev server
- `npm run build` — Build frontend for production

---

## Screen Shorts

### Register/Login

<img width="2860" height="1532" alt="image" src="https://github.com/user-attachments/assets/78b19441-1c91-49c9-ae84-f36e63b22f01" />
<img width="2880" height="1562" alt="image" src="https://github.com/user-attachments/assets/f4dd0c92-34e4-4fab-a5d7-e8c99c3569cd" />

### Dashboard

<img width="2880" height="1494" alt="image" src="https://github.com/user-attachments/assets/265d3f8c-e4f9-4804-bf89-b660360d81bd" />

### Employee/Attendance Mark

<img width="2880" height="1542" alt="image" src="https://github.com/user-attachments/assets/f528f095-1edc-4fa6-8e30-a2d5b10f83dc" />
<img width="2880" height="1570" alt="image" src="https://github.com/user-attachments/assets/ab017dd4-246c-4530-b63e-710a43a14424" />

