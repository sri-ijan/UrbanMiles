# UrbanMiles

UrbanMiles is a full-stack car rental platform where users can browse cars, check date availability, and create bookings, while owners can list vehicles and manage booking requests.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Troubleshooting](#troubleshooting)

## Overview

The project is split into two applications:

- **client/**: React + Vite frontend for users and owners
- **server/**: Express + MongoDB backend for auth, cars, bookings, and owner actions

## Key Features

### User

- Register and login with JWT-based authentication
- Browse available cars and filter by location/date availability
- View car details and create booking requests
- Manage personal bookings and cancel bookings

### Owner

- Upgrade account role to owner
- Add and manage car listings (with image upload)
- Toggle car availability and remove listings
- Manage incoming booking requests
- Access dashboard summary stats (cars, bookings, revenue)

### System

- Overlap-safe availability check for date ranges
- Booking status flow (`pending` → `confirmed` / `cancelled`)
- Email notifications for booking create/confirm/cancel events
- Image optimization and hosting through ImageKit

## Tech Stack

### Frontend

- React 19
- Vite 5
- React Router
- Axios
- Tailwind CSS 4
- Motion (animations)
- React Hot Toast

### Backend

- Node.js + Express 5
- MongoDB + Mongoose
- JWT authentication
- Multer (file uploads)
- ImageKit (image storage/optimization)
- Nodemailer (email notifications)

## Project Structure

```text
UrbanMiles/
├── client/                 # Frontend (React + Vite)
│   └── src/
│       ├── components/
│       ├── context/
│       └── pages/
└── server/                 # Backend (Express + MongoDB)
	├── config/
	├── controller/
	├── middleware/
	├── models/
	├── routes/
	└── utils/
```

## How It Works

1. User/owner authenticates and receives JWT token.
2. Frontend stores token in `localStorage` and sends it in `Authorization` header.
3. Users browse cars and check availability for selected dates.
4. Booking request is created with computed total price (`days × pricePerDay`).
5. Owner confirms/cancels requests; notifications are sent via email.

## Local Setup

### Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB connection string
- ImageKit account credentials
- Gmail SMTP credentials (or equivalent app password)

### 1) Clone and install dependencies

From the project root:

```bash
# frontend
cd client
npm install

# backend
cd ../server
npm install
```

### 2) Configure environment files

- Create `server/.env` and `client/.env`
- Add variables from the [Environment Variables](#environment-variables) section

### 3) Run backend

From `server/`:

```bash
npx nodemon server.js
```

### 4) Run frontend

From `client/`:

```bash
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Environment Variables

### Backend (`server/.env`)

```env
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
MONGODB_URI=
JWT_SECRET=
MAIL_ID=
MAIL_PASSWORD=
TEST_USER_EMAIL=
PORT=3000
```

### Frontend (`client/.env`)

```env
VITE_CURRENCY=$
VITE_BASE_URL=http://localhost:3000
```

## API Overview

Base URL: `http://localhost:3000`

### User Routes (`/api/user`)

- `POST /register`
- `POST /login`
- `GET /data` (protected)
- `GET /cars`

### Owner Routes (`/api/owner`)

- `POST /change-role` (protected)
- `POST /add-car` (protected, multipart with `image` + `carData`)
- `GET /cars` (protected)
- `POST /toggle-car` (protected)
- `POST /delete-car` (protected)
- `GET /dashboard` (protected)
- `POST /update-image` (protected, multipart with `image`)

### Booking Routes (`/api/bookings`)

- `POST /check-availability`
- `POST /check-if-available` (protected)
- `POST /create` (protected)
- `GET /user` (protected)
- `GET /owner` (protected)
- `POST /change-status` (protected)
- `POST /cancel` (protected)

## Troubleshooting

- If backend does not start with `npm run dev`, check `server/package.json` script name (currently points to `sever.js`). Use `npx nodemon server.js` directly.
- Ensure `VITE_BASE_URL` matches backend URL and port.
- For email delivery, use valid Gmail app password in `MAIL_PASSWORD`.
- If uploads fail, verify all ImageKit keys and endpoint values.

