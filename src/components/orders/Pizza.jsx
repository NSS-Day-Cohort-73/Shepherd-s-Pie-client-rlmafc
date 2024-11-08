import { getCheeses, getSauces, getSizes } from "../../services/extraService";
import { removePizzaById, updatePizza } from "../../services/pizzaService";
import { getAllToppings } from "../../services/toppingService";
import { Topping } from "./Topping";
import { useState, useEffect } from "react";

export const Pizza = ({
  pizzaObj,
  getAndSetPizzas,
  getAndSetSizePrice,
  updateTotal,
  setToppingPrice,
  pizzas,
}) => {
  // Dropdown Arrays
  const [sizes, setSizes] = useState([]);
  const [cheeses, setCheeses] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [toppings, setToppings] = useState([]);
  // Pizza Object
  const [pizza, setPizza] = useState({});
  // Loaded Flag
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

  useEffect(() => {
    const savePizzaAndSetSizePrice = async () => {
      try {
        if (loaded) {
          // Save the pizza immediately without debounce
          await updatePizza(pizza);
          console.log("Pizza auto-saved");

          // Now that the pizza is saved, fetch the updated pizzas
          await getAndSetPizzas();

          // Recalculate size price and total
          await getAndSetSizePrice();
          updateTotal();
        }
      } catch (error) {
        console.error("Failed to save pizza", error);
      }
    };
    savePizzaAndSetSizePrice();
  }, [pizza]);

  const handleChange = async (event) => {
    const { name, value } = event.target;

    // Create the updated pizza object
    const updatedPizza = {
      ...pizza,
      [name]: parseInt(value),
    };

    // Update the state
    setPizza(updatedPizza);
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    await removePizzaById(pizza.id);
    await getAndSetPizzas();
    await getAndSetSizePrice();
    updateTotal();
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
              value={pizza.sizeId || 0}
              id="sizeId"
            >
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
              value={pizza.cheeseId || 0}
              id="cheeseId"
            >
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
              value={pizza.sauceId || 0}
              id="sauceId"
            >
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
              setToppingPrice={setToppingPrice}
              pizzas={pizzas}
              updateTotal={updateTotal}
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
