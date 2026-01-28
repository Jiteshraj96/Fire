import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/Button.jsx'
import Table from '../../components/Table.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import Toast from '../../components/Toast.jsx'
import Badge from '../../components/Badge.jsx'
import { deleteEmployee, listEmployees } from '../../services/employeeService.js'

export default function EmployeeList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listEmployees()
      setItems(data)
    } catch (e) {
      setError(e?.message || 'Failed to load employees.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const columns = useMemo(
    () => [
      { key: 'employee_code', header: 'Code' },
      { key: 'name', header: 'Name' },
      { key: 'department', header: 'Department' },
      { key: 'designation', header: 'Designation' },
      {
        key: 'status',
        header: 'Status',
        render: (r) => <Badge value={r.status} />,
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (r) => (
          <div className="flex items-center gap-2">
            <Link to={`/employees/${r.id}`} className="text-sm font-medium text-slate-700 hover:underline">
              View
            </Link>
            <Link to={`/employees/${r.id}/edit`} className="text-sm font-medium text-slate-700 hover:underline">
              Edit
            </Link>
            <button
              className="text-sm font-medium text-red-600 hover:underline"
              onClick={async () => {
                const ok = window.confirm(`Delete employee "${r.name}"? This will not delete salary records automatically.`)
                if (!ok) return
                try {
                  await deleteEmployee(r.id)
                  await load()
                } catch (e) {
                  setError(e?.message || 'Failed to delete employee.')
                }
              }}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [],
  )

  const rows = items.map((e) => ({ ...e, key: e.id }))

  return (
    <div>
      <PageHeader
        title="Employees"
        subtitle="Create, edit, view, and manage employees."
        right={
          <Link to="/employees/new">
            <Button>Add Employee</Button>
          </Link>
        }
      />

      <Toast type="error" message={error} />

      {loading ? (
        <div className="rounded-xl bg-slate-50 p-6 text-sm text-slate-600 ring-1 ring-slate-200">Loading...</div>
      ) : (
        <Table columns={columns} rows={rows} emptyText="No employees yet. Add your first employee." />
      )}
    </div>
  )
}


