# Connecting Your Render Backend to Netlify Frontend

Since you've already deployed your frontend on Netlify, here are the steps to ensure your Render backend works properly with it:

## Step 1: Get Your Netlify Frontend URL

1. Go to your Netlify dashboard
2. Find your deployed site
3. Note the URL (e.g., `https://goaltips-app.netlify.app`)

## Step 2: Update Backend CORS Configuration

When deploying your backend to Render, make sure to add your Netlify domain to the CORS configuration by setting the `CLIENT_URL` environment variable.

## Step 3: Deploy Backend to Render

Follow the steps in the [RENDER_BACKEND_DEPLOYMENT.md](cci:7://file:///home/landroverism/Goaltips-app/RENDER_BACKEND_DEPLOYMENT.md:0:0-0:0) guide, but when you get to the environment variables step, make sure to add:

```
CLIENT_URL=https://your-netlify-site.netlify.app
```

Replace `https://your-netlify-site.netlify.app` with your actual Netlify URL.

## Step 4: Update Frontend API URL

1. Go to your Netlify dashboard
2. Navigate to Site settings > Environment variables
3. Add or update the `VITE_API_URL` variable with your Render backend URL
4. Trigger a new deployment on Netlify

## Step 5: Test the Connection

1. Visit your Netlify site
2. Try to:
   - Log in with existing credentials
   - Register a new user
   - Access protected routes
   - Make API calls to your backend

## Troubleshooting

If you encounter issues with the connection:

1. **CORS Errors**: Check that your backend's CORS configuration includes your Netlify domain
2. **API Connection Issues**: Verify that the `VITE_API_URL` in Netlify points to your Render backend
3. **Authentication Problems**: Ensure Supabase credentials are consistent between frontend and backend

Remember that Render's free tier will spin down your backend after 15 minutes of inactivity, so the first request might be slower as the service spins up again.
