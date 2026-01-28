import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase/firebase.js'

function requireDb() {
  if (!db) throw new Error('Firebase is not configured. Add VITE_FIREBASE_* variables to .env.local and restart the dev server.')
}

const col = () => {
  requireDb()
  return collection(db, 'salaries')
}

export function calcNetSalary({ basic_salary, hra, allowance, deduction }) {
  const b = Number(basic_salary || 0)
  const h = Number(hra || 0)
  const a = Number(allowance || 0)
  const d = Number(deduction || 0)
  return b + h + a - d
}

export async function listSalaries({ employeeId } = {}) {
  requireDb()

  let q
  if (employeeId) {
    // Keep it simple so Firestore doesn't require a composite index.
    q = query(col(), where('employee_id', '==', employeeId))
  } else {
    q = query(col(), orderBy('created_at', 'desc'))
  }

  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getSalaryById(id) {
  requireDb()
  const ref = doc(db, 'salaries', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function createSalary(payload) {
  requireDb()
  const net = calcNetSalary(payload)
  const data = {
    employee_id: payload.employee_id || '',
    basic_salary: Number(payload.basic_salary || 0),
    hra: Number(payload.hra || 0),
    allowance: Number(payload.allowance || 0),
    deduction: Number(payload.deduction || 0),
    net_salary: Number(net || 0),
    month: payload.month || '', // YYYY-MM
    created_at: serverTimestamp(),
  }
  const res = await addDoc(col(), data)
  return res.id
}

export async function updateSalary(id, payload) {
  requireDb()
  const ref = doc(db, 'salaries', id)
  const net = calcNetSalary(payload)
  const data = {
    employee_id: payload.employee_id || '',
    basic_salary: Number(payload.basic_salary || 0),
    hra: Number(payload.hra || 0),
    allowance: Number(payload.allowance || 0),
    deduction: Number(payload.deduction || 0),
    net_salary: Number(net || 0),
    month: payload.month || '',
  }
  await updateDoc(ref, data)
}

export async function deleteSalary(id) {
  requireDb()
  const ref = doc(db, 'salaries', id)
  await deleteDoc(ref)
}


