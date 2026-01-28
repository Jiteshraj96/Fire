import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/Button.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import Select from '../../components/Select.jsx'
import Table from '../../components/Table.jsx'
import Toast from '../../components/Toast.jsx'
import { listEmployees } from '../../services/employeeService.js'
import { deleteSalary, listSalaries } from '../../services/salaryService.js'

export default function SalaryList() {
  const [employees, setEmployees] = useState([])
  const [items, setItems] = useState([])
  const [employeeId, setEmployeeId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async (opts = {}) => {
    setLoading(true)
    setError('')
    try {
      const [emps, sals] = await Promise.all([listEmployees(), listSalaries(opts)])
      setEmployees(emps)
      setItems(sals)
    } catch (e) {
      setError(e?.message || 'Failed to load salaries.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load({ employeeId: '' })
  }, [])

  useEffect(() => {
    load({ employeeId })
  }, [employeeId])

  const employeeMap = useMemo(() => {
    const map = new Map()
    employees.forEach((e) => map.set(e.id, e))
    return map
  }, [employees])

  const columns = useMemo(
    () => [
      {
        key: 'employee',
        header: 'Employee',
        render: (r) => {
          const emp = employeeMap.get(r.employee_id)
          return (
            <div className="flex flex-col">
              <span className="font-medium text-slate-900">{emp?.name || 'Unknown'}</span>
              <span className="text-xs text-slate-500">{emp?.employee_code || r.employee_id}</span>
            </div>
          )
        },
      },
      { key: 'month', header: 'Month' },
      { key: 'basic_salary', header: 'Basic' },
      { key: 'hra', header: 'HRA' },
      { key: 'allowance', header: 'Allowance' },
      { key: 'deduction', header: 'Deduction' },
      { key: 'net_salary', header: 'Net' },
      {
        key: 'actions',
        header: 'Actions',
        render: (r) => (
          <div className="flex items-center gap-2">
            <Link to={`/salaries/${r.id}/edit`} className="text-sm font-medium text-slate-700 hover:underline">
              Edit
            </Link>
            <button
              className="text-sm font-medium text-red-600 hover:underline"
              onClick={async () => {
                const emp = employeeMap.get(r.employee_id)
                const ok = window.confirm(`Delete salary for "${emp?.name || r.employee_id}" (${r.month})?`)
                if (!ok) return
                try {
                  await deleteSalary(r.id)
                  await load({ employeeId })
                } catch (e) {
                  setError(e?.message || 'Failed to delete salary.')
                }
              }}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [employeeMap, employeeId],
  )

  const rows = items.map((s) => ({ ...s, key: s.id }))

  return (
    <div>
      <PageHeader
        title="Salaries"
        subtitle="Manage monthly salaries linked to employees."
        right={
          <Link to="/salaries/new">
            <Button>Add Salary</Button>
          </Link>
        }
      />

      <Toast type="error" message={error} />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Select label="Filter by Employee" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
          <option value="">All employees</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} ({e.employee_code})
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="rounded-xl bg-slate-50 p-6 text-sm text-slate-600 ring-1 ring-slate-200">Loading...</div>
      ) : (
        <Table columns={columns} rows={rows} emptyText="No salary records yet. Add one for an employee." />
      )}
    </div>
  )
}


