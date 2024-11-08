import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "./ViewEmployees.css"

export const ViewEmployees = ({ currentUser }) => {
  const [employees, setEmployees] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const getAllEmployees = async () => {
      try {
        const response = await fetch("http://localhost:8088/employees")
        if (!response.ok) {
          throw new Error("Failed to fetch employees")
        }
        const allEmployees = await response.json()
        setEmployees(allEmployees)
      } catch (error) {
        setError(error.message)
      }
    }
    getAllEmployees()
  }, [])
  if (error) {
    return <p>Error: {error}</p>
  }
  if (employees.length === 0) {
    return <p>No employees found.</p>
  }
  return (
    <div className="view-employees__container">
      <div className="view-employees__header">
        <h1>The Shepherd's Pie Family</h1>
      </div>
      <div>
        <ul className="employee-list">
          {employees.map((employee) => (
            <li key={employee.id} className="employee-list__item">
              <Link
                to={`/employees/view/${employee.id}`}
                className="employee-link"
              >
                {employee.fullName}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
