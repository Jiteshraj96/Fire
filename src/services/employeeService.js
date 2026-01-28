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
} from 'firebase/firestore'
import { db } from '../firebase/firebase.js'

function requireDb() {
  if (!db) throw new Error('Firebase is not configured. Add VITE_FIREBASE_* variables to .env.local and restart the dev server.')
}

const col = () => {
  requireDb()
  return collection(db, 'employees')
}

export async function listEmployees() {
  requireDb()
  const q = query(col(), orderBy('created_at', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getEmployeeById(id) {
  requireDb()
  const ref = doc(db, 'employees', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function createEmployee(payload) {
  requireDb()
  const data = {
    employee_code: payload.employee_code?.trim() || '',
    name: payload.name?.trim() || '',
    email: payload.email?.trim() || '',
    phone: payload.phone?.trim() || '',
    department: payload.department?.trim() || '',
    designation: payload.designation?.trim() || '',
    joining_date: payload.joining_date || '',
    status: payload.status || 'active',
    created_at: serverTimestamp(),
  }
  const res = await addDoc(col(), data)
  return res.id
}

export async function updateEmployee(id, payload) {
  requireDb()
  const ref = doc(db, 'employees', id)
  const data = {
    employee_code: payload.employee_code?.trim() || '',
    name: payload.name?.trim() || '',
    email: payload.email?.trim() || '',
    phone: payload.phone?.trim() || '',
    department: payload.department?.trim() || '',
    designation: payload.designation?.trim() || '',
    joining_date: payload.joining_date || '',
    status: payload.status || 'active',
  }
  await updateDoc(ref, data)
}

export async function deleteEmployee(id) {
  requireDb()
  const ref = doc(db, 'employees', id)
  await deleteDoc(ref)
}


