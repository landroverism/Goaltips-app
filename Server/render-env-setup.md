# Render Environment Variables Setup

When setting up your environment variables in Render, make sure to use the following exact values without any markdown formatting:

## Required Environment Variables

```
PORT=10000
JWT_SECRET=r6ZXU5W5lhRR22F2XqnPlnG9YIUWUG0crzCU4tN/P5PoLDxJYmdsLdBGfXnvdpW+I2Q6KCIpe1ugYVtGk2AY/g==
SUPABASE_URL=https://bycpkknwhcylkkmetgji.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5Y3Bra253aGN5bGtrbWV0Z2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNTE3NDUsImV4cCI6MjA2MDcyNzc0NX0.hhvoa2j_EowvjCqcHgIF5IyTOy6GyiIAT6AIc1vlbjY
CLIENT_URL=https://your-netlify-site.netlify.app
```

Replace `https://your-netlify-site.netlify.app` with your actual Netlify URL.

## Important Notes

1. Make sure there are no markdown formatting characters like `[]()` in your environment variables
2. Copy and paste the values exactly as shown above
3. The `PORT` is set to 10000 because Render will automatically assign a port via the `PORT` environment variable

## Steps to Update Environment Variables

1. Go to your Render dashboard
2. Select your backend service
3. Click on the "Environment" tab
4. Delete any existing environment variables
5. Add each variable one by one, copying the exact values from above
6. Click "Save Changes"
7. Render will automatically redeploy your service with the new environment variables
