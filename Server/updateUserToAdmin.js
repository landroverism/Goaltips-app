// updateUserToAdmin.js - Script to update an existing user to have admin privileges
require('dotenv').config();
const { supabaseAdmin } = require('./supabaseClient');

const updateUserToAdmin = async (email) => {
  try {
    console.log(`Updating user ${email} to admin role...`);
    
    // First, get the user by email
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (userError) {
      console.error('Error finding user:', userError);
      return;
    }
    
    if (!userData) {
      console.error('User not found with email:', email);
      return;
    }
    
    console.log('Found user with ID:', userData.id);
    
    // Update user's role in the users table
    const { data: updateData, error: updateError } = await supabaseAdmin
      .from('users')
      .update({ role: 'admin' })
      .eq('id', userData.id)
      .select();
    
    if (updateError) {
      console.error('Error updating user role in database:', updateError);
      return;
    }
    
    console.log('Updated user role in database:', updateData);
    
    // Update user's metadata in auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      userData.id,
      { user_metadata: { role: 'admin' } }
    );
    
    if (authError) {
      console.error('Error updating user metadata in auth:', authError);
      return;
    }
    
    console.log('Updated user metadata in auth:', authData);
    console.log(`User ${email} has been updated to admin role successfully!`);
  } catch (error) {
    console.error('Unexpected error updating user to admin:', error);
  }
};

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
  console.log('Usage: node updateUserToAdmin.js <email>');
  process.exit(1);
}

const [email] = args;

// Update the user to admin
updateUserToAdmin(email)
  .then(() => {
    console.log('Script execution complete');
    process.exit(0);
  })
  .catch(err => {
    console.error('Script execution failed:', err);
    process.exit(1);
  });
