# Deploying Goaltips Backend to Render

This guide will walk you through deploying your Goaltips backend to Render's free tier.

## Step 1: Prepare Your Repository

1. Make sure your changes are committed to GitHub:
   ```bash
   cd /home/landroverism/Goaltips-app
   git add .
   git commit -m "Prepare for deployment"
   git push
   ```

## Step 2: Sign Up for Render

1. Go to [Render](https://render.com/)
2. Sign up with your GitHub account
3. Verify your email if required

## Step 3: Create a New Web Service

1. From your Render dashboard, click the "New +" button
2. Select "Web Service"
3. Connect your GitHub repository (you may need to configure Render's access to your repositories)
4. Find and select your Goaltips repository

## Step 4: Configure the Web Service

1. In the configuration screen, set the following:
   - **Name**: `goaltips-backend` (or any name you prefer)
   - **Root Directory**: `/Server` (important: this tells Render to only deploy the Server directory)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

2. Scroll down to the "Advanced" section and click to expand it

3. Add the following environment variables:
   ```
   PORT=10000
   JWT_SECRET=r6ZXU5W5lhRR22F2XqnPlnG9YIUWUG0crzCU4tN/P5PoLDxJYmdsLdBGfXnvdpW+I2Q6KCIpe1ugYVtGk2AY/g==
   SUPABASE_URL=https://bycpkknwhcylkkmetgji.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5Y3Bra253aGN5bGtrbWV0Z2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNTE3NDUsImV4cCI6MjA2MDcyNzc0NX0.hhvoa2j_EowvjCqcHgIF5IyTOy6GyiIAT6AIc1vlbjY
   SUPABASE_SERVICE_ROLE_KEY=[Your service role key]
   ```
   
   > **Important**: Replace `[Your service role key]` with your actual Supabase service role key. The `PORT` is set to 10000 because Render assigns a port via the `PORT` environment variable at runtime.

4. Leave `CLIENT_URL` blank for now - we'll add it after deploying the frontend.

5. Click "Create Web Service"

## Step 5: Monitor the Deployment

1. Render will now build and deploy your backend
2. You can monitor the build process in the "Events" tab
3. Wait for the deployment to complete (this may take a few minutes)

## Step 6: Get Your Backend URL

1. Once deployed, Render will assign a URL to your service (e.g., `https://goaltips-backend.onrender.com`)
2. Save this URL - you'll need it for your frontend deployment

## Step 7: Test Your Backend

1. Visit your backend URL in a browser
2. You should see the message: "Football Prediction API is running..."
3. If you see this message, your backend is successfully deployed!

## Troubleshooting

### Build Failures

If your build fails, check the logs in the "Events" tab for specific errors. Common issues include:

1. **Missing package.json**: Make sure your Server directory contains a valid package.json file
2. **Missing start script**: Ensure your package.json has a "start" script that runs your server
3. **Environment variable issues**: Double-check that all required environment variables are set correctly

### Runtime Errors

If your service builds but crashes at runtime:

1. Check the logs in the "Logs" tab
2. Common issues include:
   - Database connection errors
   - Missing environment variables
   - Port conflicts (make sure your app uses the PORT environment variable)

### Free Tier Limitations

Be aware of Render's free tier limitations:

1. Your service will spin down after 15 minutes of inactivity
2. The first request after inactivity will take longer to respond (cold start)
3. Free tier is limited to 750 hours of runtime per month

## Next Steps

After successfully deploying your backend, you'll need to:

1. Deploy your frontend (to Netlify or Render)
2. Update the `CLIENT_URL` environment variable in your backend to point to your frontend URL
3. Update your frontend to use the backend URL for API requests

For detailed instructions on deploying your frontend to Render, see the RENDER_FRONTEND_DEPLOYMENT.md guide.
