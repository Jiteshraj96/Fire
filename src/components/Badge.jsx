import React from 'react'

const styles = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  inactive: 'bg-slate-100 text-slate-700 ring-slate-200',
}

export default function Badge({ value = 'active' }) {
  const key = String(value).toLowerCase() === 'inactive' ? 'inactive' : 'active'
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles[key]}`}>
      {key}
    </span>
  )
}


