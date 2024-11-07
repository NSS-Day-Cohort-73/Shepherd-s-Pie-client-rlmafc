import { getCheeses, getSauces, getSizes } from "../../services/extraService";
import { removePizzaById, updatePizza } from "../../services/pizzaService";
import { getAllToppings } from "../../services/toppingService";
import { Topping } from "./Topping";
import { useState, useEffect } from "react";
import debounce from "lodash.debounce";

export const Pizza = ({ pizzaObj, getAndSetPizzas }) => {
  //Dropdown Arrays
  const [sizes, setSizes] = useState([]);
  const [cheeses, setCheeses] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [toppings, setToppings] = useState([]);
  //Pizza Object
  const [pizza, setPizza] = useState({});
  //Loaded Flag
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const sizesData = await getSizes();
      const cheesesData = await getCheeses();
      const saucesData = await getSauces();
      const toppingsData = await getAllToppings();

      setSizes(sizesData);
      setCheeses(cheesesData);
      setSauces(saucesData);
      setToppings(toppingsData);
    };
    setPizza(pizzaObj);
    fetchData();
    setLoaded(true); // Data is loaded
  }, []);

  const savePizza = debounce(async (pizza) => {
    if (loaded) {
      try {
        await updatePizza(pizza);
        console.log("Pizza auto-saved");
      } catch (error) {
        console.error("Failed to save pizza", error);
      }
    }
  }, 1000);

  useEffect(() => {
    //   if (!loaded || !order.id) return; // Only save if data is loaded and order.id exists
    savePizza(pizza);
    //   return () => saveOrder.cancel();
  }, [pizza]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPizza((prevPizza) => ({
      ...prevPizza,
      [name]: parseInt(value),
    }));
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    await removePizzaById(pizza.id);
    await getAndSetPizzas();
  };

  return (
    <div>
      <div className="pizza__container">
        <fieldset className="pizza__fieldset--select">
          <legend>
            <label htmlFor="sizeId">Size </label>
            <select
              name="sizeId"
              onChange={handleChange}
              value={pizza.sizeId}
              id="sizeId"
            >
              <option value={0}>-- Please choose an option --</option>
              {sizes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </legend>

          <legend>
            <label htmlFor="cheeseId">Cheese </label>
            <select
              name="cheeseId"
              onChange={handleChange}
              value={pizza.cheeseId}
              id="cheeseId"
            >
              <option value={0}>-- Please choose an option --</option>
              {cheeses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </legend>

          <legend>
            <label htmlFor="sauceId">Sauce </label>
            <select
              name="sauceId"
              onChange={handleChange}
              value={pizza.sauceId}
              id="sauceId"
            >
              <option value={0}>-- Please choose an option --</option>
              {sauces.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </legend>
        </fieldset>

        <fieldset className="pizza__fieldset--checkbox">
          {toppings.map((toppingObj) => (
            <Topping
              key={toppingObj.id}
              toppingObj={toppingObj}
              pizza={pizza}
            />
          ))}
        </fieldset>
        <button onClick={handleDelete} className="btn-delete">
          X
        </button>
      </div>
    </div>
  );
};
