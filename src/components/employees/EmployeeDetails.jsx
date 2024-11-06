import { useEffect, useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import { AdminNavBar } from "../navbars/AdminNavBar"

export const EmployeeDetails = () => {
  // get employeeId from the url
  const { employeeId } = useParams()
  // state to hold fetch
  const [employee, setEmployee] = useState(null)
  // error if fetch fails
  const [error, setError] = useState(null)

  useEffect(() => {
    const getEmployeeDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8088/employees/${employeeId}`
        )
        if (!response.ok) {
          throw new Error("Failed to get employee details")
        }
        const details = await response.json()
        setEmployee(details)
      } catch (error) {
        setError(error.message)
      }
    }

    getEmployeeDetails()
  }, [employeeId]) //dependency array to trigger when employeeId changes

  // handle delete employee
  // const handleDeleteEmployee = async () => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8088/employees/${employeeId}`,
  //       {
  //         method: "DELETE",
  //       }
  //     )
  //     if (!response.ok) {
  //       throw new Error("Failed to delete employee")
  //     }

  //     Navigate("/employees/view") //insert route
  //   } catch (error) {
  //     setError(error.message)
  //   }

  // const handleEditEmployee = () => {
  //   Navigate(`/employees/edit/employeeId`)
  // }

  if (error) {
    return <p>{error}</p>
  }
  if (!employee) {
    return <p>Loading...</p>
  }
  return (
    <div>
      <AdminNavBar />
      <div className="employee-details-container">
        <h1>Employee Details</h1>
        <h2>{employee.fullName}</h2>
        <p>Email: {employee.email}</p>
        <p>Address: {employee.address}</p>
        <p>Phone: {employee.phone}</p>
      </div>
      <div className="employee-details-delete-btn">
        <button
        // onClick={handleDeleteEmployee}
        >
          Delete
        </button>
      </div>
      <div className="employee-details-edit-btn">
        <button
        // onClick={handleEditEmployee}
        >
          Edit
        </button>
      </div>
    </div>
  )
}
// }
