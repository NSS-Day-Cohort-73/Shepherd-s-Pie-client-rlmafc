import { useEffect, useState } from "react";
import "./Reports.css";
import {
  getAllEmployeeOrders,
  getAllOrders,
} from "../../services/orderService";
import { Order } from "../orders/Order";
import { getPizzas } from "../../services/pizzaService";
import { getSizes } from "../../services/extraService";
import { getCheeses, getSauces } from "../../services/extraService";
import { getExpandedPizzaToppings } from "../../services/toppingService";

export const Reports = () => {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [orders, setOrders] = useState([]);
  const [employeeOrders, setEmployeeOrders] = useState([]);
  const [pizzas, setPizzas] = useState([]);
  const [filteredPizzas, setFilteredPizzas] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [favoriteSize, setFavoriteSize] = useState({});
  const [cheeses, setCheeses] = useState([]);
  const [favoriteCheese, setFavoriteCheese] = useState({});
  const [sauces, setSauces] = useState([]);
  const [favoriteSauce, setFavoriteSauce] = useState({});
  const [mostCommonPizzaToppings, setMostCommonPizzaToppings] = useState([]);
  const [total, setTotal] = useState(0);

  // Fetch Orders, Employee Orders, Pizzas, Sizes, Cheeses, and Sauces
  const getAndSetOrders = async () => {
    const ordersArray = await getAllOrders();
    const filteredOrders = ordersArray.filter(
      (order) =>
        order.date.slice(0, 10) <= endDate &&
        order.date.slice(0, 10) >= startDate
    );
    setOrders(filteredOrders);

    const employeeOrdersArray = await getAllEmployeeOrders();
    setEmployeeOrders(employeeOrdersArray);

    const pizzaArray = await getPizzas();
    setPizzas(pizzaArray);

    const sizeArray = await getSizes();
    setSizes(sizeArray);

    const cheeseArray = await getCheeses();
    setCheeses(cheeseArray);

    const sauceArray = await getSauces();
    setSauces(sauceArray);
  };

  useEffect(() => {
    getAndSetOrders();
  }, [startDate, endDate]);

  // Filter Pizzas whenever orders or pizzas change
  useEffect(() => {
    if (orders.length > 0 && pizzas.length > 0) {
      const filteredPizzaArray = pizzas.filter((pizza) =>
        orders.some((order) => pizza.orderId === order.id)
      );
      setFilteredPizzas(filteredPizzaArray);
    } else {
      setFilteredPizzas([]);
    }
  }, [orders, pizzas]);

  // Update Favorites and Total whenever filteredPizzas, orders, or ingredient lists change
  useEffect(() => {
    if (filteredPizzas.length > 0) {
      // Update Favorites
      const updateFavorites = () => {
        if (sizes.length > 0) {
          // Calculate Favorite Size
          let sizeCounts = {};
          let favoriteSizeId = null;
          let numberOfFavorites = 0;

          filteredPizzas.forEach((pizza) => {
            const sizeId = pizza.sizeId;
            sizeCounts[sizeId] = (sizeCounts[sizeId] || 0) + 1;

            if (sizeCounts[sizeId] > numberOfFavorites) {
              numberOfFavorites = sizeCounts[sizeId];
              favoriteSizeId = sizeId;
            }
          });

          const newFavoriteSize = sizes.find(
            (size) => size.id === favoriteSizeId
          );
          setFavoriteSize(newFavoriteSize);
        }

        if (cheeses.length > 0) {
          // Calculate Favorite Cheese
          let cheeseCounts = {};
          let favoriteCheeseId = null;
          let numberOfFavorites = 0;

          filteredPizzas.forEach((pizza) => {
            const cheeseId = pizza.cheeseId;
            cheeseCounts[cheeseId] = (cheeseCounts[cheeseId] || 0) + 1;

            if (cheeseCounts[cheeseId] > numberOfFavorites) {
              numberOfFavorites = cheeseCounts[cheeseId];
              favoriteCheeseId = cheeseId;
            }
          });

          const newFavoriteCheese = cheeses.find(
            (cheese) => cheese.id === favoriteCheeseId
          );
          setFavoriteCheese(newFavoriteCheese);
        }

        if (sauces.length > 0) {
          // Calculate Favorite Sauce
          let sauceCounts = {};
          let favoriteSauceId = null;
          let numberOfFavorites = 0;

          filteredPizzas.forEach((pizza) => {
            const sauceId = pizza.sauceId;
            sauceCounts[sauceId] = (sauceCounts[sauceId] || 0) + 1;

            if (sauceCounts[sauceId] > numberOfFavorites) {
              numberOfFavorites = sauceCounts[sauceId];
              favoriteSauceId = sauceId;
            }
          });

          const newFavoriteSauce = sauces.find(
            (sauce) => sauce.id === favoriteSauceId
          );
          setFavoriteSauce(newFavoriteSauce);
        }
      };

      // Calculate Total
      const calculateTotal = () => {
        // Calculate size price
        const sizeTotal = filteredPizzas.reduce((acc, pizza) => {
          const size = sizes.find((item) => item.id === pizza.sizeId);
          return acc + (size ? size.price : 0);
        }, 0);

        // Calculate topping price
        const toppingTotal = mostCommonPizzaToppings.reduce((acc, topping) => {
          return acc + (topping.topping ? topping.topping.price : 0);
        }, 0);

        // Calculate tip
        const tipTotal = orders.reduce((acc, order) => {
          return acc + (order.tipAmount ? order.tipAmount : 0);
        }, 0);

        // Calculate Delivery Fee
        let deliveryTotal = 0;
        orders.forEach((item) => {
          if (!item.tableNumber) {
            deliveryTotal += 5;
          }
        });

        // Combine all components to get the total
        setTotal(sizeTotal + toppingTotal + tipTotal + deliveryTotal);
      };

      updateFavorites();
      calculateTotal();
    } else {
      setFavoriteSize({});
      setFavoriteCheese({});
      setFavoriteSauce({});
      setTotal(0);
    }
  }, [filteredPizzas, sizes, cheeses, sauces, mostCommonPizzaToppings, orders]);

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
                setStartDate(event.target.value);
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
                setEndDate(event.target.value);
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
            <div>{favoriteSize?.name || "No data available"}</div>
          </div>
          <div className="popular-item">
            <div>Cheese</div>
            <div>{favoriteCheese?.name || "No data available"}</div>
          </div>
          <div className="popular-item">
            <div>Sauce</div>
            <div>{favoriteSauce?.name || "No data available"}</div>
          </div>
          <div className="popular-item">
            <div>Toppings</div>
            <div>
              {mostCommonPizzaToppings.length > 0
                ? mostCommonPizzaToppings
                    .slice(0, 3)
                    .map((topping) => (
                      <div key={topping.id}>{topping.topping.name}</div>
                    ))
                : "No data available"}
            </div>
          </div>
          <div className="popular-item">
            <div>Total</div>
            <div>${total.toFixed(2)}</div>
          </div>
        </div>
      </section>
      <ul className="reports-orders">
        {orders.map((order) => (
          <Order
            key={order.id}
            order={order}
            employeeOrders={employeeOrders}
            getAndSetOrders={getAndSetOrders}
          />
        ))}
      </ul>
    </article>
  );
};
