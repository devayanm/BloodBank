# 🌐 Cloud-Based Blood and Organ Donation System

A cloud-hosted, full-stack MERN application to modernize and streamline blood/organ donation in India. This system digitizes donor processes, event discovery, real-time data sharing, and provides medical institutions with powerful tools and analytics – all in a sleek, user-friendly interface inspired by top modern apps.

---

## 🗂️ Table of Contents

- [✨ Abstract](#-abstract)
- [🚀 Features](#-features)
- [🖼️ UI Snapshots](#-ui-snapshots)
- [⚙️ Architecture Overview](#️-architecture-overview)
- [🧩 Module Descriptions](#-module-descriptions)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚦 Getting Started](#-getting-started)
- [🔐 Environment Variables](#-environment-variables)
- [📁 Folder Structure](#-folder-structure)
- [🔮 Future Enhancements](#-future-enhancements)
- [📝 License](#-license)
- [💬 Contact](#-contact)

---

## ✨ Abstract

India continues to grapple with critical shortages in blood and organ donations, largely due to outdated, fragmented, or region-limited systems. Our Cloud-Based Blood and Organ Donation System unifies these workflows into a modern platform, centralizing crucial donor/hospital/camp data, real-time updates, and educational resources. The result: a more efficient, transparent, and motivating donation ecosystem.

---

## 🚀 Features

- **Dual-Tabbed UI:** Effortlessly switch between Blood & Organ donation interfaces.
- **Location-aware Search:** Find local hospitals/camps on an interactive map (powered by [React-Leaflet](https://react-leaflet.js.org/)).
- **Real-time Notifications:** Stay updated on events, reminders, and registration status (with react-toastify).
- **Gamified Leaderboard:** Top donors recognized for their lifesaving frequency and impact.
- **Admin Dashboard:** Tools for hospitals/NGOs: verify donors, manage stocks/waitlists, promote events, view analytics.
- **Educational Hub:** Reliable info and FAQs about donation eligibility, legal, and ethical guidelines.
- **Modern Responsive UI:** Designed after leading food/gig apps for a seamless experience on any device.

---

## 🖼️ UI Snapshots

*Will be added soon!*

---

## ⚙️️ Architecture Overview

**MERN Stack (MongoDB, Express.js, React.js, Node.js)**

```
+-------------------+      +-------------------+      +-------------------+
|   Client (User)   | |   Backend (API)   | |    MongoDB Atlas   |
|  React (Vite)     |      | Node.js/Express   |      |   Cloud Database   |
+-------------------+      +-------------------+      +-------------------+
      |    |             /           |            \
      |    |            /            |             \
      v    v        Admin Panel    VPS Deployment   Map APIs, Emails, etc.
Vue/React UI          NextJS        (NGINX+PM2)
```

**Deployment:**  
- Hosted on VPS ([DigitalOcean](https://digitalocean.com) or similar), with NGINX (reverse proxy), PM2 (process manager).
- MongoDB Atlas for managed cloud database.
- Modular RESTful API for clean separation of concerns.

---

## 🧩 Module Descriptions

### 🩸 Blood Donation
- Find camps/hospitals on map (location-aware)
- Register/deregister as a donor
- Get reminders for eligible donation dates

### 🫁 Organ Donation
- Educational content (FAQ, eligibility, medical/legal info)
- Pledge/consent, with database tracking of pledges

### 🛡️ Admin Dashboard
- Donor/hospital verification, blood/organ stock and waitlist management
- Promotion of donation drives, advanced engagement analytics

### 🏆 Leaderboard & Gamification
- Track top donors/participants by frequency and recency

### 🔔 Notification System
- Real-time toast notifications for critical actions/events

### 🗺️ Map Integration
- Real-time display of camps/hospitals; filter by need, type, location

---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), CSS Modules, React-Bootstrap, react-leaflet, react-toastify
- **Admin Panel**: (if separate) React or Next.js
- **Backend**: Node.js, Express.js, JWT Auth, Nodemailer
- **Database**: MongoDB Atlas (cloud)
- **Deployment**: DigitalOcean VPS, NGINX, PM2

---

## 🚦 Getting Started

### 1️⃣ Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [MongoDB Atlas Account](https://mongodb.com/atlas)
- (Opt.) VPS with NGINX for production deployment

### 2️⃣ Local Setup

#### i. Clone Repository

```
git clone https://github.com/yourusername/cloud-blood-organ-donation.git
cd cloud-blood-organ-donation
```

#### ii. Install Dependencies

```
# Frontend
cd client
npm install

# Backend
cd ../backend
npm install

# Admin Panel 
cd ../admin-panel
npm install
```

#### iii. Configure Environment Variables

Create a `.env` file **ONLY** in the `/backend` directory with the following:

```
MONGO_URI=your-mongodb-connection-string
CLIENT_URL=http://localhost:5173,http://localhost:3000
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
```
> ⚠️ **Only backend needs `.env`!**  
> Do not create `.env` in `client` or `admin-panel`.

#### iv. Start Development Servers

```
# Backend API Server
cd backend
npm run dev

# Frontend Client
cd ../client
npm run dev

# Admin Panel 
cd ../admin-panel
npm run dev
```

#### v. Access the Applications

- **User App:** [http://localhost:5173](http://localhost:5173)
- **Admin Panel:** [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

`.env` file for **backend** only (`/backend/.env`):

```
MONGO_URI=
CLIENT_URL=http://localhost:5173,http://localhost:3000
JWT_SECRET=
JWT_REFRESH_SECRET=
EMAIL_USER=
EMAIL_PASS=
```
- `MONGO_URI`: Your MongoDB Atlas connection string
- `CLIENT_URL`: Allowed origins for CORS (frontend & admin)
- `JWT_SECRET` / `JWT_REFRESH_SECRET`: Secure secrets for authentication
- `EMAIL_USER`, `EMAIL_PASS`: Email account/app-password for sending notifications

---

## 📁 Folder Structure

```
cloud-blood-organ-donation/
├── client/         # React/Vite frontend
├── backend/        # Express/Node backend (with .env here)
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── .env
├── admin-panel/    # Admin interface [React]
└── README.md
```

---

## 🔮 Future Enhancements

- 🤖 **AI-powered donor-recipient matching**
- 📱 **Dedicated mobile app (Flutter/React Native)**
- 🌐 **Integration with government & hospital APIs**
- 📊 **Deep analytics and reporting**
- 🗣️ **Multi-language and accessibility features**

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

## 💬 Contact

**Author:** [Your Name]  
**GitHub:** [github.com/yourusername](https://github.com/yourusername)  
**Email:** your.email@example.com

---

> *Together, we make life-saving donations accessible, transparent, and rewarding for everyone.*
