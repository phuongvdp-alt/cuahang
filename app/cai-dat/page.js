'use client'
import { useEffect, useState } from 'react'
import { sb } from '../../lib/supabase'
import { DEFAULTS } from '../../lib/settings'
import Receipt from '../../components/Receipt'
const SAMPLE = { id: 'abc123def456', created_at: new Date().toISOString(), customer_name: 'Nguyễn Văn A', customer_phone: '0901234567', discount: 100000, total: 12550000, note: 'Tặng kèm cường lực',
  items: [{ name: 'iPhone 13 128GB', imei: '356938035643809', qty: 1, price: 12500000, wm: 12 }, { name: 'Ốp lưng', qty: 1, price: 150000, wm: 0 }] }
export default function Settings() {
  const [f, setF] = useState(DEFAULTS), [m, setM] = useState('')
  useEffect(() => { sb.from('settings').select('data').eq('id', 1).maybeSingle().then(({ data }) => { if (data?.data) setF({ ...DEFAULTS, ...data.data }) }) }, [])
  const T = (k, l, w) => <label className={w}>{l}<input value={f[k] || ''} onChange={e => setF({ ...f, [k]: e.target.value })} /></label>
  const A = (k, l, r) => <label className="wide">{l}<textarea rows={r} value={f[k] || ''} onChange={e => setF({ ...f, [k]: e.target.value })} /></label>
  const C = (k, l) => <label className="chk"><input type="checkbox" checked={!!f[k]} onChange={e => setF({ ...f, [k]: e.target.checked })} />{l}</label>
  const save = async () => { const { error } = await sb.from('settings').upsert({ id: 1, data: f }); setM(error ? error.message : 'Đã lưu. Các hóa đơn in từ giờ sẽ dùng mẫu này.') }
  return (<div><h1>Tùy chỉnh mẫu hóa đơn</h1><div className="cfg">
    {T('name', 'Tên cửa hàng')}{T('phone', 'Số điện thoại')}{T('address', 'Địa chỉ', 'wide')}{T('logo', 'Link ảnh logo (không bắt buộc)', 'wide')}{T('title', 'Tiêu đề hóa đơn', 'wide')}
    {A('terms', 'Điều khoản bảo hành (mỗi ý một dòng)', 4)}{A('bank', 'Thông tin chuyển khoản (ngân hàng, số tài khoản, chủ tài khoản)', 3)}{A('footer', 'Lời cảm ơn cuối hóa đơn', 2)}
    {C('showWarranty', 'Hiện cột bảo hành')}{C('showWords', 'Hiện số tiền bằng chữ')}{C('showSign', 'Hiện chỗ ký tên')}</div>
    <div className="row"><button onClick={save}>Lưu mẫu hóa đơn</button><button className="ghost" onClick={() => setF(DEFAULTS)}>Về mặc định</button><span>{m}</span></div>
    <h2>Xem trước</h2><Receipt sale={SAMPLE} cfg={f} noscroll /></div>)
}
