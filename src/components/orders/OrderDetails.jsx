// /orders/view/:orderId

import { useEffect, useState } from "react";
import "./OrderDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteOrder,
  getAllOrders,
  getEmployeeOrdersByOrderId,
} from "../../services/orderService";
import {
  getPizzasByOrderId,
  getPizzasBySize,
} from "../../services/pizzaService";
import { PizzaInfo } from "./PizzaInfo";
import { getExpandedPizzaToppings } from "../../services/toppingService";

export const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState({});
  const [pizzas, setPizzas] = useState([]);
  const [employeeOrders, setEmployeeOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getAllOrders(orderId).then((order) => {
      setOrder(order);
    });
    getEmployeeOrdersByOrderId(orderId).then((empOrderArray) => {
      setEmployeeOrders(empOrderArray);
    });
    getPizzasByOrderId(orderId).then((pizzasArray) => {
      setPizzas(pizzasArray);
    });
  }, [orderId]);

  const toppingCalculations = async () => {
    const expandedPizzaToppings = await getExpandedPizzaToppings();
    const filteredExpandedPizzaToppings = expandedPizzaToppings.filter((item) =>
      pizzas.some((thisPizza) => item.pizza && thisPizza.id === item.pizza.id)
    );
    const totalToppingPrice = filteredExpandedPizzaToppings.reduce(
      (accumulator, item) => accumulator + item.topping.price,
      0
    );
    return totalToppingPrice;
  };

  const getSizePrice = async () => {
    const allPizzaSizes = await getPizzasBySize();
    const pizzaIds = new Set(pizzas.map((pizza) => pizza.id)); //creates a Set of pizzaIds for faster lookup
    const filteredPizzaSizes = allPizzaSizes.filter((item) =>
      pizzaIds.has(item.id)
    );
    const sum = filteredPizzaSizes.reduce(
      (accumulator, item) => accumulator + item.size.price,
      0
    );
    return sum;
  };

  useEffect(() => {
    const getTotal = async () => {
      const toppingTotal = await toppingCalculations();
      const sizeTotal = await getSizePrice();
      const tipAmount = parseFloat(order.tipAmount || 0);
      const deliveryCharge = !order.tableNumber ? 0 : 5;
      setTotal(tipAmount + toppingTotal + sizeTotal + deliveryCharge);
    };
    getTotal();
  }, [order, pizzas]);

  return (
    <article className="order-detail">
      <section className="order-detail-header">
        <div className="order-detail-header-info">
          <h4>Delivery</h4>
          <div className="order-detail-header-delivery">
            {!order.tableNumber ? "Yes" : "No"}
          </div>
        </div>
        {order.tableNumber ? (
          <div className="order-detail-header-info">
            <h4>Table #</h4>
            <div>{order.tableNumber}</div>
          </div>
        ) : (
          <div className="order-detail-header-info">
            <h4>Delivery Driver</h4>
            <div>
              {
                employeeOrders.find((empOrder) => !empOrder.tookOrder)?.employee
                  ?.fullName
              }
            </div>
          </div>
        )}
        <div className="order-detail-header-info">
          <h4>Tip</h4>
          <div>{order.tipAmount}</div>
        </div>
        <div className="order-detail-header-info">
          <h4>Total</h4>
          <div>{Number(total)}</div>
        </div>
      </section>
      {pizzas.map((pizza) => (
        <PizzaInfo pizza={pizza} key={pizza.id} />
      ))}
      <section className="order-detail-btn-container">
        <div>
          <button
            className="order-detail-btn-edit"
            value={order.id}
            onClick={(event) => {
              navigate(`/orders/edit/${event.target.value}`);
            }}
          >
            Edit
          </button>
        </div>
        <div>
          <button
            className="order-detail-btn-delete"
            value={order.id}
            onClick={(event) => {
              deleteOrder(event.target.value).then(() => {
                navigate("/orders/view");
              });
            }}
          >
            Delete
          </button>
        </div>
      </section>
    </article>
  );
};
