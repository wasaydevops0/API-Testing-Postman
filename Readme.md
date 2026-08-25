# User Management API - Tester Guide

Welcome to the User Management API! This document provides all the necessary details for QA engineers, frontend developers, and API testers to interact with the endpoints using Postman or any HTTP client.

## Base URL
Local Development: `http://localhost:8000/api/v1/users`
Production (Vercel): `https://<your-vercel-domain>/api/v1/users`

---

## 🔐 Authentication
Most routes in this API are **secured** and require the user to be logged in. 
When you successfully log in, the server returns an `accessToken` and a `refreshToken` inside HTTP-only cookies. 

**For Postman Testers:** 
Postman automatically saves these cookies and sends them with subsequent requests. You do not need to manually set headers for secured routes if cookies are enabled!

---

## 🌍 Public Routes (No Auth Required)

### 1. Register User
Registers a new user in the database.
- **Method:** `POST`
- **Endpoint:** `/register`
- **Content-Type:** `application/json`
- **Body Data:**
  ```json
  {
    "fullname": "John Doe",      // String, required
    "email": "john@example.com", // String, required, must be unique
    "username": "johndoe",       // String, required, must be unique
    "password": "secretpassword" // String, required
  }
  ```

### 2. Login User
Authenticates a user and sets session cookies.
- **Method:** `POST`
- **Endpoint:** `/login`
- **Content-Type:** `application/json`
- **Body Data:** You can log in using EITHER an `email` OR a `username`.
  ```json
  {
    "email": "john@example.com", // String, required if username is empty
    "username": "johndoe",       // String, required if email is empty
    "password": "secretpassword" // String, required
  }
  ```

### 3. Refresh Token
Generates a new access token if the current one expires.
- **Method:** `POST`
- **Endpoint:** `/refresh-token`
- **Content-Type:** `application/json`
- **Body Data:** (Optional if testing via cookies)
  ```json
  {
    "refreshToken": "your_refresh_token_here" // String, optional if cookies are active
  }
  ```

---

## 🔒 Secured Routes (Auth Required)
*You must hit the `/login` endpoint successfully before testing these routes.*

### 4. Get Current User
Retrieves the logged-in user's profile data.
- **Method:** `GET`
- **Endpoint:** `/current-user`
- **Body:** None

### 5. Change Password
Updates the logged-in user's password.
- **Method:** `POST`
- **Endpoint:** `/change-password`
- **Content-Type:** `application/json`
- **Body Data:**
  ```json
  {
    "oldPassword": "secretpassword", // String, required
    "newPassword": "newpassword123"  // String, required
  }
  ```

### 6. Update Account (Partial Update)
Updates specific details of the user's account.
- **Method:** `PATCH`
- **Endpoint:** `/update-account`
- **Content-Type:** `application/json`
- **Body Data:**
  ```json
  {
    "fullname": "John Updated", // String, required
    "email": "new@example.com"  // String, required
  }
  ```

### 7. Replace Account (Full Update)
Completely replaces the user's core modifiable data.
- **Method:** `PUT`
- **Endpoint:** `/replace-account`
- **Content-Type:** `application/json`
- **Body Data:**
  ```json
  {
    "fullname": "John Completely New", // String, required
    "email": "brandnew@example.com",   // String, required
    "username": "brandnewjohndoe"      // String, required
  }
  ```

### 8. Logout User
Logs the user out by clearing the authentication cookies from the browser/client.
- **Method:** `POST`
- **Endpoint:** `/logout`
- **Body:** None

### 9. Delete Account
Permanently deletes the logged-in user from the database and logs them out.
- **Method:** `DELETE`
- **Endpoint:** `/delete-account`
- **Body:** None

---

## ⚠️ Common Status Codes & Errors
- `200 OK`: Request was successful.
- `201 Created`: User successfully registered.
- `400 Bad Request`: Missing required fields (e.g., missing email during registration).
- `401 Unauthorized`: Invalid password, or missing/expired JWT token.
- `404 Not Found`: Route doesn't exist, or user record not found in DB.
- `409 Conflict`: Username or Email already exists in the database.
- `500 Internal Server Error`: Server-side crash or database connection issue.