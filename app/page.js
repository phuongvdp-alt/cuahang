'use client'
import { useEffect, useState } from 'react'
import { sb, vnd } from '../lib/supabase'
export default function Home() {
  const [d, setD] = useState(null)
  useEffect(() => { (async () => {
    const from = new Date(); from.setDate(1); from.setHours(0, 0, 0, 0); const iso = from.toISOString()
    const [s, c, p, r] = await Promise.all([
      sb.from('sales').select('total,items').gte('created_at', iso), sb.from('cashbook').select('type,amount').gte('created_at', iso),
      sb.from('products').select('name,stock').lte('stock', 2).limit(20), sb.from('repairs').select('id').neq('status', 'Đã trả')])
    const rev = (s.data || []).reduce((a, x) => a + Number(x.total), 0)
    const profit = (s.data || []).reduce((a, x) => a + (x.items || []).reduce((b, i) => b + (i.price - (i.cost || 0)) * i.qty, 0), 0)
    const sum = t => (c.data || []).filter(x => x.type === t).reduce((a, x) => a + Number(x.amount), 0)
    setD({ rev, profit, thu: sum('thu'), chi: sum('chi'), low: p.data || [], rep: (r.data || []).length })
  })() }, [])
  if (!d) return <p>Đang tải...</p>
  return (<div><h1>Tổng quan tháng này</h1><div className="stats">
    {[['Doanh thu bán hàng', d.rev], ['Lãi gộp', d.profit], ['Tổng thu', d.thu], ['Tổng chi', d.chi]].map(([l, v]) => <div key={l}><b>{vnd(v)}đ</b><span>{l}</span></div>)}
    <div><b>{d.rep}</b><span>Máy đang sửa</span></div></div>
    <h2>Hàng sắp hết (tồn ≤ 2)</h2>{d.low.length ? <ul>{d.low.map(x => <li key={x.name}>{x.name}: còn {x.stock}</li>)}</ul> : <p>Chưa có hàng sắp hết.</p>}</div>)
}
