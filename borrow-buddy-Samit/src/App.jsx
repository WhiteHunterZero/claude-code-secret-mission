import { useLayoutEffect, useState } from 'react'
import './App.css'
import LoanForm from './components/LoanForm.jsx'
import LoanList from './components/LoanList.jsx'
import SearchBox from './components/SearchBox.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import LoginForm from './components/LoginForm.jsx'
import { toIsoDate } from './lib/dateFormat.js'
import { filterLoansByFriend, markReturned, unmarkReturned } from './lib/loanRules.js'
import { loadLoans, saveLoans, setCurrentUser, getCurrentUser } from './lib/db.js'
import { getInitialTheme, saveTheme, toggleTheme } from './lib/theme.js'

const createId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`

function App() {
  // สถานะการล็อกอิน
  const [isLoggedIn, setIsLoggedIn] = useState(!!getCurrentUser())
  const [loginMode, setLoginMode] = useState(false)

  // โหลดครั้งเดียวตอนเปิดหน้า (อ่านอย่างเดียว ไม่เขียนทับข้อมูลเดิม)
  const [initial, setInitial] = useState({ loans: [], warning: null })
  const [loans, setLoans] = useState(initial.loans)
  const [warning, setWarning] = useState(initial.warning)
  const [editingId, setEditingId] = useState(null)
  const [query, setQuery] = useState('')
  const [theme, setTheme] = useState(() =>
    getInitialTheme(undefined, window.matchMedia('(prefers-color-scheme: dark)').matches),
  )

  // ตั้งธีมให้ <html> ก่อนวาดหน้าจอ เพื่อไม่ให้จอกะพริบ
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // โหลดข้อมูลตอนล็อกอิน
  useLayoutEffect(() => {
    if (isLoggedIn) {
      loadLoans().then(({ loans, warning }) => {
        setInitial({ loans, warning })
        setLoans(loans)
        setWarning(warning)
      })
    }
  }, [isLoggedIn])

  const handleToggleTheme = () => {
    const next = toggleTheme(theme)
    setTheme(next)
    saveTheme(next)
  }

  const handleLogin = (userIdentifier) => {
    // ใน prototype ใช้ email เป็น identifier
    // ใน production ควรใช้ user object จาก Supabase auth
    const user = {
      id: userIdentifier,
      email: userIdentifier,
    }
    setCurrentUser(user)
    setIsLoggedIn(true)
    setLoginMode(false)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsLoggedIn(false)
    setLoans([])
    setWarning(null)
    setEditingId(null)
    setQuery('')
  }

  const today = toIsoDate(new Date())
  const editingLoan = loans.find((loan) => loan.id === editingId) ?? null
  const visibleLoans = filterLoansByFriend(loans, query)

  // ทุกการเปลี่ยน Loan ต้องผ่านฟังก์ชันนี้ เพื่อบันทึกทุกครั้งที่เปลี่ยน
  const changeLoans = async (nextLoans) => {
    setLoans(nextLoans)
    const warning = await saveLoans(nextLoans)
    setWarning(warning)
  }

  // Loan ที่ยังไม่มี id คือเพิ่มใหม่ ถ้ามี id คือแก้ไขรายการเดิม
  const handleSave = async (loan) => {
    if (loan.id) {
      await changeLoans(loans.map((l) => (l.id === loan.id ? loan : l)))
    } else {
      await changeLoans([...loans, { ...loan, id: createId() }])
    }
    setEditingId(null)
  }

  const replaceLoan = async (target, update) =>
    await changeLoans(loans.map((l) => (l.id === target.id ? update(l) : l)))

  const handleMarkReturned = (loan, returnedDate) =>
    replaceLoan(loan, (l) => markReturned(l, today, returnedDate))

  const handleUnmarkReturned = (loan) => replaceLoan(loan, unmarkReturned)

  // หน้าล็อกอิน
  if (loginMode || !isLoggedIn) {
    return (
      <main className="login-page">
        <div className="login-container">
          <LoginForm
            onLogin={handleLogin}
            onCancel={loginMode ? () => setLoginMode(false) : undefined}
          />
          {!loginMode && !isLoggedIn && (
            <p className="login-prompt">
              เริ่มต้นใช้งานด้วยการล็อกอิน
            </p>
          )}
        </div>
      </main>
    )
  }

  // หน้าหลักหลังล็อกอิน
  return (
    <main>
      <header className="app-header">
        <h1>Borrow Buddy</h1>
        <div className="header-actions">
          <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
          <button onClick={handleLogout} className="btn-logout">
            ออกจากระบบ
          </button>
        </div>
      </header>
      {warning && <p role="alert">{warning}</p>}
      <LoanForm
        key={editingLoan?.id ?? 'new'}
        today={today}
        editingLoan={editingLoan}
        onSave={handleSave}
        onCancelEdit={() => setEditingId(null)}
      />
      <SearchBox value={query} onChange={setQuery} />
      <LoanList
        loans={visibleLoans}
        today={today}
        onMarkReturned={handleMarkReturned}
        onUnmarkReturned={handleUnmarkReturned}
        onEdit={(loan) => setEditingId(loan.id)}
      />
    </main>
  )
}

export default App
