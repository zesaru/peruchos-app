import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  "https://ggkmkoxkntqzksmtselr.supabase.co";
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdna21rb3hrbnRxemtzbXRzZWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MDYxNDgsImV4cCI6MjA4MzE4MjE0OH0.QXs1I3OFdViNXRA5NtfuPID3-znb979h8UY2f9haYhc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
