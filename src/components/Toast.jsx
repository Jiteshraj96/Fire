import React from 'react'

export default function Toast({ type = 'info', message }) {
  if (!message) return null
  const styles =
    type === 'error'
      ? 'bg-red-50 text-red-800 ring-red-200'
      : type === 'success'
        ? 'bg-emerald-50 text-emerald-800 ring-emerald-200'
        : 'bg-slate-50 text-slate-800 ring-slate-200'
  return (
    <div className={`mb-4 rounded-xl px-4 py-3 text-sm ring-1 ${styles}`}>
      {message}
    </div>
  )
}


