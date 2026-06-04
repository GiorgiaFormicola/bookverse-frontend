# 📚 BookVerse — Frontend

> _Where every story finds its shelf._

BookVerse is a full-stack web application for book lovers. Discover new books, build your personal library, track your reading progress, and share reviews with other readers.

This repository contains the **frontend** of the application, built with React + Vite.

🌐 **Live Demo:** [bv-bookverse.vercel.app](https://bv-bookverse.vercel.app)

🔗 **Backend repository:** [bookverse-backend](https://github.com/GiorgiaFormicola/bookverse-backend)

---

## ✨ Features

- 🔍 **Search & Discover** — Search books by title, author, category or publisher via Google Books API, with automatic fallback to the local database if the API is unavailable
- 📖 **Personal Library** — Save books and track your reading status (To Read, Reading, Read)
- ⭐ **Reviews** — Rate and review books, read other readers' opinions
- 📊 **Dashboard** — View your reading stats at a glance
- 🔒 **Authentication** — Register, login, reset password via email
- 👤 **Profile** — Customize your profile, bio and profile picture
- 🛡️ **Admin Panel** — Manage users and books (admin only)

---

## 🛠️ Tech Stack

| Technology       | Description         |
| ---------------- | ------------------- |
| React            | UI library          |
| Vite             | Build tool          |
| Redux            | State management    |
| React Bootstrap  | UI components       |
| Axios            | HTTP client         |
| React Router DOM | Client-side routing |
| Lucide React     | Icons               |
| SCSS             | Custom styling      |

---

## 🚀 Getting Started

### Try it live

You can try the app at [bv-bookverse.vercel.app](https://bv-bookverse.vercel.app) without any local setup.

### Run locally

#### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- The [backend](https://github.com/GiorgiaFormicola/bookverse-backend) running locally

#### Installation

1. **Clone the repository**

```bash
git clone https://github.com/GiorgiaFormicola/bookverse-frontend.git
cd bookverse-frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create a `.env` file** in the root of the project

```env
VITE_API_URL=http://localhost:<YOUR_BACKEND_PORT>
```

> ⚠️ Make sure the backend is running before starting the frontend.

4. **Start the development server**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
src/
├── components/       # React components
├── config/           # Axios instance and interceptors
├── redux/            # Redux store, actions and reducers
├── styles/           # SCSS variables and custom styles
└── App.jsx           # Main app with routing
```

---

## 🔐 Environment Variables

| Variable       | Description                 |
| -------------- | --------------------------- |
| `VITE_API_URL` | Base URL of the backend API |

---

## 👩‍💻 Author

**Giorgia Formicola**

- GitHub: [@GiorgiaFormicola](https://github.com/GiorgiaFormicola)
