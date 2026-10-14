'use client'
import { useEffect, useState } from 'react'
import { sb, vnd } from '../lib/supabase'
const get = (r, k) => k.split('.').reduce((o, p) => o?.[p], r)
export default function Crud({ table, title, fields, readonly, sel = '*' }) {
  const [rows, setRows] = useState([]), [f, setF] = useState({}), [err, setErr] = useState(''), [q, setQ] = useState('')
  const load = async () => { const { data } = await sb.from(table).select(sel).order('created_at', { ascending: false }).limit(500); setRows(data || []) }
  useEffect(() => { load() }, [])
  const save = async e => {
    e.preventDefault(); const body = {}
    fields.filter(x => !x.ro).forEach(x => { let v = f[x.k]
      if (x.t === 'number') v = Number(v || 0); else if (x.t === 'checkbox') v = !!v; else if (v === '' || v === undefined) v = null
      body[x.k] = v })
    const { error } = f.id ? await sb.from(table).update(body).eq('id', f.id) : await sb.from(table).insert(body)
    if (error) return setErr(error.message); setErr(''); setF({}); load()
  }
  const del = async id => { if (!confirm('Xóa dòng này?')) return; const { error } = await sb.from(table).delete().eq('id', id); if (error) setErr(error.message); else load() }
  const show = (r, x) => { const v = get(r, x.k); return x.t === 'number' ? vnd(v) : x.t === 'checkbox' ? (v ? '✓' : '') : x.t === 'dt' ? (v ? new Date(v).toLocaleString('vi-VN') : '') : v }
  const shown = rows.filter(r => !q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()))
  return (<div><h1>{title}</h1>
    {!readonly && <form className="row" onSubmit={save}>
      {fields.filter(x => !x.ro).map(x => <label key={x.k}>{x.l}
        {x.t === 'select' ? <select value={f[x.k] ?? ''} onChange={e => setF({ ...f, [x.k]: e.target.value })}><option value="">—</option>{x.o.map(o => <option key={o}>{o}</option>)}</select>
          : x.t === 'checkbox' ? <input type="checkbox" checked={!!f[x.k]} onChange={e => setF({ ...f, [x.k]: e.target.checked })} />
          : <input type={x.t || 'text'} value={f[x.k] ?? ''} onChange={e => setF({ ...f, [x.k]: e.target.value })} />}</label>)}
      <button>{f.id ? 'Lưu thay đổi' : 'Thêm mới'}</button>{f.id && <button type="button" className="ghost" onClick={() => setF({})}>Hủy</button>}
    </form>}
    <p className="err">{err}</p>
    <input className="search" placeholder="Tìm kiếm..." value={q} onChange={e => setQ(e.target.value)} />
    <div className="scroll"><table><thead><tr>{fields.map(x => <th key={x.k}>{x.l}</th>)}<th /></tr></thead>
      <tbody>{shown.map(r => <tr key={r.id}>{fields.map(x => <td key={x.k}>{show(r, x)}</td>)}
        <td>{!readonly && <><button className="ghost" onClick={() => setF(r)}>Sửa</button><button className="ghost" onClick={() => del(r.id)}>Xóa</button></>}</td></tr>)}
        {!shown.length && <tr><td colSpan={fields.length + 1}>Chưa có dữ liệu.</td></tr>}</tbody></table></div></div>)
}
