import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rwipsolrguuapfpgnrmd.supabase.co';
const supabaseAnonKey = 'sb_publishable_w6bs04y-_cJe8NhN49erNA_gw7oD9js';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
