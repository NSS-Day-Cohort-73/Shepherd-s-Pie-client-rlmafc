import "./NavBar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { createEmployeeOrder, createOrder } from "../../services/orderService";


export const AdminNavBar = ({currentUser}) => {
  const navigate = useNavigate();

  const handleCreateOrder = async () => {
    const orderObject = {
      tableNumber: 0,
      date: new Date(),
      tipAmount: 0,
      complete: false,
    };

    
    const order = await createOrder(orderObject);

    const employeeOrderObject = {
      employeeId: currentUser.id,
      orderId: order.id,
      tookOrder: true,
    };
    await createEmployeeOrder(employeeOrderObject)

    navigate(`/orders/create/${order.id}`);
  };
  return (
    <ul className="navbar">
      <li className="navbar-item dropdown">
        <span className="navbar-link">Order</span>
        <ul className="dropdown-content">
          <li>
            <Link className="navbar-link" to="/orders/view">
              View Orders
            </Link>
          </li>
          <li>
            <button className="navbar-link" onClick={handleCreateOrder}>
              Create Order
            </button>
          </li>
        </ul>
      </li>

      <li className="navbar-item dropdown">
        <span className="navbar-link">Employees</span>
        <ul className="dropdown-content">
          <li>
            <Link className="navbar-link" to="/employees/view">
              View Employees
            </Link>
          </li>
          <li>
            <Link className="navbar-link" to={`/employees/create/`}>
              Create Employee
            </Link>
          </li>
        </ul>
      </li>

      <li>
        <Link className="navbar-link" to="/reports">
          Reports
        </Link>
      </li>

      {localStorage.getItem("shepherd_user") ? (
        <li className="navbar-item navbar-logout">
          <Link
            className="navbar-link"
            to=""
            onClick={() => {
              localStorage.removeItem("shepherd_user");
              navigate("/", { replace: true });
            }}
          >
            Logout
          </Link>
        </li>
      ) : (
        ""
      )}
    </ul>
  );
};
