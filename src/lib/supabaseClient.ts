import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://utvaizugwoplkzullwoj.supabase.co';
const supabaseKey = 'SUPABASE_CLIENT_API_KEY';
export const supabase = createClient(supabaseUrl, supabaseKey);
 
