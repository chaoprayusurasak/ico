// Supabase configuration
const SUPABASE_URL = "https://dkdqrtomycsbwhqqhbip.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZHFydG9teWNzYndocXFoYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MDE0ODAsImV4cCI6MjA5ODk3NzQ4MH0.QbeNVbasmT7ziqLx44uHjqZf-HoY6VSlJ5otMfkoULQ";

// Initialize Supabase Client and overwrite the global window.supabase property directly.
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
