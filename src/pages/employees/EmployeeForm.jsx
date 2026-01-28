import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button.jsx'
import Input from '../../components/Input.jsx'
import Select from '../../components/Select.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import Toast from '../../components/Toast.jsx'
import { createEmployee, getEmployeeById, updateEmployee } from '../../services/employeeService.js'

function validate(values) {
  const errors = {}
  if (!values.employee_code?.trim()) errors.employee_code = 'Employee code is required.'
  if (!values.name?.trim()) errors.name = 'Name is required.'
  if (!values.email?.trim()) errors.email = 'Email is required.'
  return errors
}

export default function EmployeeForm({ mode }) {
  const navigate = useNavigate()
  const { id } = useParams()

  const [values, setValues] = useState({
    employee_code: '',
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    joining_date: '',
    status: 'active',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ type: 'info', message: '' })

  useEffect(() => {
    if (mode !== 'edit') return
    ;(async () => {
      setLoading(true)
      setToast({ type: 'info', message: '' })
      try {
        const emp = await getEmployeeById(id)
        if (!emp) {
          setToast({ type: 'error', message: 'Employee not found.' })
          return
        }
        setValues({
          employee_code: emp.employee_code || '',
          name: emp.name || '',
          email: emp.email || '',
          phone: emp.phone || '',
          department: emp.department || '',
          designation: emp.designation || '',
          joining_date: emp.joining_date || '',
          status: emp.status || 'active',
        })
      } catch (e) {
        setToast({ type: 'error', message: e?.message || 'Failed to load employee.' })
      } finally {
        setLoading(false)
      }
    })()
  }, [mode, id])

  const title = mode === 'edit' ? 'Edit Employee' : 'Add Employee'
  const subtitle = mode === 'edit' ? 'Update employee details.' : 'Create a new employee record.'

  const canSubmit = useMemo(() => !saving, [saving])

  const onSubmit = async (e) => {
    e.preventDefault()
    const v = validate(values)
    setErrors(v)
    if (Object.keys(v).length) return

    setSaving(true)
    setToast({ type: 'info', message: '' })
    try {
      if (mode === 'edit') {
        await updateEmployee(id, values)
        navigate(`/employees/${id}`)
      } else {
        const newId = await createEmployee(values)
        navigate(`/employees/${newId}`)
      }
    } catch (err) {
      setToast({ type: 'error', message: err?.message || 'Failed to save employee.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        right={
          <Link to="/employees">
            <Button variant="secondary">Back</Button>
          </Link>
        }
      />

      <Toast type={toast.type} message={toast.message} />

      {loading ? (
        <div className="rounded-xl bg-slate-50 p-6 text-sm text-slate-600 ring-1 ring-slate-200">Loading...</div>
      ) : (
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Employee Code"
            value={values.employee_code}
            onChange={(e) => setValues((s) => ({ ...s, employee_code: e.target.value }))}
            error={errors.employee_code}
            placeholder="EMP-001"
          />
          <Input
            label="Name"
            value={values.name}
            onChange={(e) => setValues((s) => ({ ...s, name: e.target.value }))}
            error={errors.name}
            placeholder="John Doe"
          />
          <Input
            label="Email"
            type="email"
            value={values.email}
            onChange={(e) => setValues((s) => ({ ...s, email: e.target.value }))}
            error={errors.email}
            placeholder="john@company.com"
          />
          <Input
            label="Phone"
            value={values.phone}
            onChange={(e) => setValues((s) => ({ ...s, phone: e.target.value }))}
            placeholder="+1 555 123 4567"
          />
          <Input
            label="Department"
            value={values.department}
            onChange={(e) => setValues((s) => ({ ...s, department: e.target.value }))}
            placeholder="Engineering"
          />
          <Input
            label="Designation"
            value={values.designation}
            onChange={(e) => setValues((s) => ({ ...s, designation: e.target.value }))}
            placeholder="Software Engineer"
          />
          <Input
            label="Joining Date"
            type="date"
            value={values.joining_date}
            onChange={(e) => setValues((s) => ({ ...s, joining_date: e.target.value }))}
          />
          <Select
            label="Status"
            value={values.status}
            onChange={(e) => setValues((s) => ({ ...s, status: e.target.value }))}
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </Select>

          <div className="mt-2 flex gap-2 sm:col-span-2">
            <Button type="submit" disabled={!canSubmit}>
              {saving ? 'Saving...' : mode === 'edit' ? 'Update Employee' : 'Create Employee'}
            </Button>
            <Link to="/employees">
              <Button variant="secondary">Cancel</Button>
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}


