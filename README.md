# 🚨 CivicFix — Smart Public Issue Reporting Platform

> **Report. Track. Resolve.**
> CivicFix is a smart civic issue reporting platform that helps citizens report public infrastructure problems and enables authorities to manage, track, and resolve complaints efficiently.

---

## 📌 Overview

**CivicFix** is a full-stack web application designed to bridge the gap between citizens and local authorities.

Citizens can report issues such as:

* 🕳️ Potholes
* 💡 Broken streetlights
* 🗑️ Garbage overflow
* 💧 Water leakage
* 🛣️ Damaged roads
* 🚧 Open or damaged drains
* 🏗️ Other public infrastructure issues

Users can submit an issue along with a **description, image, and location**. The system stores the complaint and allows authorities/clerks to review, manage, update, and resolve reported issues.

The platform aims to make civic complaint management more **transparent, organized, and efficient**.

---

## ✨ Key Features

### 👤 Citizen Features

* 🔐 Secure user authentication
* 📝 Report civic issues
* 📸 Upload issue images
* 📍 Provide issue location
* 📋 View submitted complaints
* 🔎 Track complaint status
* 🔔 Get updates on issue progress
* 📊 View complaint history

### 🧑‍💼 Clerk / Authority Features

* 🔐 Secure clerk authentication
* 📊 Authority dashboard
* 📋 View reported complaints
* 🔍 Filter and search complaints
* 🔄 Update complaint status
* 👨‍💼 Manage assigned issues
* ✅ Mark issues as resolved
* 📈 Monitor complaint statistics

### 🤖 AI-Powered Features

CivicFix can integrate AI to assist with civic issue classification.

The AI service can analyze uploaded images and help identify categories such as:

* Pothole
* Garbage
* Damaged road
* Broken streetlight
* Water leakage
* Open drain

This reduces manual categorization and can help authorities prioritize and process complaints faster.

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      Citizen        │
                    │                     │
                    │ Report Civic Issue  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     React Frontend  │
                    │                     │
                    │ UI + Authentication│
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Node.js /        │
                    │    Express Backend  │
                    │                     │
                    │ REST APIs + Logic   │
                    └───────┬─────┬───────┘
                            │     │
                ┌───────────┘     └────────────┐
                ▼                              ▼
       ┌─────────────────┐            ┌─────────────────┐
       │    MongoDB      │            │   AI Service    │
       │                 │            │                 │
       │ Users           │            │ Image Analysis  │
       │ Complaints      │            │ Classification   │
       │ Status          │            │                 │
       └─────────────────┘            └─────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Responsive UI

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB
* Mongoose

### Authentication

* Clerk Authentication

### AI

* Python-based AI service
* Image classification
* AI-assisted civic issue detection

### Deployment

* Vercel — Frontend
* Backend/API hosting
* MongoDB Atlas — Database
* AI service hosting

---

## 📂 Project Structure

```text
CivicFix/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── ai-service/
│   ├── model/
│   ├── app.py
│   └── requirements.txt
│
├── README.md
└── .gitignore
```

> Project structure may vary depending on the final implementation.

---

## 🔄 How CivicFix Works

### 1. User Registration

A citizen creates an account using the authentication system.

### 2. Report an Issue

The citizen submits:

* Issue category
* Description
* Image
* Location

### 3. AI Analysis

The uploaded image can be processed by the AI service to assist in identifying the type of civic issue.

### 4. Complaint Storage

The complaint and its relevant information are stored in MongoDB.

### 5. Authority Review

The clerk/authority logs into the dashboard and reviews reported complaints.

### 6. Status Updates

The complaint can move through different stages:

```text
Reported
   ↓
Under Review
   ↓
Assigned
   ↓
In Progress
   ↓
Resolved
```

### 7. Resolution

Once the civic problem is addressed, the authority marks the complaint as **Resolved**.

---

## 🔐 Authentication & Authorization

CivicFix uses role-based access to separate citizen and clerk functionality.

### Citizen

Citizens can:

* Create complaints
* View their complaints
* Track complaint status

### Clerk

Clerks can:

* View complaints
* Manage complaints
* Update statuses
* Resolve reported issues

This ensures that administrative functionality is not accessible to regular users.

---

## 🗄️ Database Design

### User

```text
User
├── userId
├── name
├── email
├── role
└── createdAt
```

### Complaint

```text
Complaint
├── complaintId
├── userId
├── category
├── description
├── image
├── location
├── status
├── assignedTo
├── createdAt
└── updatedAt
```

---

## 📊 Complaint Status

| Status          | Description                          |
| --------------- | ------------------------------------ |
| 🟡 Reported     | Issue has been submitted             |
| 🔵 Under Review | Authority is reviewing the complaint |
| 🟣 Assigned     | Complaint has been assigned          |
| 🟠 In Progress  | Work has started                     |
| 🟢 Resolved     | Issue has been fixed                 |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB / MongoDB Atlas
* Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/simrankaur2006/Beyond_Addiction.git
```

```bash
cd CivicFix
```

---

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

---

### 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

---

### 4. Configure Environment Variables

Create a `.env` file in the backend directory.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string

CLERK_SECRET_KEY=your_clerk_secret_key

AI_SERVICE_URL=your_ai_service_url
```

Add the required frontend environment variables as well.

**Do not commit `.env` files or API keys to GitHub.**

---

### 5. Run the Backend

```bash
cd server
npm run dev
```

---

### 6. Run the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The application will then be available at the local development URL shown by Vite.

---

## 🤖 AI Service

CivicFix includes an AI service that can be used for automated civic issue classification.

The workflow is:

```text
User Uploads Image
        ↓
Frontend
        ↓
Backend
        ↓
AI Service
        ↓
Image Classification
        ↓
Detected Issue Category
        ↓
Complaint Record
```

The AI component helps reduce the need for users or authorities to manually classify every uploaded image.

---


## 🎯 Project Objectives

The main objectives of CivicFix are:

1. Provide citizens with an easy way to report civic problems.
2. Digitize the traditional complaint-reporting process.
3. Improve communication between citizens and authorities.
4. Enable authorities to efficiently manage complaints.
5. Provide transparent complaint status tracking.
6. Use AI to assist in automatic issue classification.
7. Improve the overall efficiency of civic issue resolution.

---

## 🔮 Future Scope

CivicFix can be further enhanced with:

* 🗺️ Interactive complaint map
* 📍 GPS-based automatic location detection
* 🤖 Advanced AI image classification
* 🔔 Real-time notifications
* 📱 Mobile application
* 📊 Advanced analytics dashboard
* 🏆 Citizen reward/gamification system
* 🚨 Automatic priority detection
* 🧑‍💼 Department-wise complaint assignment
* 📈 Civic issue heatmaps
* 💬 Citizen-authority communication

---

## 👥 Team

**Project:** CivicFix — Smart Public Issue Reporting Platform



---

## 📄 License

This project is developed for educational and academic purposes.

