import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { addEmployee } from "../../services/employeeService"
import "./CreateEmployee.css"

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
    <div className="create-employee__container">
      <div className="create-employee__header">
        <h1>New Employee</h1>
      </div>
      <form onSubmit={handleSubmit} className="create-employee__form">
        <label className="create-employee__label">
          Full Name:
          <input
            type="text"
            name="fullName"
            value={employee.fullName}
            onChange={handleChange}
            required
            className="create-employee__input"
          />
        </label>
        <br />
        <label className="create-employee__label">
          Email:
          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            required
            className="create-employee__input"
          />
        </label>
        <br />
        <label className="create-employee__label">
          Address:
          <input
            type="text"
            name="address"
            value={employee.address}
            onChange={handleChange}
            required
            className="create-employee__input"
          />
        </label>
        <br />
        <label className="create-employee__label">
          Phone:
          <input
            type="text"
            name="phone"
            value={employee.phone}
            onChange={handleChange}
            required
            className="create-employee__input"
          />
        </label>
        <br />
        <label className="create-employee__label create-employee__checkbox-label">
          Admin:
          <input
            type="checkbox"
            name="isAdmin"
            checked={employee.isAdmin}
            onChange={handleChange}
            className="create-employee__checkbox"
          />
        </label>
        <br /> 
        
        <button className="create-employee__submit__button" type="submit">
          Submit
        </button>
      </form>
    </div>
  )
}
