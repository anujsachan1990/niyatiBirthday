function getSupabaseClient() {
  const url = window.SUPABASE_URL;
  const key = window.SUPABASE_ANON_KEY;

  if (!url || !key || url.includes('YOUR_PROJECT') || key.includes('YOUR_ANON')) {
    return null;
  }

  return window.supabase.createClient(url, key);
}
