import { AdminNavBar } from "../components/navbars/AdminNavBar"
import React from "react"
import { Outlet, Route, Routes } from "react-router-dom"
import { Welcome } from "../components/welcome/Welcome"
import { ViewOrders } from "../components/orders/ViewOrders"
import { OrderDetails } from "../components/orders/OrderDetails"
import { CreateOrder } from "../components/orders/CreateOrder"
import { ViewEmployees } from "../components/employees/ViewEmployees"
import { EmployeeDetails } from "../components/employees/EmployeeDetails"
import { CreateEmployee } from "../components/employees/CreateEmployee"
import { Reports } from "../components/reports/Reports"
import { EditEmployee } from "../components/employees/EditEmployee"

export const AdminViews = ({ currentUser }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <AdminNavBar currentUser={currentUser} />
            <Outlet />
            {/* Outlet will render the index route or other nested routes */}
          </>
        }
      >
        {/* Index route for the home page */}
        <Route index element={<Welcome />} />

        {/* Other nested routes */}
        <Route path="orders/view">
          <Route index element={<ViewOrders currentUser={currentUser} />} />
          <Route
            path=":orderId"
            element={<OrderDetails currentUser={currentUser} />}
          />
        </Route>
        <Route
          path="orders/create/:orderId"
          element={<CreateOrder currentUser={currentUser} />}
        />
        <Route path="orders/edit/:orderId" element={<CreateOrder />} />

        {/* Admin only Routes:   */}
        <Route path="employees/view">
          <Route index element={<ViewEmployees currentUser={currentUser} />} />
          <Route
            path=":employeeId"
            element={<EmployeeDetails currentUser={currentUser} />}
          />
        </Route>
        <Route
          path="employees/create"
          element={<CreateEmployee currentUser={currentUser} />}
        />
        <Route
          path="employee/edit/:employeeId"
          element={<EditEmployee currentUser={currentUser} />}
        />
        <Route path="reports" element={<Reports currentUser={currentUser} />} />
      </Route>
    </Routes>
  )
}
