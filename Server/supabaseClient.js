const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Regular client for client-side operations
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Regular client (uses anon key, respects RLS)
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (uses service role key, bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

module.exports = { supabaseClient, supabaseAdmin };
