import { getCheeses, getSauces, getSizes } from "../../services/extraService";
import { getAllToppings } from "../../services/toppingService";
import { Topping } from "./Topping";
import { useState, useEffect } from "react";

export const Pizza = () => {
  const [sizes, setSizes] = useState([]);
  const [cheeses, setCheeses] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [toppings, setToppings] = useState([]);

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

    fetchData();
  }, []);

  return (
    <div>
      <div className="pizza__container">
        <fieldset className="pizza__fieldset--select">
          <legend>
            <label htmlFor="sauceId">Size </label>
            <select id="sizeId">
              <option value="">-- Please choose an option --</option>
            </select>
          </legend>

          <legend>
            <label htmlFor="cheeseId">Cheese </label>
            <select id="cheeseId">
              <option value="">-- Please choose an option --</option>
            </select>
          </legend>

          <legend>
            <label htmlFor="sauceId">Sauce </label>
            <select id="sauceId">
              <option value="">-- Please choose an option --</option>
            </select>
          </legend>
        </fieldset>

        <fieldset className="pizza__fieldset--checkbox">
          {toppings.map((topping) => (
            <Topping key={topping.id} topping={topping} />
          ))}
        </fieldset>
        <button>X</button>
      </div>
    </div>
  );
};
