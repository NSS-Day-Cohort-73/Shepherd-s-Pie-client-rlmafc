import { useEffect, useState } from "react"
import "./PizzaInfo.css"
import { getPizzaToppingsByPizzaId } from "../../services/toppingService"

export const PizzaInfo = ({ pizza, toppingCounter, setToppingCounter }) => {

    const [toppings, setToppings] = useState([])

    useEffect(() => {
        getPizzaToppingsByPizzaId(pizza.id).then((pizzaToppingsArray) => {
            setToppings(pizzaToppingsArray)
        })
    }, [pizza])

    return (
        <section className="order-detail-body">
            <div className="order-detail-body-info">
                <div className="order-detail-body-item">
                    <div>Size</div>
                    <div>{pizza.size?.name}</div>
                </div>
                <div className="order-detail-body-item">
                    <div>Cheese</div>
                    <div>{pizza.cheese?.name}</div>
                </div>
                <div className="order-detail-body-item">
                    <div>Sauce</div>
                    <div>{pizza.sauce?.name}</div>
                </div>
            </div>
            <div className="order-detail-body-info">
                <div className="order-detail-body-header">Toppings</div>
                <div className="order-detail-toppings">
                    {toppings.map((topping) => 
                        <div key={topping.id} className="order-detail-topping">
                            {topping.topping?.name}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}