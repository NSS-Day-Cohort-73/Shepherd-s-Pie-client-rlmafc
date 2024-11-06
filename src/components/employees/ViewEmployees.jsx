import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

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
    <div>
      <h1>The Shepard's Pie Family</h1>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            <Link to={`/employees/view/${employee.id}`}>
              {employee.fullName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
