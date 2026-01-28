import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import EmployeeList from '../pages/employees/EmployeeList.jsx'
import EmployeeForm from '../pages/employees/EmployeeForm.jsx'
import EmployeeDetails from '../pages/employees/EmployeeDetails.jsx'
import SalaryList from '../pages/salaries/SalaryList.jsx'
import SalaryForm from '../pages/salaries/SalaryForm.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/employees" replace />} />

        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/employees/new" element={<EmployeeForm mode="create" />} />
        <Route path="/employees/:id" element={<EmployeeDetails />} />
        <Route path="/employees/:id/edit" element={<EmployeeForm mode="edit" />} />

        <Route path="/salaries" element={<SalaryList />} />
        <Route path="/salaries/new" element={<SalaryForm mode="create" />} />
        <Route path="/salaries/:id/edit" element={<SalaryForm mode="edit" />} />
      </Route>

      <Route path="*" element={<Navigate to="/employees" replace />} />
    </Routes>
  )
}


