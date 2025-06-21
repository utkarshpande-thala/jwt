# 🔐 User Authentication System (React Native + Node.js)

This project implements a full **user authentication system** with both **frontend** (React Native) and **backend** (Node.js + MongoDB). It includes **signup** and **login** functionality using JWT tokens.

---

## 📱 Features

- Signup screen (register new users)
- Login screen (authenticate users)
- Form validation and error handling
- Token-based authentication using JWT
- Secure password hashing with bcrypt
- MongoDB database for storing users
- Fully functional backend API
- Frontend made with React Native (Expo)

---

## 🛠️ Tech Stack

### 🔹 Frontend:
- React Native (Expo CLI)
- JavaScript
- Axios
- AsyncStorage (to store JWT)

### 🔹 Backend:
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT (jsonwebtoken)
- bcrypt.js

---

## 🔌 API Endpoints

- `POST /api/register` → User registration  
- `POST /api/login` → User login  
- `GET /api/profile` → Protected route (example)

---

## ▶️ How to Run

### 🟦 Frontend

```bash
cd auth-app-frontend
npm install
npx expo start
cd auth-app-backend
npm install
npm start
