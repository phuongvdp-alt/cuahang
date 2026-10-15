'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { sb } from '../lib/supabase'
import NewPass from './NewPass'
const L = [['/', 'Tổng quan'], ['/m/hang-hoa', 'Hàng hóa'], ['/m/imei', 'IMEI'], ['/nhap-hang', 'Nhập hàng'], ['/ban-hang', 'Bán hàng'],
  ['/hoa-don', 'Hóa đơn'], ['/thong-ke', 'Thống kê'], ['/sua-chua', 'Sửa chữa'], ['/bao-hanh', 'Bảo hành'], ['/m/khach-hang', 'Khách hàng'], ['/m/nha-cung-cap', 'Nhà cung cấp'],
  ['/m/so-quy', 'Sổ quỹ'], ['/doi-mat-khau', 'Đổi mật khẩu']]
export default function Shell({ children }) {
  const [s, setS] = useState(undefined), [e, setE] = useState(''), [info, setInfo] = useState(''), [mode, setMode] = useState('login')
  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setS(data.session))
    const { data } = sb.auth.onAuthStateChange((ev, x) => { setS(x); if (ev === 'PASSWORD_RECOVERY') setMode('recover') })
    return () => data.subscription.unsubscribe()
  }, [])
  if (s === undefined) return null
  if (s && mode === 'recover') return <NewPass title="Đặt mật khẩu mới" onDone={() => setMode('login')} />
  if (!s && mode === 'forgot') return (
    <form className="login" onSubmit={async ev => { ev.preventDefault()
      const { error } = await sb.auth.resetPasswordForEmail(new FormData(ev.target).get('email'), { redirectTo: window.location.origin })
      setE(error ? error.message : ''); setInfo(error ? '' : 'Đã gửi email. Mở email và bấm vào đường link để đặt mật khẩu mới.') }}>
      <h2>Quên mật khẩu</h2><input name="email" type="email" placeholder="Email đăng nhập" required />
      <button>Gửi email đặt lại mật khẩu</button><p className="err">{e}</p><p>{info}</p>
      <button type="button" className="ghost" onClick={() => { setMode('login'); setE(''); setInfo('') }}>Quay lại đăng nhập</button>
    </form>)
  if (!s) return (
    <form className="login" onSubmit={async ev => { ev.preventDefault(); const f = new FormData(ev.target)
      const { error } = await sb.auth.signInWithPassword({ email: f.get('email'), password: f.get('password') }); if (error) setE('Sai email hoặc mật khẩu') }}>
      <h2>Đăng nhập cửa hàng</h2>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Mật khẩu" required />
      <button>Đăng nhập</button><p className="err">{e}</p>
      <button type="button" className="ghost" onClick={() => { setMode('forgot'); setE('') }}>Quên mật khẩu?</button>
    </form>)
  return (<div className="app"><nav>{L.map(([h, t]) => <Link key={h} href={h}>{t}</Link>)}
    <button className="ghost" onClick={() => sb.auth.signOut()}>Đăng xuất</button></nav><main>{children}</main></div>)
}
