'use client'
import { useEffect, useState } from 'react'
import { sb, vnd } from '../../lib/supabase'
const range = (k, f, t) => { const n = new Date(), s = new Date(n.getFullYear(), n.getMonth(), n.getDate())
  if (k === 'tuy') return [new Date(f || s), new Date(new Date(t || s).getTime() + 864e5)]
  const a = k === 'tuan' ? new Date(s.getTime() - ((s.getDay() + 6) % 7) * 864e5) : k === 'thang' ? new Date(n.getFullYear(), n.getMonth(), 1) : k === 'nam' ? new Date(n.getFullYear(), 0, 1) : s
  return [a, new Date(s.getTime() + 864e5)] }
export default function Stats() {
  const [k, setK] = useState('thang'), [f, setF] = useState(''), [t, setT] = useState(''), [d, setD] = useState(null)
  useEffect(() => { (async () => { const [a, b] = range(k, f, t), A = a.toISOString(), B = b.toISOString()
    const [s, p, r] = await Promise.all([sb.from('sales').select('total,items').gte('created_at', A).lt('created_at', B), sb.from('purchases').select('total').gte('created_at', A).lt('created_at', B),
      sb.from('repairs').select('labor,parts_cost').in('status', ['Đã xong', 'Đã trả']).gte('created_at', A).lt('created_at', B)])
    const m = {}; let rev = 0, cost = 0
    ;(s.data || []).forEach(x => { rev += Number(x.total); (x.items || []).forEach(i => { const c = (i.cost || 0) * i.qty; cost += c
      const e = m[i.name] || (m[i.name] = { qty: 0, rev: 0, profit: 0 }); e.qty += i.qty; e.rev += i.price * i.qty; e.profit += (i.price - (i.cost || 0)) * i.qty }) })
    const rl = (r.data || []).reduce((a, x) => a + Number(x.labor), 0), rp = (r.data || []).reduce((a, x) => a + Number(x.parts_cost), 0)
    setD({ rev, cost, buy: (p.data || []).reduce((a, x) => a + Number(x.total), 0), rn: (r.data || []).length, rl, rprofit: rl - rp, sprofit: rev - cost,
      rows: Object.entries(m).sort((x, y) => y[1].rev - x[1].rev) }) })() }, [k, f, t])
  const neg = v => v < 0 ? { color: '#b42318' } : {}
  return (<div><h1>Thống kê</h1><div className="row"><label>Khoảng thời gian<select value={k} onChange={e => setK(e.target.value)}>
    <option value="hom">Hôm nay</option><option value="tuan">Tuần này</option><option value="thang">Tháng này</option><option value="nam">Năm nay</option><option value="tuy">Tùy chọn</option></select></label>
    {k === 'tuy' && <><label>Từ ngày<input type="date" value={f} onChange={e => setF(e.target.value)} /></label><label>Đến ngày<input type="date" value={t} onChange={e => setT(e.target.value)} /></label></>}</div>
    {!d ? <p>Đang tải...</p> : <><div className="stats">
      {[['Doanh thu bán hàng', d.rev], ['Giá vốn hàng bán', d.cost], ['Lãi bán hàng', d.sprofit], ['Khách trả tiền sửa (' + d.rn + ' máy)', d.rl], ['Lãi sửa chữa', d.rprofit], ['TỔNG LÃI', d.sprofit + d.rprofit], ['Tiền nhập hàng', d.buy]]
        .map(([l, v]) => <div key={l}><b style={neg(v)}>{vnd(v)}đ</b><span>{l}</span></div>)}</div>
      <h2>Mặt hàng đã bán</h2><div className="scroll"><table><thead><tr><th>Mặt hàng</th><th>Số lượng</th><th>Doanh thu</th><th>Lãi (chưa trừ giảm giá)</th></tr></thead><tbody>
        {d.rows.map(([n, e]) => <tr key={n}><td>{n}</td><td>{e.qty}</td><td>{vnd(e.rev)}</td><td style={neg(e.profit)}>{vnd(e.profit)}</td></tr>)}
        {!d.rows.length && <tr><td colSpan="4">Chưa có hàng bán trong khoảng này.</td></tr>}</tbody></table></div></>}</div>)
}
