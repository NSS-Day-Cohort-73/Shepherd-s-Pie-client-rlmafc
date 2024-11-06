// fetch orders
export const getAllOrders = async () => {
  try {
    const response = await fetch("http://localhost:8088/orders")
    const orders = await response.json()
    return orders
  } catch (error) {
    console.error("Error fetching orders", error)
  }
}
// adding new order
export const createOrder = async (newOrder) => {
  try {
    const response = await fetch("http://localhost:8088/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    })
    return response.json()
  } catch (error) {
    console.error("Error creating order", error)
  }
}
// updating order
export const updateOrder = async (updatedOrder) => {
  try {
    const response = await fetch(`http://localhost:8088/orders/${updatedOrder.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedOrder),
    })
    return response.json()
  } catch (error) {
    console.error("Error updating order", error)
  }
}
// deleting order
export const deleteOrder = async (orderId) => {
  try {
    await fetch(`http://localhost:8088/orders/${orderId}`, {
      method: "DELETE",
    })
    console.log("Order ${orderId} deleted.")
  } catch (error) {
    console.error("Error deleting order", error)
  }
}

export const getAllEmployeeOrders = async () => {
    try {
        const response = await fetch(`http://localhost:8088/employeeOrders?_expand=order&_expand=employee`)
        return response.json()
    } catch (error) {
        console.error("Error fetching employeeOrders.", error)
    }
}
