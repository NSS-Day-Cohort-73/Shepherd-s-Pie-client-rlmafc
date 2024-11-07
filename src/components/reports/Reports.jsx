import { useEffect, useState } from "react";
import "./Reports.css"
import { getAllEmployeeOrders, getAllOrders } from "../../services/orderService";
import { Order } from "../orders/Order";

export const Reports = () => {
    const [startDate, setStartDate] = useState(new Date().toISOString().slice(0,10))
    const [endDate, setEndDate] = useState(new Date().toISOString().slice(0,10))
    const [orders, setOrders] = useState([])
    const [employeeOrders, setEmployeeOrders] = useState([])

    const getAndSetOrders = () => {
        getAllOrders().then((ordersArray) => {
            const filteredOrders = ordersArray.filter((order) =>
                order.date.slice(0,10) <= endDate && order.date.slice(0,10) >= startDate
            )
            setOrders(filteredOrders)
        })
        getAllEmployeeOrders().then((data) => {
            setEmployeeOrders(data)
        })
    }

    useEffect(() => {
        getAndSetOrders()
    }, [startDate, endDate])

    return (
        <article className="reports">
            <section className="reports-dates">
                <div className="reports-dates-start">
                    <div>Start Date</div>
                    <div>
                        <input 
                            type="date"
                            className="reports-dates-btn-start"
                            defaultValue={startDate}
                            onChange={(event) => {
                                setStartDate(event.target.value)
                            }}
                        />
                    </div>
                </div>
                <div className="reports-dates-end">
                    <div>End Date</div>
                    <div>
                        <input
                            type="date"
                            className="reports-dates-btn-end"
                            defaultValue={endDate}
                            onChange={(event) => {
                                setEndDate(event.target.value)
                            }}
                        />
                    </div>
                </div>
            </section>
            <section className="reports-popular">
                <h1>Most Popular</h1>
                <div className="popular-container">
                    <div className="popular-item">
                        <div>Size</div>
                        <div>XXXXXXX</div>
                    </div>
                    <div className="popular-item">
                        <div>Cheese</div>
                        <div>XXXXXXX</div>
                    </div>
                    <div className="popular-item">
                        <div>Sauce</div>
                        <div>XXXXXXX</div>
                    </div>
                    <div className="popular-item">
                        <div>Toppings</div>
                        <div>
                            <div className="topping-item">XXXXXXXXX</div>
                            <div className="topping-item">XXXXXXX</div>
                            <div className="topping-item">XXXXXXXX</div>
                        </div>
                    </div>
                    <div className="popular-item">
                        <div>Total</div>
                        <div>$XXXX.XX</div>
                    </div>
                </div>
            </section>
            <ul className="reports-orders">
                {orders.map((order) => 
                    <Order key={order.id} order={order} employeeOrders={employeeOrders} getAndSetOrders={getAndSetOrders} />
                )}           
            </ul>
        </article>
    );
};
