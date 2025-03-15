# Round-Robin Coupon Distribution with Admin Panel

## Overview

This project implements a live web application that allows users to claim coupons in a round-robin manner while providing an admin panel to manage the coupons and prevent abuse. The user side allows for coupon claims, while the admin side enables secure management of coupons and user activity monitoring.

## Features

### User Side

- **Round-Robin Coupon Distribution:** Coupons are assigned to users sequentially without repetition.
- **Guest User Access:** Users can claim coupons without logging in.
- **Abuse Prevention:**
  - **IP Tracking:** Users can claim only one coupon per day from the same IP.
  - **Cookie-Based Tracking:** Users can only claim a coupon once per browser session.
- **User Feedback:** Clear messages display for successful claims or time restrictions.

### Admin Panel

- **Admin Login:** Secure authentication for admin access.
- **View Coupons:** Display all available and claimed coupons.
- **Add/Update Coupons:** Admin can add new coupons or modify existing ones.
- **User Claim History:** Track which IP/browser session claimed coupons.
- **Toggle Coupon Availability:** Admin can enable/disable specific coupons dynamically.

### Deployment

- Live application hosted and accessible via a publicly available URL.
  
## Technologies Used

- **Frontend:** React.js
- **Backend:** Node.js with Express
- **Database:** MongoDB
- **Authentication:** JWT for admin login
- **Abuse Prevention:** IP & cookie-based tracking

## Installation

### Prerequisites

- Node.js
- MongoDB (local or cloud database)

### Setting up the project

1. Clone the repository:

   ```bash
   git clone <repository_url>
   ```

2. Install dependencies for the backend and frontend:

   **Backend:**

   ```bash
   npm install
   ```

   **Frontend:**

   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the backend directory and add your database URI:

     ```plaintext
     DB_URI=********************************
     ```

4. Run the project:

   ```bash
   npm run dev
   ```

   The backend server should be running on `http://localhost:5000` and the frontend on `http://localhost:5173` (or configured ports).

## Usage

### User Flow

1. Open the application in a browser.
2. Claim a coupon from the available ones. You can only claim once per IP address per 24 hours and per browser session.

### Admin Flow

1. Log in to the admin panel using your credentials.
2. View and manage coupons, add new coupons, update existing ones, or toggle their availability.
3. Monitor the user claim history and prevent abuse.

### Accessing Admin Panel

- Visit the admin login page and provide your username and password.
  
### Example Admin Credentials

- **Username:** admin
- **Password:** 123456

## Deployment

- The live application is hosted at: [Live URL](https://<your-live-url>)
  
## Additional Notes

- This project focuses on preventing abuse by tracking users via IP and browser session cookies.
- The code is structured for easy scalability and maintenance, with clear separation between frontend and backend logic.

---

This `README.md` gives a clear overview of your project and provides detailed instructions for both the setup and usage of your application.
