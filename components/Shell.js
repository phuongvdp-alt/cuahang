'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { sb } from '../lib/supabase'
const L = [['/', 'Tổng quan'], ['/m/hang-hoa', 'Hàng hóa'], ['/m/imei', 'IMEI'], ['/nhap-hang', 'Nhập hàng'], ['/ban-hang', 'Bán hàng'],
  ['/hoa-don', 'Hóa đơn'], ['/sua-chua', 'Sửa chữa'], ['/bao-hanh', 'Bảo hành'], ['/m/khach-hang', 'Khách hàng'], ['/m/nha-cung-cap', 'Nhà cung cấp'], ['/m/so-quy', 'Sổ quỹ']]
export default function Shell({ children }) {
  const [s, setS] = useState(undefined), [e, setE] = useState('')
  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setS(data.session))
    const { data } = sb.auth.onAuthStateChange((_, x) => setS(x))
    return () => data.subscription.unsubscribe()
  }, [])
  if (s === undefined) return null
  if (!s) return (
    <form className="login" onSubmit={async ev => { ev.preventDefault(); const f = new FormData(ev.target)
      const { error } = await sb.auth.signInWithPassword({ email: f.get('email'), password: f.get('password') }); if (error) setE('Sai email hoặc mật khẩu') }}>
      <h2>Đăng nhập cửa hàng</h2>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Mật khẩu" required />
      <button>Đăng nhập</button><p className="err">{e}</p>
    </form>)
  return (<div className="app"><nav>{L.map(([h, t]) => <Link key={h} href={h}>{t}</Link>)}
    <button className="ghost" onClick={() => sb.auth.signOut()}>Đăng xuất</button></nav><main>{children}</main></div>)
}
