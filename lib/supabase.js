import { createClient } from '@supabase/supabase-js'
export const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
export const vnd = n => Number(n || 0).toLocaleString('vi-VN')
