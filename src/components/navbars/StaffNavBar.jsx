import "./NavBar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const StaffNavBar = () => {
  const navigate = useNavigate();

  const handleCreateOrder = async () => {
    const orderObject = {
      tableNumber: 0,
      date: new Date(),
      tipAmount: 0,
      complete: false,
    };
    const order = await CreateOrder(orderObject);
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
