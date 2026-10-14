'use client'
import { useState } from 'react'
import { sb } from '../lib/supabase'
export default function NewPass({ title = 'Đổi mật khẩu', onDone }) {
  const [m, setM] = useState(''), [ok, setOk] = useState(false)
  return (<form className="login" onSubmit={async ev => { ev.preventDefault(); const f = new FormData(ev.target)
    if (f.get('a') !== f.get('b')) return setM('Hai mật khẩu chưa giống nhau')
    const { error } = await sb.auth.updateUser({ password: f.get('a') })
    if (error) return setM(error.message.includes('different') ? 'Mật khẩu mới phải khác mật khẩu cũ' : error.message)
    setM(''); setOk(true); onDone && onDone() }}>
    <h2>{title}</h2>
    <input name="a" type="password" minLength={6} placeholder="Mật khẩu mới (ít nhất 6 ký tự)" required />
    <input name="b" type="password" minLength={6} placeholder="Nhập lại mật khẩu mới" required />
    <button>Lưu mật khẩu mới</button><p className="err">{m}</p>{ok && <p>Đã đổi mật khẩu.</p>}</form>)
}
