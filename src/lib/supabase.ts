import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://fwuieownncubtdrsohyu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3dWllb3dubmN1YnRkcnNvaHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyNDI1MDMsImV4cCI6MjA0OTgxODUwM30.cTYV6oXEvgX5tB43_mZGYgDGdaCineAScrkVoJKxn9g";

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your configuration.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);