import React from 'react'

export default function Select({
  label,
  error,
  hint,
  className = '',
  wrapperClassName = '',
  children,
  ...props
}) {
  return (
    <div className={wrapperClassName}>
      {label ? <label className="field-label">{label}</label> : null}
      <select
        className={`w-full rounded-lg bg-white px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-slate-400 ${className}`}
        {...props}
      >
        {children}
      </select>
      {error ? <div className="field-error">{error}</div> : hint ? <div className="field-hint">{hint}</div> : null}
    </div>
  )
}


