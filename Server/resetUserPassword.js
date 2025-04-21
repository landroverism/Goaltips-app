// resetUserPassword.js - Script to reset a user's password in Supabase
require('dotenv').config();
const { supabaseAdmin } = require('./supabaseClient');

const resetUserPassword = async (email, newPassword) => {
  try {
    console.log(`Resetting password for user ${email}...`);
    
    // Get the user by email
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error listing users:', authError);
      return;
    }
    
    // Find the user with the specified email
    const user = authData.users.find(u => u.email === email);
    
    if (!user) {
      console.error('User not found with email:', email);
      return;
    }
    
    console.log('Found user:', user.id);
    
    // Update the user's password
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );
    
    if (error) {
      console.error('Error updating password:', error);
      return;
    }
    
    console.log('Password updated successfully!');
    
    // Also ensure the user has the correct metadata
    const { error: metaError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { 
        user_metadata: { 
          role: 'admin',
          username: user.user_metadata?.username || email.split('@')[0]
        },
        email_confirm: true
      }
    );
    
    if (metaError) {
      console.error('Error updating user metadata:', metaError);
    } else {
      console.log('User metadata updated successfully!');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node resetUserPassword.js <email> <newPassword>');
  process.exit(1);
}

const [email, newPassword] = args;

// Reset the user's password
resetUserPassword(email, newPassword)
  .then(() => {
    console.log('Script execution complete');
    process.exit(0);
  })
  .catch(err => {
    console.error('Script execution failed:', err);
    process.exit(1);
  });
