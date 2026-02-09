# Ankit Chaudhary – Knowledge Hub: Project Documentation

This document provides a comprehensive overview of the website's architecture, file-wise features, and setup instructions.

## 🚀 Quick Start
To run the entire application (Frontend + Backend) simultaneously:
1. Open a terminal in the project root.
2. Run `npm install` (first time only).
3. Run `npm run dev:all`.

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite), React Router, Lucide React (Icons).
- **Backend**: Node.js, Express, Multer (File Uploads), Mongoose.
- **Storage**: **MongoDB Atlas** (Cloud-managed database).
- **Styling**: Vanilla CSS with a focus on Glassmorphism and Responsive Design.

---

## 📂 File-wise Feature Mapping

### 🖥️ Backend (Root)
| File | Features & Responsibility |
| :--- | :--- |
| `server.js` | **The Core Backend**: Connected to MongoDB Atlas. Handles API routes for authentication, Article CRUD, and image uploads. |
| `.env` | Stores sensitive environment variables like `MONGODB_URI` and `PORT`. |
| `package.json` | Defines project dependencies (including `mongoose` and `dotenv`). |

### 🗄️ Database Models (`models/`)
| File | Features & Responsibility |
| :--- | :--- |
| `User.js` | Mongoose schema for Admin and End-Users (supports Email, Username, and Phone). |
| `Article.js` | Mongoose schema for Articles (supports Title, Date, Category, and Markdown content). |

### 🎨 Frontend Components (`src/components/`)
| File | Features & Responsibility |
| :--- | :--- |
| `Logo.jsx` | **Branding**: Stylized "अंKiT" logo using the Teko font and a custom SVG emblem. |
| `Navbar.jsx` | **Navigation**: Sticky top navigation with conditional links (Manage, Post, Login). |
| `Footer.jsx` | **Premium Footer**: Three-column glassmorphism layout with social links. |

### 📄 Frontend Pages (`src/pages/`)
| File | Features & Responsibility |
| :--- | :--- |
| `Home.jsx` | **Portfolio**: Hero section with bio and a direct link to `UPDATED_Resume.pdf`. |
| `Articles.jsx` | **Reading Hub**: Displays all approved articles with real-time search. |
| `Post.jsx` | **Writing Suite**: Markdown editor with **Direct Image Upload** and **Custom Category** support. |
| `Admin.jsx` | **Manage Dashboard**: Interface for admins to approve/manage articles. |
| `EditArticle.jsx` | **Content Management**: Advanced article editing suite. |

---

## 📦 Directory Structure
- `uploads/images/`: Local storage for article images.
- `uploads/CV/`: Local storage for the professional resume.
- `src/index.css`: Global styles, variables, and typography (Outfit & Teko).

---

## 📝 Usage Notes
- **Database Management**: Data is now persistent in MongoDB Atlas. Even if the server restarts or local files are deleted, your articles and users are safe.
- **Image URLs**: Images are served from the backend's `uploads` folder but the link is saved in the database.
- **Adding Categories**: Select "Others..." in the dropdown to create a custom category name.

