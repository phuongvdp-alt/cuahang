'use client'
import { useEffect, useState } from 'react'
import { sb } from './supabase'
export const DEFAULTS = { name: process.env.NEXT_PUBLIC_SHOP_NAME || 'Cửa hàng', address: process.env.NEXT_PUBLIC_SHOP_ADDRESS || '', phone: process.env.NEXT_PUBLIC_SHOP_PHONE || '',
  logo: '', title: 'HÓA ĐƠN BÁN HÀNG', footer: 'Cảm ơn quý khách! Vui lòng giữ hóa đơn và đem theo máy khi cần bảo hành.', terms: '', bank: '', showWarranty: true, showSign: true, showWords: true }
export function useSettings() {
  const [s, setS] = useState(DEFAULTS)
  useEffect(() => { sb.from('settings').select('data').eq('id', 1).maybeSingle().then(({ data }) => { if (data?.data) setS({ ...DEFAULTS, ...data.data }) }) }, [])
  return s
}
