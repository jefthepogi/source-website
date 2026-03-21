import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'source' },
  auth: {
    // Prevent Supabase from triggering a session refresh every time
    // the browser tab regains focus — this was causing loading flashes.
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    // Disable realtime heartbeat reconnects on tab focus
    params: { eventsPerSecond: 2 },
  },
});
