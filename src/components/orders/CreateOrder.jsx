import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./CreateOrder.css";
import { getEmployees } from "../../services/employeeService";
import { Pizza } from "./Pizza";

export const CreateOrder = ({ currentUser }) => {
  // Just a quick note that we'll have to check if useParams is false when creating the employeeOrders entry for the person taking the order
  const [delivery, setDelivery] = useState(false);
  const { orderId } = useParams();
  const [order, setOrder] = useState({});
  const [employees, setEmployees] = useState([]);
  const [deliveryDriver, setDeliveryDriver] = useState(null);
  const [tableNumber, setTableNumber] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setOrder({
        tableNumber: 0,
        date: new Date(),
        tipAmount: 0.0,
        complete: false,
      });

      const employeesData = await getEmployees();
      setEmployees(employeesData);
    };

    fetchData();
  }, []);

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

  return (
    <div className="create-order__container">
      <h2>{!orderId ? "Create Order" : "Edit Order"}</h2>
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
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
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
            step="0.01" // Allows decimal values for cents
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
