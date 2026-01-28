import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Button from '../../components/Button.jsx'
import Input from '../../components/Input.jsx'
import Select from '../../components/Select.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import Toast from '../../components/Toast.jsx'
import { listEmployees } from '../../services/employeeService.js'
import { calcNetSalary, createSalary, getSalaryById, updateSalary } from '../../services/salaryService.js'

function validate(values) {
  const errors = {}
  if (!values.employee_id) errors.employee_id = 'Employee is required.'
  if (!values.month) errors.month = 'Month is required.'
  return errors
}

export default function SalaryForm({ mode }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()

  const [employees, setEmployees] = useState([])
  const [values, setValues] = useState({
    employee_id: searchParams.get('employeeId') || '',
    basic_salary: 0,
    hra: 0,
    allowance: 0,
    deduction: 0,
    month: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ type: 'info', message: '' })

  const net = useMemo(() => calcNetSalary(values), [values])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setToast({ type: 'info', message: '' })
      try {
        const emps = await listEmployees()
        setEmployees(emps)

        if (mode === 'edit') {
          const sal = await getSalaryById(id)
          if (!sal) {
            setToast({ type: 'error', message: 'Salary record not found.' })
            return
          }
          setValues({
            employee_id: sal.employee_id || '',
            basic_salary: sal.basic_salary ?? 0,
            hra: sal.hra ?? 0,
            allowance: sal.allowance ?? 0,
            deduction: sal.deduction ?? 0,
            month: sal.month || '',
          })
        }
      } catch (e) {
        setToast({ type: 'error', message: e?.message || 'Failed to load form.' })
      } finally {
        setLoading(false)
      }
    })()
  }, [mode, id])

  const title = mode === 'edit' ? 'Edit Salary' : 'Add Salary'

  const onSubmit = async (e) => {
    e.preventDefault()
    const v = validate(values)
    setErrors(v)
    if (Object.keys(v).length) return

    setSaving(true)
    setToast({ type: 'info', message: '' })
    try {
      if (mode === 'edit') {
        await updateSalary(id, values)
        navigate('/salaries')
      } else {
        await createSalary(values)
        navigate('/salaries')
      }
    } catch (err) {
      setToast({ type: 'error', message: err?.message || 'Failed to save salary.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={title}
        subtitle="Net salary is calculated automatically."
        right={
          <Link to="/salaries">
            <Button variant="secondary">Back</Button>
          </Link>
        }
      />

      <Toast type={toast.type} message={toast.message} />

      {loading ? (
        <div className="rounded-xl bg-slate-50 p-6 text-sm text-slate-600 ring-1 ring-slate-200">Loading...</div>
      ) : (
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Employee"
            value={values.employee_id}
            onChange={(e) => setValues((s) => ({ ...s, employee_id: e.target.value }))}
            error={errors.employee_id}
          >
            <option value="">Select employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.employee_code})
              </option>
            ))}
          </Select>

          <Input
            label="Month"
            type="month"
            value={values.month}
            onChange={(e) => setValues((s) => ({ ...s, month: e.target.value }))}
            error={errors.month}
            hint="Format: YYYY-MM"
          />

          <Input
            label="Basic Salary"
            type="number"
            value={values.basic_salary}
            onChange={(e) => setValues((s) => ({ ...s, basic_salary: e.target.value }))}
            min="0"
            step="0.01"
          />
          <Input
            label="HRA"
            type="number"
            value={values.hra}
            onChange={(e) => setValues((s) => ({ ...s, hra: e.target.value }))}
            min="0"
            step="0.01"
          />
          <Input
            label="Allowance"
            type="number"
            value={values.allowance}
            onChange={(e) => setValues((s) => ({ ...s, allowance: e.target.value }))}
            min="0"
            step="0.01"
          />
          <Input
            label="Deduction"
            type="number"
            value={values.deduction}
            onChange={(e) => setValues((s) => ({ ...s, deduction: e.target.value }))}
            min="0"
            step="0.01"
          />

          <div className="sm:col-span-2">
            <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="text-sm text-slate-600">Net Salary</div>
              <div className="text-2xl font-semibold text-slate-900">{Number(net || 0).toFixed(2)}</div>
              <div className="field-hint">Calculated: basic + hra + allowance − deduction</div>
            </div>
          </div>

          <div className="mt-2 flex gap-2 sm:col-span-2">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : mode === 'edit' ? 'Update Salary' : 'Create Salary'}
            </Button>
            <Link to="/salaries">
              <Button variant="secondary">Cancel</Button>
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}


