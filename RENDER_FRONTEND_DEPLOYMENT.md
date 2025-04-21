# Deploying Goaltips Frontend to Render

This guide will walk you through deploying your Goaltips frontend to Render's free tier.

## Step 1: Prepare Your Frontend for Deployment

First, let's create a simple build script for your frontend:

1. Make sure your Client's package.json has a build script. It should look something like:
   ```json
   "scripts": {
     "dev": "vite",
     "build": "vite build",
     "preview": "vite preview"
   }
   ```

2. Create a file named `_redirects` in your Client/public directory:
   ```bash
   cd /home/landroverism/Goaltips-app/Client
   mkdir -p public
   touch public/_redirects
   ```

3. Add the following line to the `_redirects` file:
   ```
   /* /index.html 200
   ```
   This ensures that all routes in your single-page application work correctly.

4. Commit these changes to your repository:
   ```bash
   cd /home/landroverism/Goaltips-app
   git add .
   git commit -m "Prepare frontend for deployment"
   git push
   ```

## Step 2: Create a New Static Site on Render

1. From your Render dashboard, click the "New +" button
2. Select "Static Site"
3. Connect your GitHub repository if you haven't already
4. Find and select your Goaltips repository

## Step 3: Configure the Static Site

1. In the configuration screen, set the following:
   - **Name**: `goaltips-frontend` (or any name you prefer)
   - **Root Directory**: `Client` (important: this tells Render to only deploy the Client directory)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist` (this is where Vite outputs the built files)

2. Scroll down to the "Advanced" section and click to expand it

3. Add the following environment variables:
   ```
   VITE_SUPABASE_URL=https://bycpkknwhcylkkmetgji.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5Y3Bra253aGN5bGtrbWV0Z2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNTE3NDUsImV4cCI6MjA2MDcyNzc0NX0.hhvoa2j_EowvjCqcHgIF5IyTOy6GyiIAT6AIc1vlbjY
   VITE_API_URL=https://goaltips-backend.onrender.com
   ```
   
   > **Important**: Replace `https://goaltips-backend.onrender.com` with the actual URL of your backend that you deployed in the previous guide.

4. Click "Create Static Site"

## Step 4: Monitor the Deployment

1. Render will now build and deploy your frontend
2. You can monitor the build process in the "Events" tab
3. Wait for the deployment to complete (this may take a few minutes)

## Step 5: Update Backend with Frontend URL

1. Go back to your backend service in Render
2. Go to the "Environment" tab
3. Add or update the `CLIENT_URL` variable with your frontend URL (e.g., `https://goaltips-frontend.onrender.com`)
4. Click "Save Changes"
5. Render will automatically redeploy your backend with the new environment variable

## Step 6: Test Your Application

1. Visit your frontend URL in a browser
2. Try to:
   - Register a new user
   - Log in with existing credentials
   - Access the admin dashboard with your admin credentials
   - Make predictions

## Troubleshooting

### Build Failures

If your frontend build fails, check the logs in the "Events" tab for specific errors. Common issues include:

1. **Missing dependencies**: Make sure all required dependencies are in your package.json
2. **Build script errors**: Check that your build script is correctly defined
3. **Environment variable issues**: Ensure environment variables are properly set and used in your code

### Frontend Not Connecting to Backend

If your frontend builds but can't connect to your backend:

1. Check that the `VITE_API_URL` is correctly set to your backend URL
2. Verify that CORS is properly configured in your backend
3. Check browser console for any network errors

### Routing Issues

If some routes in your application don't work:

1. Make sure the `_redirects` file is in the `public` directory
2. Check that it contains the line `/* /index.html 200`
3. Rebuild and redeploy your frontend

## Free Tier Limitations

Render's free tier for static sites is quite generous:

1. Unlimited static sites
2. 100 GB bandwidth per month
3. Continuous deployment from GitHub

## Completing Your Deployment

After successfully deploying both your backend and frontend, your Goaltips application should be fully functional on Render's free tier. Here's a summary of what you've accomplished:

1. Deployed your Node.js backend as a Web Service
2. Deployed your React frontend as a Static Site
3. Connected the frontend and backend
4. Set up environment variables for Supabase integration

Your application is now accessible to users worldwide through your Render URLs!
