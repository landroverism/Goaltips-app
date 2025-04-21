// checkUser.js - Script to check if a user exists in the database and create if not
require('dotenv').config();
const { supabaseAdmin } = require('./supabaseClient');

const checkAndCreateUser = async (email) => {
  try {
    console.log(`Checking user ${email} in database...`);
    
    // First, get the user by email from auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error listing users:', authError);
      return;
    }
    
    // Find the user with the specified email
    const user = authUser.users.find(u => u.email === email);
    
    if (!user) {
      console.error('User not found in auth system with email:', email);
      return;
    }
    
    console.log('Found user in auth system:', user.id);
    
    // Check if user exists in the users table
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id);
    
    if (userError) {
      console.error('Error checking user in database:', userError);
      return;
    }
    
    if (userData && userData.length > 0) {
      console.log('User exists in database:', userData[0]);
      
      // Ensure the role is set to admin
      const { data: updateData, error: updateError } = await supabaseAdmin
        .from('users')
        .update({ 
          role: 'admin',
          // Ensure other fields are set correctly
          username: user.user_metadata?.username || email.split('@')[0],
          email: email
        })
        .eq('id', user.id)
        .select();
      
      if (updateError) {
        console.error('Error updating user in database:', updateError);
      } else {
        console.log('Updated user in database:', updateData);
      }
    } else {
      console.log('User does not exist in database, creating...');
      
      // Create the user in the users table
      const { data: insertData, error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          id: user.id,
          username: user.user_metadata?.username || email.split('@')[0],
          email: email,
          role: 'admin'
        })
        .select();
      
      if (insertError) {
        console.error('Error creating user in database:', insertError);
      } else {
        console.log('Created user in database:', insertData);
      }
    }
    
    console.log('User check and update complete!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
  console.log('Usage: node checkUser.js <email>');
  process.exit(1);
}

const [email] = args;

// Check and create the user
checkAndCreateUser(email)
  .then(() => {
    console.log('Script execution complete');
    process.exit(0);
  })
  .catch(err => {
    console.error('Script execution failed:', err);
    process.exit(1);
  });
