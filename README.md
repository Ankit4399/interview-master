# 🚀 Interview Master – AI-Powered Interview Preparation Platform

## 🌟 Overview

**Interview Master** is a full-stack AI-powered web application that helps users prepare for job interviews by generating personalized interview reports and resumes. It leverages Generative AI to analyze resumes and job descriptions, identify skill gaps, and provide actionable preparation plans.

---

## 🧠 Key Features

* 🔐 **Authentication System**

  * Secure login/signup using JWT & HTTP-only cookies & Token blacklisting

* 📄 **Resume Parsing**

  * Upload PDF resumes and extract content automatically

* 🤖 **AI-Powered Interview Reports**

  * Generate:

    * Match Score
    * Technical Questions with answers
    * Behavioral Questions
    * Skill Gap Analysis
    * Day-wise Preparation Plan

* 📥 **AI Resume Generation + PDF Download**

  * Generate ATS-friendly resumes
  * Download as PDF using Puppeteer

* 📊 **Dashboard**

  * View all generated interview reports
  * Access individual reports

---

## 🛠️ Tech Stack

### Frontend

* React.js (Vite)
* Axios
* Context API

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### AI Integration

* Google Gemini API

### Other Tools

* Puppeteer (PDF generation)
* Multer (file upload)
* pdf-parse (resume parsing)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Ankit4399/interview-master.git
cd interview-master
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GOOGLE_GEMINI_API_KEY=your_api_key
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Deployment

* **Frontend** → Vercel
* **Backend** → Render

### Important Notes:

* Configure CORS properly
* Use `responseType: 'blob'` for PDF downloads
* Use `puppeteer-core + chromium` for cloud deployment

---

## 🧠 Challenges Faced & Solutions

| Problem                        | Solution                                      |
| ------------------------------ | --------------------------------------------- |
| Puppeteer not working on cloud | Used `puppeteer-core` + `@sparticuz/chromium` |
| CORS issues with PDF download  | Configured headers & credentials              |
| Blob handling error            | Used Axios `responseType: "blob"`             |
| Cold start delay (Render)      | Handled with retry/loading                    |

---

## 👨‍💻 Author

**Ankit Kumar**

* GitHub: https://github.com/Ankit4399
* LinkedIn: https://www.linkedin.com/in/ankit-yadav-0a1a89287

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---
