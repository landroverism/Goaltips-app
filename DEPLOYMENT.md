# Goaltips App Deployment Guide

This guide will help you deploy your Goaltips application for free using Netlify for the frontend and Railway for the backend.

## 1. Frontend Deployment (Netlify)

### Prerequisites
- GitHub account
- Netlify account (free tier)

### Steps

1. **Push your code to GitHub**
   ```bash
   cd /home/landroverism/Goaltips-app
   git add .
   git commit -m "Prepare for deployment"
   git push
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "New site from Git"
   - Select your GitHub repository
   - Configure the build settings:
     - Base directory: `Client`
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

3. **Configure Environment Variables**
   - Once deployed, go to Site settings > Environment variables
   - Add the following variables:
     - `VITE_SUPABASE_URL`: `https://bycpkknwhcylkkmetgji.supabase.co`
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
     - `VITE_API_URL`: Leave blank for now (we'll update after backend deployment)

4. **Set Up Custom Domain (Optional)**
   - Go to Domain settings
   - Click "Add custom domain"
   - Follow the instructions to set up your domain

## 2. Backend Deployment (Railway)

### Prerequisites
- Railway account (free tier)
- GitHub account

### Steps

1. **Deploy to Railway**
   - Go to [Railway](https://railway.app/)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your GitHub repository
   - Configure the deployment:
     - Root directory: `Server`
     - Start command: `npm start`

2. **Configure Environment Variables**
   - Once deployed, go to the Variables tab
   - Add the following variables:
     - `PORT`: `5000`
     - `CLIENT_URL`: Your Netlify URL (e.g., `https://your-app.netlify.app`)
     - `JWT_SECRET`: Your JWT secret
     - `SUPABASE_URL`: `https://bycpkknwhcylkkmetgji.supabase.co`
     - `SUPABASE_ANON_KEY`: Your Supabase anon key
     - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

3. **Get Your API URL**
   - Go to the Settings tab
   - Copy the "Generated domain" URL

## 3. Connect Frontend to Backend

1. **Update Frontend Environment Variable**
   - Go back to Netlify
   - Update the `VITE_API_URL` environment variable with your Railway API URL
   - Trigger a new deployment

## Alternative Free Deployment Options

If Railway's free tier doesn't work for you, here are other options:

### Backend Alternatives
1. **Fly.io (Free tier)**
   - Offers a generous free tier
   - Requires Dockerfile or buildpacks

2. **Render (Free tier for individual services)**
   - Deploy individual services instead of using Blueprint
   - Free for web services with limitations

3. **Vercel (Free tier)**
   - Can deploy both frontend and backend
   - Limited to serverless functions for backend

### Frontend Alternatives
1. **Vercel (Free tier)**
   - Great for React applications
   - Easy GitHub integration

2. **GitHub Pages (Free)**
   - Free static site hosting
   - Requires configuration for SPAs

## Troubleshooting

- **CORS Issues**: If you encounter CORS errors, double-check the CORS configuration in `server.js`
- **Connection Issues**: Ensure environment variables are correctly set on both frontend and backend
- **Build Failures**: Check the build logs for errors and fix any issues in your code

## Notes

- Free tiers have limitations (like sleep after inactivity)
- For production use, consider paid options for better reliability
- Keep your Supabase credentials secure and never commit them to public repositories
