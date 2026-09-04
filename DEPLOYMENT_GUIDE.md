# 🚀 Production Deployment Guide

This guide walks you through deploying the **Backend to Render**, **Frontend to Netlify**, and connecting both to your **MongoDB Atlas** database.

---

## 📋 Architecture Overview

- **Frontend**: Netlify (React + Vite SPA)
- **Backend**: Render Web Service (`https://ankitchaudhary.onrender.com`)
- **Database**: MongoDB Atlas (`chaudharyconnect`)

---

## 🗄️ Step 1: MongoDB Atlas Configuration

Because cloud backends like Render use dynamic IP addresses, you must allow connections from any IP in MongoDB Atlas:

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. In the left navigation, click **Network Access** (under *Security*).
3. Click **Add IP Address**.
4. Click **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Click **Confirm**.
6. In **Database Access**, make sure your database user (e.g., `ccuser`) has `Read and write to any database` permissions.

Your connection string format:
```
mongodb+srv://<username>:<password>@ankitchaudhary.yez7lpw.mongodb.net/chaudharyconnect?retryWrites=true&w=majority&appName=ankitchaudhary
```

---

## 🖥️ Step 2: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** > **Web Service**.
2. Connect your GitHub / GitLab repository.
3. Configure the service settings:
   - **Name**: `ankitchaudhary` *(Matches `https://ankitchaudhary.onrender.com`)*
   - **Region**: Choose the closest region (e.g., Singapore / Oregon / Frankfurt).
   - **Branch**: `main` (or your active deployment branch)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`

4. Add the following **Environment Variables** in the Render settings:

| Key | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Production mode |
| `SERVER_URL` | `https://ankitchaudhary.onrender.com` | Backend URL for image uploads |
| `MONGODB_URI` | `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority` | Your Atlas connection string |
| `FRONTEND_URL` | `https://your-site-name.netlify.app` *(or your custom domain)* | Allowed frontend CORS origins |
| `EMAIL_FROM` | `fate4nkit@gmail.com` | Sender email address |
| `EMAIL_FROM_NAME` | `Chaudhary & Sons` | Sender display name |
| `BREVO_API_KEY` | `<your_brevo_api_key>` | Email API key |

5. Click **Create Web Service** / **Deploy Web Service**.
6. Once deployed, open `https://ankitchaudhary.onrender.com/health` in your browser. You should see:
   ```json
   { "status": "ok", "service": "Chaudhary & Sons API", ... }
   ```

---

## 🌐 Step 3: Deploy Frontend to Netlify

1. Log in to [Netlify](https://app.netlify.com/).
2. Click **Add new site** > **Import an existing project** > Select your Git provider (GitHub / GitLab).
3. Select your repository.
4. Set the build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist` (or `dist` if base directory is set to `client`)
5. Under **Environment variables**, click **Add a variable**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://ankitchaudhary.onrender.com`
6. Click **Deploy Site**.

> **Note on Routing:** The included `_redirects` and `netlify.toml` files handle React Router single-page navigation automatically so direct URLs (like `/portfolio`, `/articles`, `/admin`) reload without 404 errors.

---

## 🔄 Step 4: Link Frontend & Backend CORS

1. Once your Netlify site is live, copy its URL (e.g. `https://ankitchaudhary.netlify.app` or your custom domain).
2. Go back to **Render Dashboard** > your `ankitchaudhary` Web Service > **Environment**.
3. Update `FRONTEND_URL` with your exact Netlify URL:
   ```
   FRONTEND_URL=https://ankitchaudhary.netlify.app
   ```
   *(You can also provide multiple comma-separated URLs like `https://ankitchaudhary.netlify.app,http://localhost:5173`)*
4. Save and allow Render to trigger a quick redeploy.

---

## ✅ Step 5: Verification Checklist

- [ ] **Health Endpoint**: Visit `https://ankitchaudhary.onrender.com/health` to confirm the backend is up.
- [ ] **Database Connection**: Check Render logs to verify `✅ Connected to MongoDB Atlas`.
- [ ] **Articles API**: Visit `https://ankitchaudhary.onrender.com/api/articles` to verify JSON payload response.
- [ ] **Frontend Pages**: Open the Netlify URL, browse different routes, and refresh the page to confirm SPA routing works.
- [ ] **Authentication & Forms**: Test Login/Signup OTP and Enquiry forms from the Netlify site.
- [ ] **Image Uploads**: Post a new article with an image to verify images are uploaded and served via HTTPS.
