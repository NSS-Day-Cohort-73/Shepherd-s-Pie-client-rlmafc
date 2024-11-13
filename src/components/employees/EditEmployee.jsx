import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getEmployees, updateEmployee } from "../../services/employeeService"
import "./EditEmployee.css"

export const EditEmployee = () => {
  const { employeeId } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [employee, setEmployee] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    isAdmin: false,
  })

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const info = await getEmployees(employeeId)
        setEmployee(info)
      } catch (error) {
        setError("Failed to load employee details.")
      }
    }
    fetchEmployee()
  }, [employeeId])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await updateEmployee(employee)
      navigate(`/employees/view/${employee.id}`)
    } catch (error) {
      setError("Failed to update employee.")
    }
  }

  return (
    <div className="edit-employee__container">
      <div className="edit-employee__header">
        <h1>Edit Employee</h1>
      </div>
      <form onSubmit={handleSubmit} className="edit-employee__form">
        <label className="edit-employee__label">
          Full Name:
          <input
            type="text"
            name="fullName"
            value={employee.fullName}
            onChange={handleChange}
            required
            className="edit-employee__input"
          />
        </label>
        <br />
        <label className="edit-employee__label">
          Email:
          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            required
            className="edit-employee__input"
          />
        </label>
        <br />
        <label className="edit-employee__label">
          Address:
          <input
            type="text"
            name="address"
            value={employee.address}
            onChange={handleChange}
            required
            className="edit-employee__input"
          />
        </label>
        <br />
        <label className="edit-employee__label">
          Phone:
          <input
            type="text"
            name="phone"
            value={employee.phone}
            onChange={handleChange}
            required
            className="edit-employee__input"
          />
        </label>
        <br />
        <label className="edit-employee__label edit-employee__checkbox-label">
          Admin:
          <input
            type="checkbox"
            name="isAdmin"
            checked={employee.isAdmin}
            onChange={handleChange}
            className="edit-employee__checkbox"
          />
        </label>
        <br />
        <button type="submit" className="edit-employee__submit__button">
          Save Changes
        </button>
      </form>
    </div>
  )
}
