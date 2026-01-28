import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
  }`

export default function Layout() {
  return (
    <div className="min-h-full">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <div className="mb-4">
              <div className="text-sm font-semibold text-slate-900">Employee Admin</div>
              <div className="text-xs text-slate-500">Firestore CRUD</div>
            </div>
            <nav className="flex flex-col gap-1">
              <NavLink to="/employees" className={navLinkClass}>
                Employees
              </NavLink>
              <NavLink to="/salaries" className={navLinkClass}>
                Salaries
              </NavLink>
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-4 lg:hidden">
            <div className="flex gap-2 overflow-x-auto rounded-2xl bg-white p-2 ring-1 ring-slate-200">
              <NavLink to="/employees" className={navLinkClass}>
                Employees
              </NavLink>
              <NavLink to="/salaries" className={navLinkClass}>
                Salaries
              </NavLink>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}


