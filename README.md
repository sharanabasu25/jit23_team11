# 🚀 Smart Public Grievance Management System (SPGMS)

An AI-powered web application that enables citizens to report public grievances, allows government officers to efficiently manage complaints, and uses Artificial Intelligence to automatically classify issues for faster resolution.

---

# 📌 Project Overview

The **Smart Public Grievance Management System (SPGMS)** is designed to bridge the communication gap between citizens and government authorities. Citizens can submit complaints with images and location details, while government officers can monitor, analyze, and resolve grievances through an interactive dashboard. AI assists by automatically detecting and classifying complaint categories, reducing manual effort and improving response time.

---

# ✨ Key Features

### 👨‍💼 Citizen Portal
- Citizen Registration & Login
- Submit Complaints with Images
- Track Complaint Status
- View Complaint History
- User Profile Management

### 🏛 Government Officer Portal
- Secure Officer Login
- Interactive Dashboard
- Complaint Management
- Search & Filter Complaints
- Complaint Status Updates
- Officer Remarks
- Reports Dashboard
- CSV Report Export
- Complaint Analytics
- Live Dashboard Widgets
- Category-wise Statistics
- Officer Performance Metrics
- Activity Timeline
- Notifications
- Editable Officer Profile

### 🤖 AI Module
- AI-based Complaint Classification
- Image Analysis using YOLOv8
- Gemini API Integration
- Automatic Department Prediction
- FastAPI-based AI Service

---

# 🛠 Tech Stack

## Frontend
- React.js
- React Router DOM
- JavaScript (ES6+)
- HTML5
- CSS3
- Vite
- Chart.js
- React Chart.js 2

## Backend
- Node.js
- Express.js
- REST APIs

## Database
- MongoDB

## Artificial Intelligence
- Python
- FastAPI
- YOLOv8
- Gemini API

---

# 📂 Project Structure

```
Smart Public Grievance Management System
│
├── client/              # React Frontend
├── ai-service/          # AI Service (FastAPI)
├── backend/             # Node.js + Express APIs
├── public/
├── src/
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/your-repository.git
```

## Frontend

```bash
cd client
npm install
npm run dev
```

## Backend

```bash
cd backend
npm install
npm start
```

## AI Service

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload
```

---

# 📊 System Workflow

1. Citizen registers and logs into the system.
2. Citizen submits a complaint with an image and description.
3. AI module analyzes the complaint image.
4. Complaint is categorized and assigned to the appropriate department.
5. Government Officer reviews the complaint.
6. Officer updates the complaint status and adds remarks.
7. Citizen tracks complaint progress until resolution.

---

# 👥 Team Members

| Team Member | Module |
|-------------|--------|
| **Sharanabasu** | Citizen Portal (React.js) |
| **Shobha Ramesh** | Government Officer Dashboard (React.js) |
| **Sagar Mavinagidad** | Backend & MongoDB (Node.js + Express.js) |
| **Shreyas Kulkarni** | AI Module (YOLOv8, Gemini API, FastAPI) |

---

# 👩‍💻 Contribution Details

## 🔹 Sharanabasu
- Developed the complete Citizen Portal
- Citizen Authentication
- Complaint Registration
- Complaint Tracking
- Citizen Dashboard
- User Profile

---

## 🔹 Shobha Ramesh
Developed the complete Government Officer Module including:

- Officer Authentication
- Officer Dashboard
- Complaint Management
- Complaint Details
- Search & Filters
- Complaint Status Updates
- Officer Remarks
- Reports Dashboard
- CSV Export
- Complaint Analytics
- Notifications
- Editable Officer Profile
- Live Clock
- Category Statistics
- Progress Indicators
- Officer Performance Dashboard
- Activity Timeline

---

## 🔹 Sagar Mavinagidad
- Backend API Development
- Express.js Server
- MongoDB Integration
- REST APIs
- Authentication APIs
- Database Design

---

## 🔹 Shreyas Kulkarni
- YOLOv8 Integration
- Gemini API Integration
- AI Complaint Classification
- FastAPI Development
- Image Processing
- AI Prediction Services

---

# 📈 Future Enhancements

- Mobile Application
- SMS & Email Notifications
- GPS-based Complaint Tracking
- Real-time Complaint Assignment
- Advanced AI Analytics
- Admin Dashboard
- Multi-language Support

---

# 📄 License

This project was developed as an academic project for educational purposes.
