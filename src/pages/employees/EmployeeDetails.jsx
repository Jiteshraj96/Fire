import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import Toast from '../../components/Toast.jsx'
import { deleteEmployee, getEmployeeById } from '../../services/employeeService.js'

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-3">
      <div className="text-sm font-medium text-slate-700">{label}</div>
      <div className="sm:col-span-2">
        <div className="text-sm text-slate-900">{value || <span className="text-slate-400">—</span>}</div>
      </div>
    </div>
  )
}

export default function EmployeeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ type: 'info', message: '' })

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setToast({ type: 'info', message: '' })
      try {
        const emp = await getEmployeeById(id)
        setItem(emp)
        if (!emp) setToast({ type: 'error', message: 'Employee not found.' })
      } catch (e) {
        setToast({ type: 'error', message: e?.message || 'Failed to load employee.' })
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  return (
    <div>
      <PageHeader
        title="Employee Details"
        subtitle="View employee information."
        right={
          <div className="flex gap-2">
            <Link to="/employees">
              <Button variant="secondary">Back</Button>
            </Link>
            {item ? (
              <>
                <Link to={`/employees/${item.id}/edit`}>
                  <Button variant="secondary">Edit</Button>
                </Link>
                <Link to={`/salaries/new?employeeId=${item.id}`}>
                  <Button>Add Salary</Button>
                </Link>
              </>
            ) : null}
          </div>
        }
      />

      <Toast type={toast.type} message={toast.message} />

      {loading ? (
        <div className="rounded-xl bg-slate-50 p-6 text-sm text-slate-600 ring-1 ring-slate-200">Loading...</div>
      ) : !item ? null : (
        <div className="space-y-5">
          <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-slate-900">{item.name}</div>
                <div className="text-sm text-slate-600">{item.employee_code}</div>
              </div>
              <Badge value={item.status} />
            </div>
            <div className="space-y-3">
              <Row label="Email" value={item.email} />
              <Row label="Phone" value={item.phone} />
              <Row label="Department" value={item.department} />
              <Row label="Designation" value={item.designation} />
              <Row label="Joining Date" value={item.joining_date} />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className="text-sm font-medium text-red-600 hover:underline"
              onClick={async () => {
                const ok = window.confirm(`Delete employee "${item.name}"? This will not delete salary records automatically.`)
                if (!ok) return
                try {
                  await deleteEmployee(item.id)
                  navigate('/employees')
                } catch (e) {
                  setToast({ type: 'error', message: e?.message || 'Failed to delete employee.' })
                }
              }}
            >
              Delete Employee
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


