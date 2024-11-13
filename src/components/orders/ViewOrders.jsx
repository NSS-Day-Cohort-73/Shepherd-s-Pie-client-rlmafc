import { useEffect, useState } from "react";
import {
  getAllEmployeeOrders,
  getAllOrders,
} from "../../services/orderService";
import "./ViewOrders.css";
import { Order } from "./Order";

export const ViewOrders = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [orders, setOrders] = useState([]);
  const [employeeOrders, setEmployeeOrders] = useState([]);

  const getAndSetOrders = () => {
    getAllOrders().then((ordersArray) => {
      const filteredOrders = ordersArray.filter(
        (order) => date == order.date.slice(0, 10)
      );
      const filteredFilterOrders = filteredOrders.filter(
        (item) => item.complete
      );
      setOrders(filteredFilterOrders);
    });
  };

  useEffect(() => {
    getAllEmployeeOrders().then((data) => {
      setEmployeeOrders(data);
    });
    getAndSetOrders();
  }, [date]);

  return (
    <div className="view-orders">
      <section className="view-orders-date">
        <div className="view-orders-date-label">Select a Day</div>
        <div className="view-orders-date-container">
          <input
            type="date"
            className="view-orders-date-select"
            defaultValue={date}
            onChange={(event) => {
              setDate(event.target.value);
            }}
          />
        </div>
      </section>
      <ul className="orders">
        {orders.map((order) => (
          <Order
            key={order.id}
            order={order}
            employeeOrders={employeeOrders}
            getAndSetOrders={getAndSetOrders}
          />
        ))}
      </ul>
    </div>
  );
};
