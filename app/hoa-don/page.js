'use client'
import { useEffect, useState } from 'react'
import { sb, vnd } from '../../lib/supabase'
import Receipt from '../../components/Receipt'
export default function Invoices() {
  const [rows, setRows] = useState([]), [cur, setCur] = useState(null)
  useEffect(() => { sb.from('sales').select('*').order('created_at', { ascending: false }).limit(200).then(({ data }) => setRows(data || [])) }, [])
  return (<div><h1>Hóa đơn bán</h1><div className="scroll"><table><thead><tr><th>Ngày</th><th>Hàng</th><th>Tổng tiền</th><th /></tr></thead><tbody>
    {rows.map(r => <tr key={r.id}><td>{new Date(r.created_at).toLocaleString('vi-VN')}</td><td>{(r.items || []).map(i => i.name).join(', ')}</td><td>{vnd(r.total)}</td>
      <td><button className="ghost" onClick={() => setCur(r)}>Xem / In</button></td></tr>)}
    {!rows.length && <tr><td colSpan="4">Chưa có hóa đơn.</td></tr>}</tbody></table></div><Receipt sale={cur} /></div>)
}
