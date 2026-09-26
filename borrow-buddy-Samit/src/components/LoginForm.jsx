import { useState } from 'react'

function LoginForm({ onLogin, onCancel }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // ตรวจความถูกต้องพื้นฐาน
    if (!email || !password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน')
      return
    }

    if (!email.includes('@')) {
      setError('อีเมลไม่ถูกต้อง')
      return
    }

    setLoading(true)

    try {
      // เรียก Supabase auth ที่นี่
      // ปัจจุบันยังไม่ได้ implement จริง เพราะต้องมี Supabase project
      // สำหรับ prototype ให้ใช้ email เป็น owner_id
      onLogin(email)
    } catch (err) {
      setError('ล็อกอินไม่สำเร็จ กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-form">
      <h2>ล็อกอิน</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">อีเมล:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">รหัสผ่าน:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'กำลังล็อกอิน...' : 'ล็อกอิน'}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              ยกเลิก
            </button>
          )}
        </div>
      </form>
      <p className="login-hint">
        * สำหรับprototype: กรุณาใช้อีเมลที่ไม่ซ้ำกันเพื่อแยกข้อมูลแต่ละเจ้าของ
      </p>
    </div>
  )
}

export default LoginForm
