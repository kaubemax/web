// ---------------------------------------------------------------------------
// Supabase connection settings
// ---------------------------------------------------------------------------
// These two values are SAFE to commit publicly. The "anon" key is a
// publishable key; write access is protected by Row-Level Security in the DB
// (see schema.sql). Fill these in after creating your Supabase project:
//   Supabase dashboard -> Project Settings -> API
// ---------------------------------------------------------------------------

window.SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
window.SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";

// Storage bucket name for recipe and espresso photos (created in setup step 3).
window.SUPABASE_BUCKET = "eva-media";
