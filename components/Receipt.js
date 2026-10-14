'use client'
import { vnd } from '../lib/supabase'
const until = (s, m) => { const x = new Date(s); x.setMonth(x.getMonth() + m); return x.toLocaleDateString('vi-VN') }
export default function Receipt({ sale }) {
  if (!sale) return null
  return (<div className="receipt"><h2>{process.env.NEXT_PUBLIC_SHOP_NAME || 'Cửa hàng'}</h2><p>{process.env.NEXT_PUBLIC_SHOP_PHONE}</p>
    <p>Hóa đơn bán hàng, {new Date(sale.created_at).toLocaleString('vi-VN')}</p>
    <table><tbody>{sale.items.map((i, n) => <tr key={n}><td>{i.name}{i.imei && <><br />IMEI: {i.imei}</>}{i.wm > 0 && <><br />Bảo hành đến {until(sale.created_at, i.wm)}</>}</td>
      <td>{i.qty} x {vnd(i.price)}</td></tr>)}</tbody></table>
    <h3>Tổng: {vnd(sale.total)}đ</h3><button className="noprint" onClick={() => window.print()}>In hóa đơn</button></div>)
}
