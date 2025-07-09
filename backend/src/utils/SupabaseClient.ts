import { createClient } from '@supabase/supabase-js'
require('dotenv').config()
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl) {
  throw new Error('SUPABASE_URL environment variable is not set');
}
if (!supabaseKey) {
  throw new Error('SUPABASE_KEY environment variable is not set');
}
if (!supabaseServiceRoleKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set');
}
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)