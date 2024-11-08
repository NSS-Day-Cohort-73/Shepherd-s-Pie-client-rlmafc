// fetch orders
export const getAllOrders = async (orderId) => {
  const url = orderId
    ? `http://localhost:8088/orders/${orderId}`
    : "http://localhost:8088/orders";

  try {
    const response = await fetch(url);
    const orders = await response.json();
    return orders;
  } catch (error) {
    console.error("Error fetching orders", error);
  }
};

// adding new order
export const createOrder = async (newOrder) => {
  try {
    const response = await fetch("http://localhost:8088/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    });
    return response.json();
  } catch (error) {
    console.error("Error creating order", error);
  }
};
// updating order
export const updateOrder = async (updatedOrder) => {
  try {
    const response = await fetch(
      `http://localhost:8088/orders/${updatedOrder.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedOrder),
      }
    );
    return response.json();
  } catch (error) {
    console.error("Error updating order", error);
  }
};
// deleting order
export const deleteOrder = async (orderId) => {
  try {
    await fetch(`http://localhost:8088/orders/${orderId}`, {
      method: "DELETE",
    });
    console.log(`Order ${orderId} deleted.`);
  } catch (error) {
    console.error("Error deleting order", error);
  }
};

export const getAllEmployeeOrders = async () => {
  try {
    const response = await fetch(
      `http://localhost:8088/employeeOrders?_expand=order&_expand=employee`
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching employeeOrders.", error);
  }
};

export const createEmployeeOrder = async (newEmployeeOrder) => {
  try {
    const response = await fetch("http://localhost:8088/employeeorders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmployeeOrder),
    });
    const newObject = await response.json();
    console.log(newObject)
    return newObject;
  } catch (error) {
    console.error("Error creating order", error);
  }
};

export const getEmployeeOrdersByOrderId = async (orderId) => {
  try {
    const response = await fetch(
      `http://localhost:8088/employeeOrders?orderId=${orderId}&_expand=employee`
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching employeeOrders.", error);
  }
};

// updating Employee Order
export const updateEmployeeOrder = async (updatedEmployeeOrder) => {
  try {
    const response = await fetch(
      `http://localhost:8088/employeeorders/${updatedEmployeeOrder.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEmployeeOrder),
      }
    );
    return response.json();
  } catch (error) {
    console.error("Error updating order", error);
  }
};

// deleting Employee Order
export const deleteEmployeeOrder = async (employeeOrderId) => {
  try {
    await fetch(`http://localhost:8088/employeeorders/${employeeOrderId}`, {
      method: "DELETE",
    });
    console.log(`EmployeeOrder ${employeeOrderId} deleted.`);
  } catch (error) {
    console.error("Error deleting Employeeorder", error);
  }
};
