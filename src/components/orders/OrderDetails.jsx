
// /orders/view/:orderId


import { useEffect, useState } from "react";
import "./OrderDetails.css"
import { useNavigate, useParams } from "react-router-dom";
import { getAllOrders, getEmployeeOrdersByOrderId } from "../../services/orderService";

export const OrderDetails = () => {

    const { orderId } = useParams()
    const [order, setOrder] = useState({})
    const [employeeOrders, setEmployeeOrders] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        getAllOrders(orderId).then((order) => {
            setOrder(order)
        })
        getEmployeeOrdersByOrderId(orderId).then((empOrderArray) => {
            setEmployeeOrders(empOrderArray)
        })
    }, [orderId])

    return (
        <article className="order-detail">
            <section className="order-detail-header">
                <div className="order-detail-header-info">
                    <h4>Delivery</h4>
                    <div>
                        <div>Yes</div>
                        <div>No</div>
                    </div>
                </div>
                {order.tableNumber ? (
                    <div className="order-detail-header-info">
                        <h4>Table #</h4>
                        <div></div>
                    </div>    
                ) : (
                    <div className="order-detail-header-info">
                        <h4>Delivery Driver</h4>
                        <div></div>
                    </div>
                )}
                <div className="order-detail-header-info">
                    <h4>Tip</h4>
                    <div></div>
                </div>
                <div className="order-detail-header-info">

                </div>
            </section>
            <section className="order-detail-body">
                
            </section>
            <section className="order-detail-btn-container">
                <div>
                    <button
                        className="order-detail-btn-edit"
                    >
                        Edit
                    </button>
                </div>
                <div>
                    <button 
                        className="order-detail-btn-delete"
                    >
                        Delete
                    </button>
                </div>
            </section>
        </article>
    );
};
