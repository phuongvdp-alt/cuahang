'use client'
import { useEffect, useState } from 'react'
import { sb, vnd } from '../../lib/supabase'
import Crud from '../../components/Crud'
import { M } from '../../lib/modules'
export default function Repairs() {
  const [rep, setRep] = useState([]), [P, setP] = useState([]), [parts, setParts] = useState([]), [rid, setRid] = useState(''), [pid, setPid] = useState(''), [qty, setQty] = useState(1), [msg, setMsg] = useState(''), [v, setV] = useState(0)
  const load = async () => { setRep((await sb.from('repairs').select('id,customer_name,device').neq('status', 'Đã trả').order('created_at', { ascending: false })).data || [])
    setP((await sb.from('products').select('id,name,stock').order('name')).data || []) }
  useEffect(() => { load() }, [v])
  useEffect(() => { (async () => setParts(rid ? (await sb.from('repair_parts').select('id,qty,cost,products(name)').eq('repair_id', rid)).data || [] : []))() }, [rid, v])
  const add = async () => { const { error } = await sb.rpc('use_part', { p_repair: rid, p_product: pid, p_qty: Number(qty) }); if (error) return setMsg(error.message); setMsg(''); setV(v + 1) }
  const rm = async id => { const { error } = await sb.rpc('remove_part', { p_part: id }); if (error) setMsg(error.message); else setV(v + 1) }
  return (<div><h1>Linh kiện dùng khi sửa</h1><div className="row">
    <label>Phiếu sửa<select value={rid} onFocus={load} onChange={e => setRid(e.target.value)}><option value="">—</option>{rep.map(r => <option key={r.id} value={r.id}>{r.customer_name} - {r.device}</option>)}</select></label>
    <label>Linh kiện<select value={pid} onChange={e => setPid(e.target.value)}><option value="">—</option>{P.map(x => <option key={x.id} value={x.id}>{x.name} (tồn {x.stock})</option>)}</select></label>
    <label>Số lượng<input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} /></label>
    <button disabled={!rid || !pid} onClick={add}>Trừ kho và thêm vào phiếu</button></div><p className="err">{msg}</p>
    {rid && <table><thead><tr><th>Linh kiện đã dùng</th><th>SL</th><th>Giá vốn</th><th /></tr></thead><tbody>
      {parts.map(x => <tr key={x.id}><td>{x.products?.name}</td><td>{x.qty}</td><td>{vnd(x.cost)}</td><td><button className="ghost" onClick={() => rm(x.id)}>Bỏ, hoàn kho</button></td></tr>)}
      {!parts.length && <tr><td colSpan="4">Phiếu này chưa dùng linh kiện nào.</td></tr>}</tbody></table>}
    <Crud key={v} {...M['sua-chua']} /></div>)
}
