import "./NavBar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const StaffNavBar = () => {
  const navigate = useNavigate();
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
            <Link className="navbar-link" to="/orders/create">
              Create Order
            </Link>
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
