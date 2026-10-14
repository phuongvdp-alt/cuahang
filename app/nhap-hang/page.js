'use client'
import { useEffect, useState } from 'react'
import { sb, vnd } from '../../lib/supabase'
export default function Buy() {
  const [P, setP] = useState([]), [S, setS] = useState([]), [cart, setCart] = useState([])
  const [pid, setPid] = useState(''), [qty, setQty] = useState(1), [cost, setCost] = useState(''), [ims, setIms] = useState(''), [sup, setSup] = useState(''), [msg, setMsg] = useState('')
  useEffect(() => { (async () => { setP((await sb.from('products').select('*').order('name')).data || []); setS((await sb.from('suppliers').select('id,name')).data || []) })() }, [])
  const p = P.find(x => x.id === pid)
  const add = () => { if (!p) return; const imeis = p.track_imei ? [...new Set(ims.split(/[\s,]+/).filter(Boolean))] : []
    if (p.track_imei && !imeis.length) return setMsg('Nhập IMEI, mỗi máy một dòng')
    setCart([...cart, { product_id: p.id, name: p.name, qty: p.track_imei ? imeis.length : Number(qty), cost: Number(cost || p.cost), imeis }]); setIms(''); setMsg('') }
  const total = cart.reduce((a, i) => a + i.cost * i.qty, 0)
  const save = async () => { const { error } = await sb.rpc('receive_stock', { p_supplier: sup || null, p_items: cart })
    if (error) return setMsg(error.message.includes('imei') ? 'Có IMEI đã tồn tại trong kho' : error.message); setCart([]); setMsg('Đã nhập kho.') }
  return (<div><h1>Nhập hàng</h1><div className="row">
    <label>Hàng<select value={pid} onChange={e => { setPid(e.target.value); setCost(P.find(x => x.id === e.target.value)?.cost || '') }}><option value="">—</option>{P.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
    {p?.track_imei ? <label>Danh sách IMEI<textarea rows="4" value={ims} onChange={e => setIms(e.target.value)} /></label>
      : <label>Số lượng<input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} /></label>}
    <label>Giá nhập<input type="number" value={cost} onChange={e => setCost(e.target.value)} /></label><button onClick={add}>Thêm vào phiếu</button></div>
    <table><thead><tr><th>Hàng</th><th>SL</th><th>Giá nhập</th><th /></tr></thead><tbody>
      {cart.map((i, n) => <tr key={n}><td>{i.name}</td><td>{i.qty}</td><td>{vnd(i.cost)}</td><td><button className="ghost" onClick={() => setCart(cart.filter((_, j) => j !== n))}>Bỏ</button></td></tr>)}</tbody></table>
    <div className="row"><label>Nhà cung cấp<select value={sup} onChange={e => setSup(e.target.value)}><option value="">—</option>{S.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
      <h2>Tổng: {vnd(total)}đ</h2><button disabled={!cart.length} onClick={save}>Lưu phiếu nhập</button></div><p className="err">{msg}</p></div>)
}
