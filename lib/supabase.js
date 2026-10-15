import { createClient } from '@supabase/supabase-js'
// Giá trị tạm giúp build không lỗi khi chưa khai báo biến. Thêm biến thật trên Vercel rồi Redeploy để app hoạt động.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://chua-khai-bao-bien.supabase.co'
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'chua-khai-bao-bien'
export const sb = createClient(url, key)
export const vnd = n => Number(n || 0).toLocaleString('vi-VN')
