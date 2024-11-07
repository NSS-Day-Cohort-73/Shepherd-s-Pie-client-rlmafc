import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./CreateOrder.css";
import { getEmployees } from "../../services/employeeService";
import { Pizza } from "./Pizza";
import { getAllOrders, updateOrder } from "../../services/orderService";
import debounce from "lodash.debounce";

export const CreateOrder = ({ currentUser }) => {
  const location = useLocation();
  const isCreate = location.pathname.includes("create");

  let { orderId } = useParams();
  orderId = parseInt(orderId, 10);

  const [order, setOrder] = useState({
    // id: null,
    // tableNumber: 1,
    // date: "",
    // tipAmount: 0,
    // complete: false,
  });
  const [employees, setEmployees] = useState([]);
  const [delivery, setDelivery] = useState(false);
  const [deliveryDriver, setDeliveryDriver] = useState(null);
  const [loaded, setLoaded] = useState(false); // New loaded flag

  const saveOrder = debounce(async (order) => {
    if (loaded) {
      try {
        await updateOrder(order);
        console.log("Order auto-saved");
      } catch (error) {
        console.error("Failed to save order", error);
      }
    }
  }, 1000);

  // // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (!orderId) return; // Skip if no orderId

      const thisOrder = await getAllOrders(orderId);
      setOrder(thisOrder);

      const employeesData = await getEmployees();
      setEmployees(employeesData);

      setLoaded(true); // Data is loaded
    };

    fetchData();
  }, [orderId]);

  // // Save order after initial data load and only when order changes
  useEffect(() => {
    //   if (!loaded || !order.id) return; // Only save if data is loaded and order.id exists

    saveOrder(order);
    //   return () => saveOrder.cancel();
  }, [order, loaded]);

  const handleDelivery = (event) => {
    setDelivery(event.target.value === "true");
    setDeliveryDriver(null);
  };

  const handleEmployeeChange = (event) => {
    setDeliveryDriver({
      employeeId: event.target.value,
      orderId: order.id,
      tookOrder: false,
    });
  };

  const handleTableNumberChange = (event) => {
    const newTableNumber = parseInt(event.target.value) || 1;
    setOrder((prevOrder) => ({
      ...prevOrder,
      tableNumber: newTableNumber,
    }));
  };

  return (
    <div className="create-order__container">
      <h2>{isCreate ? "Create Order" : "Edit Order"}</h2>
      <div className="create-order__form--order">
        <fieldset className="create-order__fieldset">
          <legend>Delivery</legend>

          <label>
            <input
              type="radio"
              name="delivery"
              checked={delivery === true}
              value="true"
              onChange={handleDelivery}
            />
            Yes
          </label>

          <label>
            <input
              type="radio"
              name="delivery"
              checked={delivery === false}
              value="false"
              onChange={handleDelivery}
            />
            No
          </label>
        </fieldset>

        <fieldset className="create-order__fieldset">
          <legend>
            {delivery ? (
              currentUser.isAdmin ? (
                <label htmlFor="employeeId">Assign a Driver</label>
              ) : (
                "Only administrators may assign drivers."
              )
            ) : (
              <label htmlFor="table">Select a table</label>
            )}
          </legend>
          {delivery ? (
            currentUser.isAdmin ? (
              <select onChange={handleEmployeeChange} id="employeeId">
                <option value="">-- Please choose an option --</option>
                {employees.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.fullName}
                  </option>
                ))}
              </select>
            ) : (
              ""
            )
          ) : (
            <input
              type="number"
              value={order.tableNumber || 1}
              onChange={handleTableNumberChange}
              id="table"
              min={1}
              max={12}
            />
          )}
        </fieldset>

        <fieldset className="create-order__fieldset">
          <legend>Tip</legend>

          <input
            className="create-order__input--money"
            type="number"
            id="tip"
            min="0"
            step="0.01"
          />
        </fieldset>
        <div className="create-order__fieldset">
          <p>Total:</p>
          $0.00
        </div>
      </div>
      <div className="create-order__form--pizzas">
        <Pizza />
      </div>
      <div className="create-order__btn-container">
        <button className="btn-primary">Add Pizza</button>
        <button className="btn-primary">Place Order</button>
      </div>
    </div>
  );
};
