import { createClient } from '@supabase/supabase-js'
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://chua-khai-bao-bien.supabase.co'
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'chua-khai-bao-bien'
export const sb = createClient(url, key)
export const vnd = n => Number(n || 0).toLocaleString('vi-VN')
