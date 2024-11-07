
// /orders/view/:orderId


import { useEffect, useState } from "react";
import "./OrderDetails.css"
import { useNavigate, useParams } from "react-router-dom";
import { deleteOrder, getAllOrders, getEmployeeOrdersByOrderId } from "../../services/orderService";
import { getPizzasByOrderId } from "../../services/pizzaService";
import { PizzaInfo } from "./PizzaInfo";

export const OrderDetails = () => {

    const { orderId } = useParams()
    const [order, setOrder] = useState({})
    const [pizzas, setPizzas] = useState([])
    const [employeeOrders, setEmployeeOrders] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        getAllOrders(orderId).then((order) => {
            setOrder(order)
        })
        getEmployeeOrdersByOrderId(orderId).then((empOrderArray) => {
            setEmployeeOrders(empOrderArray)
        })
        getPizzasByOrderId(orderId).then((pizzasArray) => {
            setPizzas(pizzasArray)
        })
    }, [orderId])

    return (
        <article className="order-detail">
            <section className="order-detail-header">
                <div className="order-detail-header-info">
                    <h4>Delivery</h4>
                    <div className="order-detail-header-delivery">
                        <input type="radio" readOnly checked={!order.tableNumber ? "checked" : ""} />Yes
                        <input type="radio" readOnly checked={order.tableNumber ? "checked": ""} />No
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
                            {employeeOrders.find((empOrder) => 
                                !empOrder.tookOrder
                            )?.employee?.fullName}
                        </div>
                    </div>
                )}
                <div className="order-detail-header-info">
                    <h4>Tip</h4>
                    <div>{order.tipAmount}.00</div>
                </div>
                <div className="order-detail-header-info">
                    <h4>Total</h4>
                    <div>xxxx</div>
                </div>
            </section>
            {pizzas.map((pizza) => 
                <PizzaInfo pizza={pizza} key={pizza.id}/>
            )}
            <section className="order-detail-btn-container">
                <div>
                    <button
                        className="order-detail-btn-edit"
                        value={order.id}
                        onClick={(event) => {
                            navigate(`/orders/edit/${event.target.value}`)
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
                                navigate("/orders/view")
                            })
                        }}
                    >
                        Delete
                    </button>
                </div>
            </section>
        </article>
    );
};
