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

  useEffect(() => {
    // Step 1: Fetch pizzaToppings array
    const fetchAndProcessToppings = async () => {
      const pizzaToppings = await getExpandedPizzaToppings();

      // Step 2: Filter pizzaToppings to match pizzas from filteredPizzas
      const filteredPizzaToppings = pizzaToppings.filter((topping) =>
        filteredPizzas.some((pizza) => pizza.id === topping.pizzaId)
      );

      // Step 3: Count occurrences of each toppingId and store references to objects
      const toppingCount = {};
      filteredPizzaToppings.forEach((topping) => {
        const { toppingId } = topping;
        if (!toppingCount[toppingId]) {
          toppingCount[toppingId] = { count: 0, toppings: [] };
        }
        toppingCount[toppingId].count += 1;
        toppingCount[toppingId].toppings.push(topping);
      });

      // Step 4: Sort toppings by count in descending order and grab the top 3 topping objects
      const sortedToppings = Object.values(toppingCount)
        .sort((a, b) => b.count - a.count) // Sort by the count value, descending
        .flatMap((entry) => entry.toppings); // Flatten to get all pizzaTopping objects related to the most common toppingIds

      setMostCommonPizzaToppings(sortedToppings);
    };

    fetchAndProcessToppings();
  }, [filteredPizzas]);

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
    }
  }, [orders, pizzas]);

  // Calculate total price whenever filteredPizzas or other related data changes
  useEffect(() => {
    if (
      filteredPizzas.length > 0 &&
      sizes.length > 0 &&
      cheeses.length > 0 &&
      sauces.length > 0 &&
      mostCommonPizzaToppings.length > 0
    ) {
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

        //Calculate tip
        const tipTotal = orders.reduce((acc, order) => {
          return acc + (order.tipAmount ? order.tipAmount : 0);
        }, 0);

        //Calculate Delivery Fee
        let deliveryTotal = 0;
        orders.forEach((item) => {
          if (!item.tableNumber) {
            deliveryTotal += 5;
          }
        });

        // Combine all components to get the total
        setTotal(sizeTotal + toppingTotal + tipTotal + deliveryTotal);
      };

      calculateTotal();
    }
  }, [filteredPizzas, sizes, cheeses, sauces, mostCommonPizzaToppings]);

  // Determine favorite size whenever filteredPizzas or sizes change
  useEffect(() => {
    if (filteredPizzas.length > 0 && sizes.length > 0) {
      let sizeCounts = {}; // To track count of each size
      let favoriteSizeId = null;
      let numberOfFavorites = 0;

      // Count each size in filteredPizzas
      for (let i = 0; i < filteredPizzas.length; i++) {
        const sizeId = filteredPizzas[i].sizeId;
        sizeCounts[sizeId] = (sizeCounts[sizeId] || 0) + 1;

        // Track the most popular size
        if (sizeCounts[sizeId] > numberOfFavorites) {
          numberOfFavorites = sizeCounts[sizeId];
          favoriteSizeId = sizeId;
        }
      }

      // Find the object in sizes corresponding to the favorite sizeId
      const newFavoriteSize = sizes.find((size) => size.id === favoriteSizeId);

      // Set the favorite size using setFavoriteSize function
      setFavoriteSize(newFavoriteSize);
    }
  }, [filteredPizzas, sizes]);

  // Determine favorite cheese whenever filteredPizzas or cheeses change
  useEffect(() => {
    if (filteredPizzas.length > 0 && cheeses.length > 0) {
      let cheeseCounts = {}; // To track count of each cheese
      let favoriteCheeseId = null;
      let numberOfFavorites = 0;

      // Count each cheese in filteredPizzas
      for (let i = 0; i < filteredPizzas.length; i++) {
        const cheeseId = filteredPizzas[i].cheeseId;
        cheeseCounts[cheeseId] = (cheeseCounts[cheeseId] || 0) + 1;

        // Track the most popular cheese
        if (cheeseCounts[cheeseId] > numberOfFavorites) {
          numberOfFavorites = cheeseCounts[cheeseId];
          favoriteCheeseId = cheeseId;
        }
      }

      // Find the object in cheeses corresponding to the favorite cheeseId
      const newFavoriteCheese = cheeses.find(
        (cheese) => cheese.id === favoriteCheeseId
      );

      // Set the favorite cheese using setFavoriteCheese function
      setFavoriteCheese(newFavoriteCheese);
    }
  }, [filteredPizzas, cheeses]);

  // Determine favorite sauce whenever filteredPizzas or sauces change
  useEffect(() => {
    if (filteredPizzas.length > 0 && sauces.length > 0) {
      let sauceCounts = {}; // To track count of each sauce
      let favoriteSauceId = null;
      let numberOfFavorites = 0;

      // Count each sauce in filteredPizzas
      for (let i = 0; i < filteredPizzas.length; i++) {
        const sauceId = filteredPizzas[i].sauceId;
        sauceCounts[sauceId] = (sauceCounts[sauceId] || 0) + 1;

        // Track the most popular sauce
        if (sauceCounts[sauceId] > numberOfFavorites) {
          numberOfFavorites = sauceCounts[sauceId];
          favoriteSauceId = sauceId;
        }
      }

      // Find the object in sauces corresponding to the favorite sauceId
      const newFavoriteSauce = sauces.find(
        (sauce) => sauce.id === favoriteSauceId
      );

      // Set the favorite sauce using setFavoriteSauce function
      setFavoriteSauce(newFavoriteSauce);
    }
  }, [filteredPizzas, sauces]);

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
