# ThinkSpace 🧠

> **Your AI-powered thinking workspace.**

ThinkSpace is a premium, full-stack note-taking application built with the MERN stack. It leverages generative AI to automatically summarize notes, extract key themes, and auto-generate tags, allowing you to focus on your thoughts rather than organization.

Featuring a luxurious **Obsidian & Amber** glassmorphic aesthetic, ThinkSpace combines elegant micro-interactions with robust backend engineering.

## ✨ Features

- **🤖 AI-Powered Organization**: Integrates `@google/generative-ai` to automatically generate titles, summaries, and tags for your written content.
- **🔐 Secure Authentication**: Robust JWT-based authentication with `HTTP-only` cookies, ensuring secure session management.
- **🛡️ Rate Limiting & Protection**: Implements Upstash Redis for API rate-limiting, preventing abuse of the AI generation endpoints.
- **💎 Premium UI/UX**: Custom-designed using Tailwind CSS with deep zinc palettes, vibrant amber accents, dynamic hover states, and backdrop-blurred glassmorphic layers.
- **⚡ Blazing Fast**: Powered by Vite and React 19 on the frontend, with a lightweight Express + MongoDB backend.
- **🔍 Smart Search**: Instantly filter your thoughts by title, content, or AI-generated tags.

## 🛠️ Tech Stack

**Frontend**
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (Auth & User State)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

**Backend**
- **Runtime Environment**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **AI Integration**: Google Generative AI (Gemini)
- **Security & APIs**: JSON Web Tokens (JWT), bcrypt, cookie-parser
- **Rate Limiting**: [Upstash Redis](https://upstash.com/)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (local or MongoDB Atlas)
- Google Generative AI API Key
- Upstash Redis Connection (REST URL & Token)

### 2. Clone the Repository
```bash
git clone https://github.com/yourusername/ThinkSpace.git
cd ThinkSpace
```

### 3. Install Dependencies
You'll need to install dependencies for both the frontend and backend.

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Environment Variables
Create a `.env` file in the `backend` directory and configure the following variables:

```env
# Server
PORT=5001
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# AI & Rate Limiting
GEMINI_API_KEY=your_google_generative_ai_key
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

### 5. Run the Application
Open two terminal windows to run the frontend and backend simultaneously.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser to start writing!

---

## 🏗️ Project Structure
```text
ThinkSpace/
├── backend/
│   ├── src/
│   │   ├── config/      # DB Connection Logic
│   │   ├── controllers/ # Route Logic (User, Notes, AI)
│   │   ├── middleware/  # Auth & Rate Limiting
│   │   ├── models/      # Mongoose Schemas (User, Note)
│   │   ├── routes/      # Express Router endpoints
│   │   └── server.js    # Entry Point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI Blocks (Navbar, NoteCard)
    │   ├── lib/         # Utility functions (Axios config)
    │   ├── pages/       # Application Views (Home, Create, Auth)
    │   ├── store/       # Zustand Global State
    │   ├── App.jsx      # Routing Configuration
    │   └── index.css    # Premium Tailwind Settings
    └── package.json
```


