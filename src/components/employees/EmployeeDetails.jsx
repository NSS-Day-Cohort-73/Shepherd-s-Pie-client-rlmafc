import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { deleteEmployee, getEmployees } from "../../services/employeeService"
import "./EmployeeDetails.css"

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
      <div className="employee-details__container">
        <div className="employee-details__header">
          <h1>Employee Details</h1>
        </div>
        <div className="employee-details__info">
          <h2>{employee.fullName}</h2>
          <p>Email: {employee.email}</p>
          <p>Address: {employee.address}</p>
          <p>Phone: {employee.phone}</p>
        </div>
      </div>
      <div className="employee-details__buttons">
        <button
          onClick={handleEditEmployee}
          className="employee-details__edit__btn"
        >
          Edit
        </button>
        <button
          onClick={handleDeleteEmployee}
          className="employee-details__delete__btn"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
