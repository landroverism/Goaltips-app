const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Check if the script is being run directly
const directExecution = require.main === module;

// Initialize Supabase client with service role key (admin privileges)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupAdmin() {
  // First, find and remove any existing admin user with username 'admin'
  try {
    console.log('Setting up admin user...');
    
    // Check if user exists
    const { data: existingUser, error: checkError } = await supabaseAdmin.auth.admin.listUsers();
    
    // First, find and delete any existing user with username 'admin' that's not our target email
    try {
      const { data: existingAdmins } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('username', 'admin');
      
      if (existingAdmins && existingAdmins.length > 0) {
        for (const admin of existingAdmins) {
          if (admin.email !== 'vocalunion8@gmail.com') {
            console.log(`Found existing admin user with email ${admin.email}, removing...`);
            await supabaseAdmin
              .from('users')
              .delete()
              .eq('id', admin.id);
          }
        }
      }
    } catch (err) {
      console.log('Error checking for existing admin users:', err);
      // Continue anyway
    }
    
    if (checkError) {
      console.error('Error checking existing users:', checkError);
      return;
    }
    
    const adminEmail = 'vocalunion8@gmail.com';
    const adminUser = existingUser.users.find(user => user.email === adminEmail);
    
    if (adminUser) {
      console.log('Admin user already exists, updating...');
      
      // Update user metadata to include admin role
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        adminUser.id,
        { 
          email: adminEmail,
          password: 'ham99@ke',
          user_metadata: { role: 'admin', username: 'admin' }
        }
      );
      
      if (updateError) {
        console.error('Error updating admin user:', updateError);
        return;
      }
      
      // Update user in public.users table
      const { error: dbError } = await supabaseAdmin
        .from('users')
        .upsert({
          id: adminUser.id,
          username: 'admin',
          email: adminEmail,
          role: 'admin',
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      
      if (dbError) {
        console.error('Error updating admin in users table:', dbError);
        return;
      }
      
      console.log('Admin user updated successfully!');
    } else {
      console.log('Creating new admin user...');
      
      // Create new admin user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: 'ham99@ke',
        email_confirm: true,
        user_metadata: { role: 'admin', username: 'admin' }
      });
      
      if (createError) {
        console.error('Error creating admin user:', createError);
        return;
      }
      
      // Insert user into public.users table
      const { error: dbError } = await supabaseAdmin
        .from('users')
        .insert({
          id: newUser.user.id,
          username: 'admin',
          email: adminEmail,
          role: 'admin'
        });
      
      if (dbError) {
        console.error('Error inserting admin into users table:', dbError);
        return;
      }
      
      console.log('Admin user created successfully!');
    }
    
    console.log('Admin setup complete!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Only run the function if this script is being executed directly
if (directExecution) {
  setupAdmin()
    .then(() => console.log('Setup completed'))
    .catch(err => console.error('Fatal error:', err));
}

module.exports = { setupAdmin };
