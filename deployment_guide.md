# Hosting `2gether` on Render (Free Tier)

I just prepared your code for production! I added universal `build` commands to the `package.json` configurations so the site correctly compiles the Vite frontend and serves it using the Socket-Express backend all on a single unified URL!

Here is the exact step-by-step process to host your site online for free:

## 1. Push to GitHub First
Before Render can host it, you need to upload this code to a public or private GitHub repository.

Open your local terminal and run:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin master
```

## 2. Deploy on Render
1. Go to [Render.com](https://render.com/) and sign in with GitHub.
2. Click **New +** at the top right and select **Web Service**.
3. Select the GitHub repository you just uploaded.
4. Fill in the following specific deployment configurations:

| Field | Configuration Value |
| :--- | :--- |
| **Name** | `2gether-programming` |
| **Root Directory** | `standalone-2gether` |
| **Environment** | `Node` |
| **Build Command** | `npm run install:all && npm run build` |
| **Start Command** | `npm start` |

## 3. Hit Deploy!
Run the deployment. Render will automatically install both client and server packages, transpile your React code, compile the TypeScript node.js WebSocket server, and deploy it onto a public `.onrender.com` URL!

> [!TIP]
> **Share your URL!**
> Because we decoupled the `AccountSettings` logic to store locally in the browser, your `/login` identity block will automatically transition perfectly to the new hosted URL. Friends can hit the link, assign an avatar alias on the landing page, and seamlessly jump into the room!
