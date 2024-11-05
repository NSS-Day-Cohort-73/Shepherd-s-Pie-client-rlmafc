// GET request to fetch all employees
export const getEmployees = async () => {
  try {
    const response = await fetch("http://localhost:8088/employees");
    const employees = await response.json();
    return employees;
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
};

// POST request to add a new employee
export const addEmployee = async (newEmployee) => {
  try {
    const response = await fetch("http://localhost:8088/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEmployee),
    });
    return response.json();
  } catch (error) {
    console.error("Error adding employee:", error);
  }
};

// PUT request to update an existing employee
export const updateEmployee = async (updatedEmployee) => {
  try {
    const response = await fetch(
      `http://localhost:8088/employees/${updatedEmployee.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEmployee),
      }
    );
    return response.json();
  } catch (error) {
    console.error("Error updating employee:", error);
  }
};

// DELETE request to remove an employee
export const deleteEmployee = async (employeeId) => {
  try {
    await fetch(`http://localhost:8088/employees/${employeeId}`, {
      method: "DELETE",
    });
    console.log(`Employee ${employeeId} deleted.`);
  } catch (error) {
    console.error("Error deleting employee:", error);
  }
};
