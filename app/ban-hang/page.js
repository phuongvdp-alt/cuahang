'use client'
import { useEffect, useState } from 'react'
import { sb, vnd } from '../../lib/supabase'
import Receipt from '../../components/Receipt'
export default function Sell() {
  const [P, setP] = useState([]), [U, setU] = useState([]), [C, setC] = useState([]), [cart, setCart] = useState([])
  const [pid, setPid] = useState(''), [imei, setImei] = useState(''), [qty, setQty] = useState(1), [price, setPrice] = useState(''), [cust, setCust] = useState(''), [msg, setMsg] = useState(''), [sale, setSale] = useState(null)
  const load = async () => { setP((await sb.from('products').select('*').order('name')).data || [])
    setU((await sb.from('units').select('imei,product_id').eq('status', 'in_stock')).data || []); setC((await sb.from('customers').select('id,name,phone')).data || []) }
  useEffect(() => { load() }, [])
  const p = P.find(x => x.id === pid), units = U.filter(u => u.product_id === pid && !cart.some(c => c.imei === u.imei))
  const add = () => { if (!p) return; if (p.track_imei && !imei) return setMsg('Chọn IMEI của máy')
    setCart([...cart, { product_id: p.id, name: p.name, qty: p.track_imei ? 1 : Number(qty), price: Number(price || p.price), cost: p.cost, wm: p.warranty_months, imei: p.track_imei ? imei : null }]); setImei(''); setMsg('') }
  const total = cart.reduce((a, i) => a + i.price * i.qty, 0)
  const pay = async () => { const { data: sid, error } = await sb.rpc('sell_items', { p_customer: cust || null, p_items: cart })
    if (error) return setMsg(error.message); setSale((await sb.from('sales').select('*').eq('id', sid).single()).data); setCart([]); setMsg('Đã bán xong, hóa đơn đã lưu.'); load() }
  return (<div><h1>Bán hàng</h1><div className="row">
    <label>Hàng<select value={pid} onChange={e => { setPid(e.target.value); setPrice(P.find(x => x.id === e.target.value)?.price || '') }}><option value="">—</option>{P.map(x => <option key={x.id} value={x.id}>{x.name} (tồn {x.stock})</option>)}</select></label>
    {p?.track_imei ? <label>IMEI<select value={imei} onChange={e => setImei(e.target.value)}><option value="">—</option>{units.map(u => <option key={u.imei}>{u.imei}</option>)}</select></label>
      : <label>Số lượng<input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} /></label>}
    <label>Giá bán<input type="number" value={price} onChange={e => setPrice(e.target.value)} /></label><button onClick={add}>Thêm vào hóa đơn</button></div>
    <table><thead><tr><th>Hàng</th><th>IMEI</th><th>SL</th><th>Giá</th><th /></tr></thead><tbody>
      {cart.map((i, n) => <tr key={n}><td>{i.name}</td><td>{i.imei}</td><td>{i.qty}</td><td>{vnd(i.price)}</td><td><button className="ghost" onClick={() => setCart(cart.filter((_, j) => j !== n))}>Bỏ</button></td></tr>)}</tbody></table>
    <div className="row"><label>Khách hàng<select value={cust} onChange={e => setCust(e.target.value)}><option value="">Khách lẻ</option>{C.map(x => <option key={x.id} value={x.id}>{x.name} {x.phone}</option>)}</select></label>
      <h2>Tổng: {vnd(total)}đ</h2><button disabled={!cart.length} onClick={pay}>Thanh toán</button></div><p className="err">{msg}</p><Receipt sale={sale} /></div>)
}
