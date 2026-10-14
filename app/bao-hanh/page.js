'use client'
import { useState } from 'react'
import { sb } from '../../lib/supabase'
const add = (s, m) => { const x = new Date(s); x.setMonth(x.getMonth() + m); return x }
const state = e => { const d = Math.ceil((e - new Date()) / 864e5); return d >= 0 ? `Còn bảo hành ${d} ngày (đến ${e.toLocaleDateString('vi-VN')})` : `Hết bảo hành từ ${e.toLocaleDateString('vi-VN')}` }
export default function Warranty() {
  const [im, setIm] = useState(''), [r, setR] = useState(null)
  const find = async e => { e.preventDefault(); const i = im.trim()
    const u = (await sb.from('units').select('*, products(name,warranty_months)').eq('imei', i).maybeSingle()).data
    const rp = (await sb.from('repairs').select('*').eq('imei', i)).data || []; setR({ u, rp }) }
  return (<div><h1>Tra cứu bảo hành theo IMEI</h1><form className="row" onSubmit={find}>
    <label>IMEI<input value={im} onChange={e => setIm(e.target.value)} required /></label><button>Tra cứu</button></form>
    {r && !r.u && !r.rp.length && <p>Không tìm thấy IMEI này.</p>}
    {r?.u && <div className="row"><div><b>{r.u.products?.name}</b><br />{r.u.status === 'sold' && r.u.sold_at
      ? <>Bán ngày {new Date(r.u.sold_at).toLocaleDateString('vi-VN')}. {r.u.products?.warranty_months > 0 ? state(add(r.u.sold_at, r.u.products.warranty_months)) : 'Sản phẩm không có bảo hành.'}</>
      : 'Máy chưa bán, đang trong kho.'}</div></div>}
    {r?.rp.map(x => <div className="row" key={x.id}><div>Sửa ngày {new Date(x.created_at).toLocaleDateString('vi-VN')}: {x.issue}<br />
      {x.warranty_months > 0 ? 'Bảo hành sửa chữa: ' + state(add(x.created_at, x.warranty_months)) : 'Không có bảo hành sửa chữa.'}</div></div>)}</div>)
}
