const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Regular client for client-side operations
// Clean up the URL in case it has markdown formatting or other issues
const supabaseUrl = process.env.SUPABASE_URL ? process.env.SUPABASE_URL.replace(/\[|\]|\(|\)/g, '').trim() : '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Log for debugging
console.log('Supabase URL:', supabaseUrl);

// Regular client (uses anon key, respects RLS)
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (uses service role key, bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

module.exports = { supabaseClient, supabaseAdmin };
