import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { deleteEmployee, getEmployees } from "../../services/employeeService"

export const EmployeeDetails = () => {
  // get employeeId from the url
  const { employeeId } = useParams()
  const navigate = useNavigate()
  // state to hold fetch
  const [employee, setEmployee] = useState(null)
  // error if fetch fails
  const [error, setError] = useState(null)

  useEffect(() => {
    const getEmployeeDetails = async () => {
      try {
        const employeeData = await getEmployees(employeeId)
        setEmployee(employeeData)
      } catch (error) {
        setError(error.message)
      }
    }
    getEmployeeDetails()
  }, [employeeId])

  // handle delete employee
  const handleDeleteEmployee = async () => {
    try {
      await deleteEmployee(employeeId)
      navigate("/employees/view")
    } catch (error) {
      setError("Failed to delete employee.")
    }
  }
  // handle edit employee
  const handleEditEmployee = () => {
    navigate(`/employee/edit/${employee.id}`)
  }

  if (error) {
    return <p>{error}</p>
  }
  if (!employee) {
    return <p>Loading...</p>
  }
  return (
    <div>
      <div className="employee-details-container">
        <h1>Employee Details</h1>
        <h2>{employee.fullName}</h2>
        <p>Email: {employee.email}</p>
        <p>Address: {employee.address}</p>
        <p>Phone: {employee.phone}</p>
      </div>
      <div className="employee-details-edit-btn">
        <button onClick={handleEditEmployee}>Edit</button>
      </div>
      <div className="employee-details-delete-btn">
        <button onClick={handleDeleteEmployee}>Delete</button>
      </div>
    </div>
  )
}
