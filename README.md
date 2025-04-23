# Goaltips - Football Prediction Application

A full-stack application for football match predictions with user and admin roles, built with React, Node.js, Express, and Supabase.

## 📋 Project Overview

Goaltips is a football prediction platform that allows:
- Users to register, login, and make predictions on upcoming matches
- Admins to manage matches, users, and view prediction statistics
- Secure data access with row-level security policies

## 🏗️ Tech Stack

### Frontend (Client)
- React with Vite
- Tailwind CSS for styling
- Supabase JS client for authentication and data access

### Backend (Server)
- Node.js with Express
- Supabase for database and authentication
- RESTful API endpoints for data operations

### Database & Authentication
- Supabase (PostgreSQL)
- Row-Level Security (RLS) policies
- Role-based access control (admin, user)

## 🚀 Deployment

The application is deployed using:
- Frontend: Netlify
- Backend: Render
- Database: Supabase Cloud

Detailed deployment guides are available in:
- [FINAL_RENDER_DEPLOYMENT.md](./FINAL_RENDER_DEPLOYMENT.md) - Complete deployment guide
- [RENDER_BACKEND_DEPLOYMENT.md](./RENDER_BACKEND_DEPLOYMENT.md) - Backend-specific deployment
- [RENDER_FRONTEND_DEPLOYMENT.md](./RENDER_FRONTEND_DEPLOYMENT.md) - Frontend-specific deployment

## 🛠️ Project Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Environment Variables

Create `.env` files based on the provided `.env.example`:

#### Root Directory
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### Client Directory
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=your_backend_url
```

### Database Setup

Run the SQL scripts in the following order:
1. `complete_setup.sql` - Creates tables, triggers, and RLS policies
2. `fix_auth.sql` - Fixes authentication-related issues
3. `fix_permissions.sql` - Sets proper permissions
4. `fix_rls_policies.sql` - Configures Row Level Security policies
5. `fix_triggers.sql` - Sets up database triggers

### Admin Setup

Run the admin setup script to create an admin user:
```bash
cd Server
node setupAdmin.js
```

Default admin credentials:
- Email: vocalunion8@gmail.com
- Password: ham99@ke
- Username: admin

## 🏃‍♂️ Running Locally

### Backend
```bash
cd Server
npm install
npm start
```

### Frontend
```bash
cd Client
npm install
npm run dev
```

## 📁 Project Structure

### Client
- `src/` - React components, hooks, and utilities
  - `components/` - UI components
  - `hooks/` - Custom React hooks including useAuth and useSupabase
  - `pages/` - Page components
  - `context/` - React context providers

### Server
- `server.js` - Express server setup and API routes
- `supabaseClient.js` - Supabase client initialization
- `supabaseAuth.js` - Authentication functions
- `supabaseDb.js` - Database operations
- `auth.js` - Authentication middleware

## 🔒 Security Features

- Supabase authentication with secure password handling
- Row-Level Security (RLS) policies for data protection
- Service role key for admin operations
- Password toggle feature for improved UX

## 👥 User Roles

### Regular Users
- Register and login
- View matches
- Make predictions
- View personal prediction history

### Admin Users
- All regular user capabilities
- Manage matches (add, edit, delete)
- Manage users (change roles)
- View all predictions and statistics

## 📄 License

This project is proprietary and confidential.

## 👨‍💻 Maintenance

For any questions or issues, please contact the project maintainer.
