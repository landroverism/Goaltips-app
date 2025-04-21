const { supabaseClient, supabaseAdmin } = require('./supabaseClient');

// User signup
const signUp = async (email, password, userData) => {
  try {
    // Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        username: userData.username,
        role: userData.role || 'user'
      },
      email_confirm: true
    });

    if (authError) {
      console.error('Auth error during signup:', authError);
      throw authError;
    }

    console.log('User created successfully in auth:', authData);
    
    // The profile should be created automatically via database triggers
    // If you need to manually create/update the profile, you can do it here
    // But it's better to use database triggers for this

    return {
      user: authData.user,
      success: true
    };
  } catch (error) {
    console.error('Error in signUp function:', error);
    
    // Handle duplicate key errors gracefully
    if (error.message?.includes('duplicate key')) {
      return {
        success: false,
        message: 'User already exists'
      };
    }
    
    throw error;
  }
};

// User login
const signIn = async (email, password) => {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return {
      user: data.user,
      session: data.session,
      success: true
    };
  } catch (error) {
    console.error('Error in signIn function:', error);
    throw error;
  }
};

// Password reset request
const requestPasswordReset = async (email) => {
  try {
    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.CLIENT_URL}/reset-password`
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Password reset instructions sent to your email'
    };
  } catch (error) {
    console.error('Error in requestPasswordReset function:', error);
    throw error;
  }
};

// Check if user is admin
const isUserAdmin = async (userId) => {
  try {
    // First check in auth metadata
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (authError) throw authError;
    
    if (authData?.user?.user_metadata?.role === 'admin') {
      return true;
    }
    
    // If not found in metadata, check in the database
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data?.role === 'admin';
  } catch (error) {
    console.error('Error in isUserAdmin function:', error);
    return false;
  }
};

module.exports = {
  signUp,
  signIn,
  requestPasswordReset,
  isUserAdmin
};
