import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./CreateOrder.css";
import { getEmployees } from "../../services/employeeService";
import { Pizza } from "./Pizza";
import {
  createEmployeeOrder,
  deleteEmployeeOrder,
  getAllOrders,
  updateEmployeeOrder,
  updateOrder,
} from "../../services/orderService";
import debounce from "lodash.debounce";
import {
  addPizza,
  getPizzas,
  getPizzasBySize,
} from "../../services/pizzaService";

export const CreateOrder = ({ currentUser }) => {
  const location = useLocation();
  const isCreate = location.pathname.includes("create");
  const navigate = useNavigate();

  let { orderId } = useParams();
  orderId = parseInt(orderId, 10);

  const [order, setOrder] = useState({
    tableNumber: 0,
    date: "",
    tipAmount: 0.0,
    complete: false,
    id: 0,
  });
  const [employees, setEmployees] = useState([]);
  const [delivery, setDelivery] = useState(false);
  const [deliveryDriver, setDeliveryDriver] = useState(null);
  const [loaded, setLoaded] = useState(false); //loaded flag
  const [pizzas, setPizzas] = useState([]);
  const [total, setTotal] = useState(0);
  const [sizePrice, setSizePrice] = useState(0);
  const [toppingPrice, setToppingPrice] = useState(0);

  const updateTotal = () => {
    if (delivery) {
      setTotal(order.tipAmount + sizePrice + toppingPrice + 5);
    } else {
      setTotal(order.tipAmount + sizePrice + toppingPrice);
    }
  };

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

  const handleSubmit = async () => {
    try {
      await updateOrder({ ...order, complete: true }); // Update complete status
      navigate(`/orders/view/${orderId}`); // Navigate to order view
    } catch (error) {
      console.error("Failed to complete order", error);
    }
  };

  const getAndSetSizePrice = async () => {
    const allPizzaSizes = await getPizzasBySize();
    const pizzaIds = new Set(pizzas.map((pizza) => pizza.id)); //creates a Set of pizzaIds for faster lookup
    const filteredPizzaSizes = allPizzaSizes.filter((item) =>
      pizzaIds.has(item.id)
    );
    const sum = filteredPizzaSizes.reduce(
      (accumulator, item) => accumulator + item.size.price,
      0
    );
    setSizePrice(sum);
  };

  const getAndSetPizzas = async () => {
    const pizzaData = await getPizzas();
    const filteredPizzaData = pizzaData.filter(
      (item) => item.orderId === orderId
    );
    setPizzas(filteredPizzaData);
  };

  // // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (!orderId) return; // Skip if no orderId

      const thisOrder = await getAllOrders(orderId);
      setOrder(thisOrder);

      const employeesData = await getEmployees();
      setEmployees(employeesData);

      await getAndSetPizzas();

      setLoaded(true); // Data is loaded
    };

    fetchData();
  }, [orderId]);

  // // Save order after initial data load and only when order changes
  // useEffect for saving the order
  useEffect(() => {
    saveOrder(order);
  }, [order, loaded, pizzas]);

  // useEffect for updating the total
  useEffect(() => {
    updateTotal();
  }, [sizePrice, toppingPrice, order.tipAmount, delivery]);

  const handleDelivery = async (event) => {
    const isDelivery = event.target.value === "true";
    setDelivery(isDelivery);
    setDeliveryDriver(null);

    if (isDelivery) {
      handleTableNumberChange(0);

      // Create a local variable for the delivery driver
      const newDriver = {
        employeeId: 0,
        orderId: orderId,
        tookOrder: false,
      };

      // Create the employee order and set deliveryDriver to the response
      const response = await createEmployeeOrder(newDriver);
      console.log(response);
      setDeliveryDriver(response); // Only set delivery driver after getting response
    } else {
      handleTableNumberChange(1);
      await deleteEmployeeOrder(deliveryDriver.id);
    }
  };

  const handleEmployeeChange = async (event) => {
    const newEmployeeId = parseInt(event.target.value);
    setDeliveryDriver((prev) => {
      const updatedDriver = { ...prev, employeeId: newEmployeeId };
      // Update the employee order after setting the new employeeId
      updateEmployeeOrder(updatedDriver); // Pass updated driver directly
      return updatedDriver;
    });
  };

  const handleTableNumberChange = (valueOrEvent) => {
    const newValue =
      typeof valueOrEvent === "object"
        ? valueOrEvent.target.value
        : valueOrEvent;
    setOrder((prevOrder) => ({
      ...prevOrder,
      tableNumber: parseInt(newValue),
    }));
  };

  const handleTipAmountChange = (event) => {
    let newTipAmount = parseFloat(event.target.value) || 0;
    newTipAmount = newTipAmount;
    setOrder((prevOrder) => ({
      ...prevOrder,
      tipAmount: parseFloat(newTipAmount.toFixed(2)),
    }));
    updateTotal();
  };

  const handleAddPizza = async (event) => {
    event.preventDefault();
    await addPizza({
      sizeId: 1,
      cheeseId: 1,
      sauceId: 1,
      orderId: orderId,
    });
    getAndSetPizzas();
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
                <option value={0}>-- Please choose an option --</option>
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
            value={order.tipAmount}
            onChange={handleTipAmountChange}
            id="tip"
            min="0"
            step="0.01"
          />
        </fieldset>
        <fieldset className="create-order__fieldset">
          <legend>Total:</legend>
          <span className="create-order-total__span">${total}</span>
        </fieldset>
      </div>
      <div className="create-order__form--pizzas">
        {pizzas.map((pizzaObj) => (
          <Pizza
            pizzaObj={pizzaObj}
            key={pizzaObj.id}
            getAndSetPizzas={getAndSetPizzas}
            getAndSetSizePrice={getAndSetSizePrice}
            updateTotal={updateTotal}
            setToppingPrice={setToppingPrice}
            pizzas={pizzas}
          />
        ))}
      </div>
      <div className="create-order__btn-container">
        <button className="btn-primary" onClick={handleAddPizza}>
          Add Pizza
        </button>
        <button className="btn-primary" onClick={handleSubmit}>
          {isCreate ? "Place Order" : "Submit Changes"}
        </button>
      </div>
    </div>
  );
};
