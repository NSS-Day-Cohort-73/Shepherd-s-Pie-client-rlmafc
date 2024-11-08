import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { addEmployee } from "../../services/employeeService"

export const CreateEmployee = () => {
  const navigate = useNavigate()

  const [employee, setEmployee] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    isAdmin: false,
  })

  const [error, setError] = useState(null)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setEmployee((editEmployee) => ({
      ...editEmployee,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await addEmployee(employee)
      navigate("/employees/view")
    } catch (error) {
      setError("Failed to create employee.")
    }
  }
  return (
    <div>
      <h1>New Employee</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={employee.fullName}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={employee.address}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={employee.phone}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Admin:
          <input
            type="checkbox"
            name="isAdmin"
            checked={employee.isAdmin}
            onChange={handleChange}
          />
        </label>
        <br />
        <div className="create-employee-submit-btn">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}
