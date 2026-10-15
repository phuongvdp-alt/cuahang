'use client'
import { useEffect, useRef, useState } from 'react'
import { vnd } from '../lib/supabase'
import { useSettings } from '../lib/settings'
const U = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']
const read3 = (n, full) => { const t = Math.floor(n / 100), c = Math.floor(n / 10) % 10, u = n % 10, o = []
  if (t || full) o.push(U[t], 'trăm'); if (c > 1) o.push(U[c], 'mươi'); else if (c === 1) o.push('mười'); else if (u && (t || full)) o.push('lẻ')
  if (u) o.push(c > 1 && u === 1 ? 'mốt' : c >= 1 && u === 5 ? 'lăm' : U[u]); return o.join(' ') }
const words = n => { n = Math.round(n); if (!n) return 'Không đồng'; const g = ['', ' nghìn', ' triệu', ' tỷ'], p = []; let i = 0
  while (n > 0 && i < 4) { p.unshift([n % 1000, i]); n = Math.floor(n / 1000); i++ }
  const s = p.map(([v, k], j) => v ? read3(v, j > 0) + g[k] : '').filter(Boolean).join(' '); return s.charAt(0).toUpperCase() + s.slice(1) + ' đồng' }
const until = (s, m) => { const x = new Date(s); x.setMonth(x.getMonth() + m); return x.toLocaleDateString('vi-VN') }
export default function Receipt({ sale, cfg, noscroll }) {
  const [sz, setSz] = useState('a'), ref = useRef()
  const hook = useSettings(), c = cfg || hook
  useEffect(() => { if (!noscroll) ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, [sale?.id])
  if (!sale) return null
  const sub = sale.items.reduce((a, i) => a + i.price * i.qty, 0), dt = new Date(sale.created_at)
  const name = c.name, addr = c.address, tel = c.phone
  const print = s => { setSz(s); setTimeout(() => window.print(), 80) }
  return (<div><div ref={ref} className={'receipt' + (sz === 's' ? ' bill' : '')}>
    <div className="rc-head"><div>{c.logo && <img className="rc-logo" src={c.logo} alt="" />}<h2>{name}</h2>{addr && <p>{addr}</p>}{tel && <p>Điện thoại: {tel}</p>}</div>
      <div className="rc-meta"><b>{c.title}</b><p>Số: HD{sale.id.slice(0, 6).toUpperCase()}</p><p>Ngày: {dt.toLocaleString('vi-VN')}</p></div></div>
    <div className="rc-cus"><p><b>Khách hàng:</b> {sale.customer_name || 'Khách lẻ'}</p>{sale.customer_phone && <p><b>Điện thoại:</b> {sale.customer_phone}</p>}</div>
    <table className="rc-tb"><thead><tr><th>STT</th><th>Tên hàng / IMEI</th>{c.showWarranty && <th>Bảo hành</th>}<th className="r">SL</th><th className="r">Đơn giá</th><th className="r">Thành tiền</th></tr></thead><tbody>
      {sale.items.map((i, n) => <tr key={n}><td>{n + 1}</td><td><b>{i.name}</b>{i.imei && <><br />IMEI: {i.imei}</>}</td>
        {c.showWarranty && <td>{i.wm > 0 ? <>{i.wm} tháng<br />đến {until(sale.created_at, i.wm)}</> : '—'}</td>}<td className="r">{i.qty}</td><td className="r">{vnd(i.price)}</td><td className="r">{vnd(i.price * i.qty)}</td></tr>)}</tbody></table>
    <div className="rc-total"><p><span>Tạm tính</span><span>{vnd(sub)}đ</span></p>{sale.discount > 0 && <p><span>Giảm giá</span><span>-{vnd(sale.discount)}đ</span></p>}
      <p className="big"><span>TỔNG CỘNG</span><span>{vnd(sale.total)}đ</span></p>{c.showWords && <p className="words">Bằng chữ: {words(sale.total)}</p>}</div>
    {sale.note && <p className="rc-note"><b>Ghi chú:</b> {sale.note}</p>}
    {c.terms && <div className="rc-terms"><b>Điều khoản bảo hành:</b><p>{c.terms}</p></div>}{c.bank && <div className="rc-terms"><b>Thông tin chuyển khoản:</b><p>{c.bank}</p></div>}
    {c.showSign && <div className="rc-sign"><div>Khách hàng<br /><i>(Ký, ghi rõ họ tên)</i></div><div>Người bán hàng<br /><i>(Ký, ghi rõ họ tên)</i></div></div>}
    {c.footer && <p className="rc-foot">{c.footer}</p>}</div>
    {!noscroll && <div className="row noprint"><button onClick={() => print('a')}>In hóa đơn (A5 / A4)</button><button className="ghost" onClick={() => print('s')}>In bill 80mm</button></div>}</div>)
}
