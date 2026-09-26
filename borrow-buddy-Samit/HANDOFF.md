# Handoff: Borrow Buddy (สรุปส่งต่องาน)

อัปเดตล่าสุด: 2026-09-25 (เตรียมเวอร์ชัน 2) อ่านไฟล์นี้ก่อน แล้วอ่าน [CONTEXT.md](./CONTEXT.md), [design.md](./design.md), [Tasks.md](./Tasks.md) เพื่อทำงานต่อ

## โปรเจ็กต์คืออะไร
เว็บหน้าเดียวสำหรับเจ้าของแต่ละคน บันทึกว่าเพื่อนยืมของอะไร เมื่อไร ต้องคืนเมื่อไร และกดคืนแล้วได้

**เวอร์ชัน 1**: เก็บข้อมูลใน localStorage (เสร็จสมบูรณ์แล้ว)

**เวอร์ชัน 2**: ย้ายข้อมูลไป Supabase ใช้ RLS ให้เจ้าของเห็นเฉพาะ Loan ของตัวเอง ใช้ email + password สำหรับล็อกอิน (ไม่มีระบบสมัครสมาชิก)

## กติกาที่ต้องทำตาม
- ตอบเป็นภาษาไทยสุภาพ กระชับ ประหยัด token
- ใช้ JavaScript เท่านั้น (ไม่ใช้ TypeScript)
- ทำตามคำสั่งผู้ใช้เท่านั้น
- **ห้ามลบไฟล์โดยไม่ถามก่อน** (รวมถึงไฟล์ `.gitkeep`)
- ห้ามแสดงข้อมูลส่วนตัว
- **งาน git ทั้งหมดในโปรเจ็กต์นี้ให้มอบ agent `git-manager` ทำ** ไม่รัน git เองผ่าน Bash (แม้แต่ `git status`) และไม่ push
- ผู้ใช้สั่งให้ **commit ทุกครั้งที่ทำ task เสร็จ** ข้อความ commit ภาษาอังกฤษ รูปแบบ `feat: T3.x ...` ปิดท้ายด้วย `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`
- ก่อนตั้งค่า/ใช้ไลบรารี (Vite, React, Vitest) ให้ตรวจเอกสารล่าสุดผ่าน Context7 (React: `/websites/react_dev`)
- รอให้ commit ของ task หนึ่งเสร็จก่อนเริ่มแก้ไฟล์ของ task ถัดไป เพื่อไม่ให้งานปนกัน

## สถานะงาน

| Task | สถานะ | Commit |
|---|---|---|
| T1.1 – T1.3 ตั้งโปรเจ็กต์ | เสร็จ | `f440dbc`, `c25eca7`, `f068441` |
| T2.1 `dateFormat.js` | เสร็จ | `ae9e1f5` |
| T2.2 `getLoanStatus` | เสร็จ | `d33bef9` |
| T2.3 `getDaysOverdue` | เสร็จ | `ef3ae10` |
| T2.4 `validateLoan` | เสร็จ | `2866281` |
| T2.5 `groupLoans` | เสร็จ | `43e48e0` |
| T2.6 `filterLoansByFriend` | เสร็จ | `49a8c48` |
| T2.7 `markReturned` / `unmarkReturned` | เสร็จ | `4d58674` |
| T2.8 `storage.js` | เสร็จ | `36f05e8` |
| T3.1 `App.jsx` state + โหลด/บันทึก | เสร็จ | `e868549` |
| T3.2 `LoanForm.jsx` | เสร็จ | `32066f2` |
| T3.3 `SearchBox.jsx` | เสร็จ | `4c8fb6e` |
| T3.4 `LoanList.jsx` / `LoanItem.jsx` | เสร็จ | `79f12ea` |
| T3.5 ปุ่มคืนแล้ว/ยกเลิกการคืน/แก้ไข | เสร็จ | `8a29978` |
| T3.6 `ThemeToggle.jsx` (โหมดมืด) | เสร็จ | `8641fa5` |
| T3.7 สไตล์ (มือถือ + สถานะ) | เสร็จ | `51bef52` |
| T4.1 `npm test` ผ่านทั้งหมด (68 ข้อ) | เสร็จ | `f7ee8af` |
| T4.2 ทดลองเพิ่ม/แก้ไข/กดคืน/ยกเลิกคืน/รีเฟรช | เสร็จ | `b0e2673` |
| T4.3 ทดลองกรณีขอบ | เสร็จ | `8c2908e` |
| T4.4 มือถือและโหมดมืด | เสร็จ | `408e31e` |
| T4.5 ไม่มีฟีเจอร์นอกขอบเขต + ศัพท์ตรง CONTEXT.md | เสร็จ | `566becf` |

**ทุก task ใน `Tasks.md` (เฟส 1 – 4) เสร็จครบแล้ว** `npm test` ผ่านทั้งหมด 68 ข้อ (4 ไฟล์) `npm run lint` และ `npm run build` ผ่าน
commit แรกของ repository คือ `ee81221` (เอกสาร + `.gitignore`) สาขา `main` ยังไม่ push repository อยู่ที่ `borrow-buddy/.git` (ไม่ใช่โฟลเดอร์แม่)

## สิ่งที่ต้องทำต่อ (เวอร์ชัน 2)

**เฟส 5: ย้ายไป Supabase** (ใน `Tasks.md` คลิกทีละ task):
- T5.1 – T5.3: ตั้งค่า Supabase และ SDK
- T5.4: สร้าง `db.js` แทน `storage.js` ใช้ RLS
- T5.5 – T5.6: สร้าง UI ล็อกอินและผสานกับ App
- T5.7 – T5.8: ทดสอบ RLS แยกข้อมูลเจ้าของ

**เมื่อเฟส 5 เสร็จ:**
- push ขึ้น remote (ยังไม่มีการสั่ง ห้าม push เอง)
- ลบไฟล์เทมเพลตที่ไม่ใช้แล้ว (`src/assets/*`, `public/icons.svg`) ต้องถามก่อน
- ฟีเจอร์นอกขอบเขต (ลบ Loan, แจ้งเตือน, เลื่อนกำหนด, รูปภาพ, สำรองข้อมูล) ตาม design ข้อ 10 ให้ทบทวน `CONTEXT.md` ก่อนเพิ่ม

ข้อจำกัดของการตรวจรับ: ตรวจมือถือด้วย iframe จำลองความกว้าง (360 – 390px) ไม่ใช่เครื่องจริง ส่วน component ไม่มีเทสต์อัตโนมัติ (Vitest ครอบคลุมเฉพาะ `src/lib`) ตรวจด้วยมือในเบราว์เซอร์

หมายเหตุ: มี git-manager ตัวหนึ่งเคยรายงานผิดว่า `borrow-buddy` ไม่ใช่ git repository ทั้งที่ `.git` มีอยู่ ให้รัน git ด้วย `git -C "<พาธ borrow-buddy>"` และห้าม `git init`

วิธีทดสอบในเบราว์เซอร์: dev server `npm run dev` ที่ http://localhost:5173/

**เวอร์ชัน 1 (localStorage)**: ใส่ข้อมูลทดสอบผ่าน localStorage คีย์ `borrow-buddy:loans` แล้ว **ล้างข้อมูลทดสอบทุกครั้งหลังตรวจ** (ทั้งคีย์ `borrow-buddy:loans` และ `borrow-buddy:theme`)

**เวอร์ชัน 2 (Supabase)**: ล็อกอินด้วย email + password, ข้อมูลจะถูกเก็บในตาราง `loans` ของ Supabase โดย RLS จะแยกข้อมูลตาม `owner_id`

## โครงโค้ดปัจจุบัน

### เวอร์ชัน 1 (localStorage - เสร็จแล้ว)
`src/lib` (ตรรกะล้วน มีเทสต์): `today` เป็นสตริง ISO `YYYY-MM-DD` ที่ส่งเข้าฟังก์ชันเสมอ
- `loanRules.js`: `STATUS`, `STATUS_LABEL`, `getLoanStatus`, `getDaysOverdue`, `validateLoan`, `groupLoans`, `filterLoansByFriend`, `markReturned`, `unmarkReturned`
- `storage.js`: `loadLoans(storage)` → `{ loans, warning }` อ่านอย่างเดียว, `saveLoans(loans, storage)` → `null` หรือข้อความเตือนไทย (คีย์ `borrow-buddy:loans`)
- `dateFormat.js`: `formatThaiDate(iso)`, `toIsoDate(date)` (วันที่ท้องถิ่น)
- `theme.js`: `getInitialTheme`, `saveTheme`, `toggleTheme`, `THEME` (คีย์ `borrow-buddy:theme`)

`src/components` (ไม่มีเทสต์ ตรวจด้วยมือในเบราว์เซอร์): `LoanForm`, `LoanList`, `LoanItem`, `SearchBox`, `ThemeToggle`

`src/App.jsx`: เก็บ state `loans`, `warning`, `editingId`, `query`, `theme` ทุกการเปลี่ยน Loan ผ่าน `changeLoans` (บันทึกทุกครั้ง) **ไม่ใช้ `useEffect` บันทึก** เพราะจะเขียนรายการว่างทับข้อมูลเสียตอนเปิดหน้า (design ข้อ 8) ธีมตั้งด้วย `useLayoutEffect` บน `data-theme` ของ `<html>`

### เวอร์ชัน 2 (Supabase - กำลังทำ)
`src/lib` (ตรรกะล้วน มีเทสต์):
- `loanRules.js`, `dateFormat.js`, `theme.js` เหมือนเวอร์ชัน 1
- **`db.js` (ใหม่)**: ฟังก์ชัน Supabase - `loadLoans()`, `saveLoans(loans)` ใช้ RLS ผ่าน `supabase.from('loans').select()` และ `.insert()`/`.upsert()`

## ข้อตัดสินใจและสิ่งที่ควรรู้
- `npm test` = `vitest run --passWithNoTests` (จบเองไม่ค้าง watch) มี `npm run test:watch` แยกไว้ให้
- วันที่เก็บเป็นสตริง ISO `YYYY-MM-DD` เทียบด้วยสตริงตรง ๆ ได้
- เวอร์ชัน 1: ฟังก์ชัน storage รับ `storage` เป็นพารามิเตอร์ เพื่อทดสอบด้วย storage จำลองโดยไม่ต้องใช้ jsdom (Vitest ใช้สภาพแวดล้อม node)
- เวอร์ชัน 2: ฟังก์ชัน db ใช้ Supabase Client ที่ตั้งค่า global หรือส่งผ่านพารามิเตอร์ (ขึ้นกับ design ที่เลือก)
- `index.css` (ตัวแปรสี + ธีม `data-theme`) และ `App.css` (สไตล์ component) ถูกเขียนทับจากเทมเพลตแล้ว
- ไฟล์เทมเพลตที่ไม่ถูกใช้แล้ว แต่ยังอยู่: `src/assets/*` (`hero.png`, `react.svg`, `vite.svg`) และ `public/icons.svg` การลบต้องถามผู้ใช้ก่อน
- `package-lock.json` ถูก commit ไว้ ไม่ได้อยู่ใน `.gitignore`
- `src/components/.gitkeep` และ `src/lib/.gitkeep` เก็บไว้ ห้ามลบโดยไม่ถาม
- `oxlint` มากับเทมเพลต (`npm run lint`)
