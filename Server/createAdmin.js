// createAdmin.js - Script to create an admin user in Supabase
require('dotenv').config();
const { supabaseAdmin } = require('./supabaseClient');

const createAdminUser = async (email, password, username) => {
  try {
    console.log('Creating admin user...');
    
    // Create user with admin role in auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        username,
        role: 'admin'
      },
      email_confirm: true
    });

    if (authError) {
      console.error('Error creating admin user in auth:', authError);
      return;
    }

    console.log('Admin user created successfully in auth:', authData.user.id);
    
    // The trigger should automatically create the user in the users table
    // Let's verify it exists and has admin role
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (userError) {
      console.error('Error verifying user in database:', userError);
      
      // If the trigger didn't work, let's manually create the user
      const { data: insertData, error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authData.user.id,
          username,
          email,
          role: 'admin'
        })
        .select();
      
      if (insertError) {
        console.error('Error manually creating user in database:', insertError);
        return;
      }
      
      console.log('Admin user manually created in database:', insertData);
      return;
    }
    
    console.log('Admin user verified in database:', userData);
    console.log('Admin user creation complete!');
  } catch (error) {
    console.error('Unexpected error creating admin user:', error);
  }
};

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 3) {
  console.log('Usage: node createAdmin.js <email> <password> <username>');
  process.exit(1);
}

const [email, password, username] = args;

// Create the admin user
createAdminUser(email, password, username)
  .then(() => {
    console.log('Script execution complete');
    process.exit(0);
  })
  .catch(err => {
    console.error('Script execution failed:', err);
    process.exit(1);
  });
