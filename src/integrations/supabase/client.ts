// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fwuieownncubtdrsohyu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3dWllb3dubmN1YnRkcnNvaHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyNDI1MDMsImV4cCI6MjA0OTgxODUwM30.cTYV6oXEvgX5tB43_mZGYgDGdaCineAScrkVoJKxn9g";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);