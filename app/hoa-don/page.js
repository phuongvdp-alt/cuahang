'use client'
import { useEffect, useState } from 'react'
import { sb, vnd } from '../../lib/supabase'
import Receipt from '../../components/Receipt'
export default function Invoices() {
  const [tab, setTab] = useState('ban'), [rows, setRows] = useState([]), [S, setS] = useState([]), [cur, setCur] = useState(null), [ed, setEd] = useState(null), [msg, setMsg] = useState('')
  const T = tab === 'ban' ? 'sales' : 'purchases'
  const load = async () => { setRows((await sb.from(T).select('*').order('created_at', { ascending: false }).limit(200)).data || []); setS((await sb.from('suppliers').select('id,name')).data || []) }
  useEffect(() => { setCur(null); setEd(null); setMsg(''); load() }, [tab])
  const del = async r => { if (!confirm('Xóa hóa đơn này? Kho, IMEI và sổ quỹ sẽ được hoàn lại.')) return
    const { error } = await sb.rpc(tab === 'ban' ? 'delete_sale' : 'delete_purchase', { p_id: r.id }); if (error) setMsg(error.message); else { setMsg(''); load() } }
  const save = async () => { const { error } = tab === 'ban'
    ? await sb.rpc('update_sale', { p_id: ed.id, p_name: ed.customer_name || null, p_phone: ed.customer_phone || null, p_note: ed.note || null, p_discount: Number(ed.discount || 0), p_items: ed.items })
    : await sb.rpc('update_purchase', { p_id: ed.id, p_supplier: ed.supplier_id || null, p_note: ed.note || null })
    if (error) return setMsg(error.message); setEd(null); setMsg(''); load() }
  const set = (k, v) => setEd({ ...ed, [k]: v }), line = (n, k, v) => set('items', ed.items.map((i, j) => j === n ? { ...i, [k]: Number(v) } : i))
  return (<div><h1>Hóa đơn</h1><div className="row"><button className={tab === 'ban' ? '' : 'ghost'} onClick={() => setTab('ban')}>Bán hàng</button><button className={tab === 'nhap' ? '' : 'ghost'} onClick={() => setTab('nhap')}>Nhập hàng</button></div>
    <p className="err">{msg}</p>
    {ed && <div className="row"><b>Sửa hóa đơn</b>
      {tab === 'ban' ? <><label>Tên khách<input value={ed.customer_name || ''} onChange={e => set('customer_name', e.target.value)} /></label><label>Điện thoại<input value={ed.customer_phone || ''} onChange={e => set('customer_phone', e.target.value)} /></label>
        <label>Giảm giá<input type="number" value={ed.discount || 0} onChange={e => set('discount', e.target.value)} /></label>
        {ed.items.map((i, n) => <div key={n} className="row"><span>{i.name} {i.imei} (SL {i.qty})</span><label>Giá bán<input type="number" value={i.price} onChange={e => line(n, 'price', e.target.value)} /></label><label>Bảo hành (tháng)<input type="number" value={i.wm || 0} onChange={e => line(n, 'wm', e.target.value)} /></label></div>)}</>
        : <label>Nhà cung cấp<select value={ed.supplier_id || ''} onChange={e => set('supplier_id', e.target.value)}><option value="">—</option>{S.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>}
      <label>Ghi chú<input value={ed.note || ''} onChange={e => set('note', e.target.value)} /></label>
      <button onClick={save}>Lưu</button><button className="ghost" onClick={() => setEd(null)}>Hủy</button></div>}
    <div className="scroll"><table><thead><tr><th>Ngày</th><th>{tab === 'ban' ? 'Khách' : 'Nhà cung cấp'}</th><th>Hàng</th><th>Tổng tiền</th><th /></tr></thead><tbody>
      {rows.map(r => <tr key={r.id}><td>{new Date(r.created_at).toLocaleString('vi-VN')}</td><td>{tab === 'ban' ? r.customer_name : S.find(x => x.id === r.supplier_id)?.name}</td>
        <td>{(r.items || []).map(i => i.name).join(', ')}</td><td>{vnd(r.total)}</td>
        <td>{tab === 'ban' && <button className="ghost" onClick={() => setCur(r)}>In</button>}<button className="ghost" onClick={() => setEd(r)}>Sửa</button><button className="ghost" onClick={() => del(r)}>Xóa</button></td></tr>)}
      {!rows.length && <tr><td colSpan="5">Chưa có hóa đơn.</td></tr>}</tbody></table></div>{tab === 'ban' && <Receipt sale={cur} />}</div>)
}
