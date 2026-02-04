# Deployment Guide - Vercel

This guide will walk you through deploying the frontend to Vercel.

## Prerequisites

1. A GitHub account (or GitLab/Bitbucket)
2. Your code pushed to a Git repository
3. A Vercel account (free tier works fine)
4. Your backend API URL (if deployed separately)

## Step-by-Step Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended for Beginners)

#### Step 1: Push Your Code to GitHub

1. If you haven't already, initialize a git repository in your project root:
```bash
cd todoappassisment
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub (don't initialize with README)

3. Push your code:
```bash
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

#### Step 2: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (or create an account)

2. Click **"Add New..."** → **"Project"**

3. Import your GitHub repository:
   - Select your repository from the list
   - Click **"Import"**

#### Step 3: Configure Project Settings

1. **Framework Preset**: Vercel should auto-detect "Vite"
   - If not, select "Vite" manually

2. **Root Directory**: 
   - Set to `frontend` (since your frontend is in a subdirectory)
   - Click **"Edit"** next to Root Directory
   - Enter `frontend`

3. **Build Command**: Should be `npm run build` (auto-detected)

4. **Output Directory**: Should be `dist` (auto-detected)

5. **Install Command**: Should be `npm install` (auto-detected)

#### Step 4: Set Environment Variables

1. Click **"Environment Variables"** section

2. Add your backend API URL:
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend API URL (e.g., `https://your-backend.herokuapp.com/api` or `https://your-backend.railway.app/api`)
   - **Environment**: Select all (Production, Preview, Development)

3. Click **"Save"**

#### Step 5: Deploy

1. Click **"Deploy"** button

2. Wait for the build to complete (usually 1-3 minutes)

3. Once deployed, you'll get a URL like: `https://your-project.vercel.app`

4. Test your application!

### Option 2: Deploy via Vercel CLI

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Navigate to Frontend Directory

```bash
cd frontend
```

#### Step 4: Deploy

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No** (for first deployment)
- Project name? (Enter a name or press Enter for default)
- Directory? **./** (current directory)
- Override settings? **No**

#### Step 5: Set Environment Variables

```bash
vercel env add VITE_API_URL
```

Enter your backend API URL when prompted.

#### Step 6: Redeploy with Environment Variables

```bash
vercel --prod
```

## Important Configuration Notes

### React Router Configuration

The `vercel.json` file includes a rewrite rule to handle client-side routing. This ensures that all routes (like `/login`, `/register`) work correctly when users navigate directly or refresh the page.

### Environment Variables

Make sure to set `VITE_API_URL` in Vercel with your actual backend API URL. For example:
- If backend is on Heroku: `https://your-app.herokuapp.com/api`
- If backend is on Railway: `https://your-app.railway.app/api`
- If backend is on Render: `https://your-app.onrender.com/api`
- If backend is on your own server: `https://api.yourdomain.com/api`

### CORS Configuration

Make sure your backend has CORS configured to allow requests from your Vercel domain. In your backend `app.js`, you should have:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173', // Local development
    'https://your-project.vercel.app' // Your Vercel URL
  ]
}));
```

Or for production, you can allow all origins (less secure but simpler):

```javascript
app.use(cors());
```

## Troubleshooting

### Build Fails

1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Make sure Node.js version is compatible (Vercel uses Node 18.x by default)

### 404 Errors on Routes

1. Ensure `vercel.json` is in the `frontend` directory
2. Check that the rewrite rule is correct
3. Redeploy after making changes

### API Calls Fail

1. Verify `VITE_API_URL` environment variable is set correctly
2. Check CORS settings on your backend
3. Ensure backend is deployed and accessible
4. Check browser console for specific error messages

### Environment Variables Not Working

1. Make sure variable names start with `VITE_` (required for Vite)
2. Redeploy after adding environment variables
3. Check that variables are set for the correct environment (Production/Preview/Development)

## Updating Your Deployment

### Automatic Deployments

Vercel automatically deploys when you push to your main branch. Each push creates a new deployment.

### Manual Deployment

```bash
cd frontend
vercel --prod
```

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

## Preview Deployments

Every pull request automatically gets a preview deployment URL, perfect for testing before merging!

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- Check Vercel build logs for specific errors

