import { createClient } from '@supabase/supabase-js'

// Fixed credentials with correct format
const SUPABASE_URL = 'https://idimgmujkuzuuxcmsqhc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkaW1nbXVqa3V6dXV4Y21zcWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3ODM4NDgsImV4cCI6MjA2NzM1OTg0OH0.hXQO17aMF6-Kz6P0HcKkCBH7y406XWIhFhlXxucmLj0'

// Simple validation
if (!SUPABASE_URL || !SUPABASE_ANON_KEY || 
    SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || 
    SUPABASE_ANON_KEY === '<ANON_KEY>') {
  console.error('Missing Supabase environment variables');
}

console.log('Creating Supabase client with:', { 
  url: SUPABASE_URL.substring(0, 15) + '...',
  key: SUPABASE_ANON_KEY.substring(0, 15) + '...'
});

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: localStorage
    }
  }
);

// Test the connection and log results
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Supabase connected successfully');
  }
});

export default supabase;