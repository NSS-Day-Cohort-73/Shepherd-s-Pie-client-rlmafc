import { Link, useNavigate } from "react-router-dom";
import "./Order.css";
import { deleteOrder } from "../../services/orderService";

export const Order = ({ order, employeeOrders, getAndSetOrders }) => {
  const navigate = useNavigate();

  return (
    <li className="order" value={order.id} key={order.id}>
      <Link to={`/orders/view/${order.id}`} className="order-details">
        <div className="order-header">
          <div className="order-number">Order #{order.id}</div>
        </div>
        <div className="order-body">
          <div className="order-employee-taken">
            <div className="order-employee-taken-label">Taken By :</div>
            <div className="order-employee-taken-data">
              {
                employeeOrders.find(
                  (empOrder) =>
                    empOrder.order?.id == order.id && empOrder.tookOrder
                )?.employee?.fullName
              }
            </div>
          </div>
          {!order.tableNumber ? (
            <div className="order-employee-delivery">
              <div className="order-employee-delivery-label">
                Assigned to Delivery :
              </div>
              <div className="order-employee-delivery-data">
                {
                  employeeOrders.find(
                    (empOrder) =>
                      empOrder.order?.id == order.id && !empOrder.tookOrder
                  )?.employee?.fullName
                }
              </div>
            </div>
          ) : (
            <div className="order-table">Table #{order.tableNumber}</div>
          )}
        </div>
      </Link>
      <div className="order-btn-container">
        <button
          className="order-btn-edit"
          value={order.id}
          onClick={(event) => {
            navigate(`../orders/edit/${event.target.value}`);
          }}
        >
          Edit
        </button>
        <button
          className="order-btn-delete"
          value={order.id}
          onClick={(event) => {
            deleteOrder(event.target.value).then(() => {
              getAndSetOrders();
            });
          }}
        >
          Delete
        </button>
      </div>
    </li>
  );
};
