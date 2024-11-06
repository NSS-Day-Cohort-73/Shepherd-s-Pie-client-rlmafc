import { useEffect, useState } from "react";
import { deleteOrder, getAllOrders } from "../../services/orderService";
import "./ViewOrders.css"
import { Link, useNavigate } from "react-router-dom";


export const ViewOrders = () => {
    const [date, setDate] = useState(new Date().toISOString().slice(0,10))
    const [orders, setOrders] = useState([])
    const navigate = useNavigate()

    const getAndSetOrders = () => {
        getAllOrders().then((ordersArray) => {
            const filteredOrders = ordersArray.filter((order) =>
                date == order.date.slice(0,10)
            )
            setOrders(filteredOrders)
        })
    }
    
    useEffect(() => {
        getAndSetOrders()
    }, [date])



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
                            setDate(event.target.value)
                        }}
                    />
                </div>    
            </section>
            <ul className="orders">
                {orders.map((order) => 
                    <li className="order" value={order.id} key={order.id}>
                        <Link to={order.id.toString()} className="order-details" >
                            <div className="order-header">
                                <div className="order-number">
                                    Order #{order.id}
                                </div>
                                {order.tableNumber ? (
                                    <div className="order-table">
                                        Table #{order.tableNumber}
                                    </div>
                                ) : ("")}
                            </div>
                            <div className="order-body">
                                <div className="order-employee-taken">
                                    <div className="order-employee-taken-label">
                                        Taken By :                                        
                                    </div>
                                    <div className="order-employee-taken-data">
                                        {}
                                    </div>
                                </div>
                                {!order.tableNumber ? (
                                    <div className="order-employee-delivery">
                                        <div className="order-employee-delivery-label">
                                            Assigned to Delivery :
                                        </div>
                                        <div className="order-employee-delivery-data">

                                        </div>
                                    </div>
                                ) : ("")}
                            </div>
                        </Link>
                        <div className="order-btn-container">
                            <button 
                                className="order-btn-edit"
                                value={order.id}
                                onClick={(event) => {
                                    navigate(`../orders/edit/${event.target.value}`)
                                }}
                            >
                                Edit
                            </button>
                            <button 
                                className="order-btn-delete"
                                value={order.id}
                                onClick={(event) => {
                                    deleteOrder(event.target.value).then(() => {
                                        getAndSetOrders()
                                    })
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
};
