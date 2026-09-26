// ตัวเลือกการเก็บข้อมูล: 'local' หรือ 'supabase'
// เปลี่ยนเป็น 'supabase' เมื่อพร้อมใช้งานจริง
const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE || 'local'

export const STORAGE_KEY = 'borrow-buddy:loans'

export const LOAD_WARNING = 'อ่านข้อมูลเดิมไม่ได้ จึงเริ่มด้วยรายการว่าง ข้อมูลเดิมยังไม่ถูกลบจนกว่าจะบันทึกรายการใหม่'
export const SAVE_WARNING = 'บันทึกข้อมูลไม่สำเร็จ ข้อมูลล่าสุดอาจไม่ถูกเก็บไว้'

// เก็บ user ที่ล็อกอินไว้ใช้กับ RLS
let currentUser = null

export function setCurrentUser(user) {
  currentUser = user
}

export function getCurrentUser() {
  return currentUser
}

// โหลด Loan - รองรับทั้ง localStorage และ Supabase
export async function loadLoans() {
  if (DATA_SOURCE === 'supabase') {
    return await loadLoansFromSupabase()
  } else {
    return loadLoansFromLocalStorage()
  }
}

// บันทึก Loan - รองรับทั้ง localStorage และ Supabase
export async function saveLoans(loans) {
  if (DATA_SOURCE === 'supabase') {
    return await saveLoansToSupabase(loans)
  } else {
    return saveLoansToLocalStorage(loans)
  }
}

// === ฟังก์ชัน localStorage (สำหรับ development/testing) ===

function loadLoansFromLocalStorage(storage = globalThis.localStorage) {
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (raw === null) return { loans: [], warning: null }
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return { loans: [], warning: LOAD_WARNING }
    return { loans: data, warning: null }
  } catch {
    return { loans: [], warning: LOAD_WARNING }
  }
}

function saveLoansToLocalStorage(loans, storage = globalThis.localStorage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(loans))
    return null
  } catch {
    return SAVE_WARNING
  }
}

// === ฟังก์ชัน Supabase (สำหรับ production) ===

// Import แบบ dynamic เพื่อแยก bundle ไม่ให้โหลด Supabase SDK เมื่อใช้ localStorage
let supabase = null
let supabasePromise = null

async function getSupabaseClient() {
  if (supabase) return supabase

  if (!supabasePromise) {
    supabasePromise = import('@supabase/supabase-js').then(({ createClient }) => {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'
      return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    })
  }

  supabase = await supabasePromise
  return supabase
}

async function loadLoansFromSupabase() {
  try {
    if (!currentUser) {
      return { loans: [], warning: LOAD_WARNING }
    }

    const supabaseClient = await getSupabaseClient()
    const { data, error } = await supabaseClient
      .from('loans')
      .select('*')
      .eq('owner_id', currentUser.id)
      .order('due_date', { ascending: true })

    if (error) {
      console.error('Error loading loans:', error)
      return { loans: [], warning: LOAD_WARNING }
    }

    return { loans: data || [], warning: null }
  } catch {
    return { loans: [], warning: LOAD_WARNING }
  }
}

async function saveLoansToSupabase(loans) {
  try {
    if (!currentUser) {
      return SAVE_WARNING
    }

    const supabaseClient = await getSupabaseClient()
    const loansWithOwner = loans.map((loan) => ({
      ...loan,
      owner_id: currentUser.id,
    }))

    // ใช้ upsert เพื่อรองรับทั้ง insert และ update
    const { error } = await supabaseClient
      .from('loans')
      .upsert(loansWithOwner, { onConflict: 'id' })

    if (error) {
      console.error('Error saving loans:', error)
      return SAVE_WARNING
    }

    return null
  } catch {
    return SAVE_WARNING
  }
}
