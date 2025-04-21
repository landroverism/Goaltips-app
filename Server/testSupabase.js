// testSupabase.js - Script to test Supabase connection and functionality
require('dotenv').config();
const { supabaseClient, supabaseAdmin } = require('./supabaseClient');

const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test connection with regular client
    const { data: regularData, error: regularError } = await supabaseClient
      .from('users')
      .select('count')
      .limit(1);
    
    if (regularError) {
      console.error('Error connecting with regular client:', regularError);
    } else {
      console.log('Regular client connection successful!');
    }
    
    // Test connection with admin client
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);
    
    if (adminError) {
      console.error('Error connecting with admin client:', adminError);
    } else {
      console.log('Admin client connection successful!');
    }
    
    // Test RLS policies by trying to access users table with regular client
    console.log('Testing RLS policies...');
    
    // Test 1: Regular client trying to access all users
    const { data: usersData, error: usersError } = await supabaseClient
      .from('users')
      .select('*');
    
    if (usersError) {
      console.log('✓ Test 1 passed: Regular client cannot access all users');
      console.log('  Error:', usersError.message);
    } else {
      console.log('✗ Test 1 failed: Regular client can access all users. RLS policies may not be properly set up.');
      console.log('  Users data:', usersData);
    }
    
    // Test 2: Regular client trying to access their own user (should work)
    // For this test to work, we need to sign in as a specific user
    try {
      const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
        email: 'vocalunion8@gmail.com',
        password: 'ham99@ke' // Updated admin credentials
      });
      
      if (authError) {
        console.log('✗ Test 2 skipped: Could not sign in as test user');
        console.log('  Error:', authError.message);
      } else {
        console.log('✓ Signed in as test user:', authData.user.email);
        
        // Now try to access own user data
        const { data: ownUserData, error: ownUserError } = await supabaseClient
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();
        
        if (ownUserError) {
          console.log('✗ Test 2 failed: User cannot access their own data');
          console.log('  Error:', ownUserError.message);
        } else {
          console.log('✓ Test 2 passed: User can access their own data');
          console.log('  User data:', ownUserData);
          
          // Check if user has admin role
          if (ownUserData.role === 'admin') {
            console.log('✓ User has admin role in database');
          } else {
            console.log('✗ User does not have admin role in database');
          }
          
          // Check if JWT has admin role
          const { data: { session } } = await supabaseClient.auth.getSession();
          const jwtRole = session?.user?.user_metadata?.role;
          
          if (jwtRole === 'admin') {
            console.log('✓ User has admin role in JWT');
          } else {
            console.log('✗ User does not have admin role in JWT:', jwtRole);
          }
        }
      }
    } catch (error) {
      console.error('Error during user sign-in test:', error);
    }
    
    // Test admin client bypassing RLS
    const { data: adminUsersData, error: adminUsersError } = await supabaseAdmin
      .from('users')
      .select('*');
    
    if (adminUsersError) {
      console.error('Error: Admin client cannot bypass RLS:', adminUsersError);
    } else {
      console.log('Admin client successfully bypassed RLS and accessed users table');
      console.log(`Found ${adminUsersData.length} users in the database`);
    }
    
    console.log('Supabase connection tests complete!');
  } catch (error) {
    console.error('Unexpected error testing Supabase connection:', error);
  }
};

// Run the test
testSupabaseConnection()
  .then(() => {
    console.log('Script execution complete');
    process.exit(0);
  })
  .catch(err => {
    console.error('Script execution failed:', err);
    process.exit(1);
  });
