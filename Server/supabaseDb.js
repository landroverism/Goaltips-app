const { supabaseClient, supabaseAdmin } = require('./supabaseClient');

// User-related functions
const getAllUsers = async () => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, username, role, email');
  
  if (error) throw error;
  return data;
};

// Match-related functions
const getAllMatches = async () => {
  const { data, error } = await supabaseClient
    .from('matches')
    .select('*');
  
  if (error) throw error;
  return data;
};

const addMatch = async (matchData) => {
  const { data, error } = await supabaseAdmin
    .from('matches')
    .insert([matchData])
    .select();
  
  if (error) throw error;
  return data[0];
};

const updateMatch = async (id, matchData) => {
  const { data, error } = await supabaseAdmin
    .from('matches')
    .update(matchData)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

const deleteMatch = async (id) => {
  const { error } = await supabaseAdmin
    .from('matches')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return { success: true };
};

// Prediction-related functions
const getAllPredictions = async () => {
  const { data, error } = await supabaseClient
    .from('predictions')
    .select(`
      id, 
      match_id,
      predicted_winner,
      matches (
        id, 
        home_team, 
        away_team
      )
    `);
  
  if (error) throw error;
  return data;
};

const addPrediction = async (predictionData) => {
  const { data, error } = await supabaseAdmin
    .from('predictions')
    .insert([predictionData])
    .select();
  
  if (error) throw error;
  return data[0];
};

// User role management
const updateUserRole = async (userId, role) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select();
  
  if (error) throw error;
  return data[0];
};

module.exports = {
  getAllUsers,
  getAllMatches,
  addMatch,
  updateMatch,
  deleteMatch,
  getAllPredictions,
  addPrediction,
  updateUserRole
};
