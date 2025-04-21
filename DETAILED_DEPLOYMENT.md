# Detailed Deployment Guide for Goaltips App

This guide provides step-by-step instructions for deploying your Goaltips application using free services.

## Part 1: Deploy Backend to Railway

Railway offers a generous free tier that works well for Node.js applications.

### Step 1: Prepare Your Repository

1. Make sure your changes are committed to GitHub:
   ```bash
   cd /home/landroverism/Goaltips-app
   git add .
   git commit -m "Prepare for deployment"
   git push
   ```

### Step 2: Sign Up for Railway

1. Go to [Railway](https://railway.app/)
2. Sign up with your GitHub account
3. Verify your email if required

### Step 3: Create a New Project

1. Click on "New Project" button
2. Select "Deploy from GitHub repo"
3. Choose your Goaltips repository
4. When prompted for the service to deploy, select "Deploy specific service"
5. Choose "Custom Service"

### Step 4: Configure the Backend Service

1. In the configuration screen:
   - Set the Root Directory to `/Server`
   - Railway will automatically detect your Dockerfile
   - Click "Deploy"

2. Once deployed, go to the "Variables" tab and add these environment variables:
   ```
   PORT=5000
   JWT_SECRET=r6ZXU5W5lhRR22F2XqnPlnG9YIUWUG0crzCU4tN/P5PoLDxJYmdsLdBGfXnvdpW+I2Q6KCIpe1ugYVtGk2AY/g==
   SUPABASE_URL=https://bycpkknwhcylkkmetgji.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5Y3Bra253aGN5bGtrbWV0Z2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNTE3NDUsImV4cCI6MjA2MDcyNzc0NX0.hhvoa2j_EowvjCqcHgIF5IyTOy6GyiIAT6AIc1vlbjY
   SUPABASE_SERVICE_ROLE_KEY=[Your service role key]
   ```
   (Note: Replace [Your service role key] with your actual Supabase service role key)

   Leave `CLIENT_URL` blank for now - we'll add it after deploying the frontend.

### Step 5: Get Your Backend URL

1. Go to the "Settings" tab
2. Look for "Domains" section
3. Copy the generated domain URL (it will look like `https://goaltips-app-production.up.railway.app`)
4. Save this URL - you'll need it for the frontend deployment

## Part 2: Deploy Frontend to Netlify

Netlify offers an excellent free tier for static sites like your React frontend.

### Step 1: Sign Up for Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Sign up with your GitHub account
3. Verify your email if required

### Step 2: Create a New Site

1. Click "New site from Git" button
2. Choose GitHub as your Git provider
3. Select your Goaltips repository
4. Configure the build settings:
   - Base directory: `Client`
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

### Step 3: Configure Environment Variables

1. Once deployed, go to Site settings > Environment variables
2. Add the following variables:
   ```
   VITE_SUPABASE_URL=https://bycpkknwhcylkkmetgji.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5Y3Bra253aGN5bGtrbWV0Z2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNTE3NDUsImV4cCI6MjA2MDcyNzc0NX0.hhvoa2j_EowvjCqcHgIF5IyTOy6GyiIAT6AIc1vlbjY
   VITE_API_URL=[Your Railway Backend URL]
   ```
   (Replace [Your Railway Backend URL] with the URL you copied in Part 1, Step 5)

4. Go to Deploys > Trigger deploy > Deploy site to apply the environment variables

### Step 4: Update Backend with Frontend URL

1. Go back to Railway
2. In your backend service, go to the "Variables" tab
3. Add or update the `CLIENT_URL` variable with your Netlify URL (e.g., `https://goaltips-app.netlify.app`)
4. Railway will automatically redeploy your backend with the new variable

## Part 3: Test Your Deployed Application

1. Open your Netlify URL in a browser
2. Try to:
   - Register a new user
   - Log in with existing credentials
   - Access the admin dashboard with your admin credentials
   - Make predictions

## Troubleshooting

### CORS Issues
If you encounter CORS errors:
1. Double-check that the `CLIENT_URL` in your backend environment variables exactly matches your Netlify URL
2. Verify that the CORS configuration in `server.js` includes your Netlify domain
3. Make sure your frontend is using the correct API URL

### Authentication Issues
If authentication doesn't work:
1. Check browser console for errors
2. Verify that Supabase credentials are correct in both frontend and backend
3. Test the API endpoints directly using a tool like Postman

### Deployment Failures
If deployment fails:
1. Check the deployment logs for specific errors
2. For Railway: Make sure your Dockerfile is correct and the build script exists
3. For Netlify: Ensure the build command and publish directory are correct

## Maintaining Your Deployment

### Updating Your Application
1. Make changes to your local code
2. Commit and push to GitHub
3. Both Railway and Netlify will automatically redeploy your application

### Monitoring
1. Railway provides logs and metrics for your backend
2. Netlify offers deploy previews and build logs
3. Use browser developer tools to debug frontend issues

### Custom Domains (Optional)
Both Railway and Netlify allow you to set up custom domains on their free tiers:
1. Purchase a domain from a provider like Namecheap or GoDaddy
2. Follow the instructions in Railway and Netlify to set up your custom domain
3. Update the `CLIENT_URL` in Railway and any hardcoded URLs in your code
