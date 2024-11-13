import { useEffect, useState } from "react";
import {
  getPizzaToppings,
  createPizzaTopping,
  deletePizzaTopping,
  getExpandedPizzaToppings,
} from "../../services/toppingService";

export const Topping = ({
  toppingObj,
  pizza,
  pizzas,
  setToppingPrice,
  updateTotal,
}) => {
  const [topping, setTopping] = useState(null);
  const [currentToppingId, setCurrentToppingId] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const toppingCalculations = async () => {
      const expandedPizzaToppings = await getExpandedPizzaToppings();
      const filteredExpandedPizzaToppings = expandedPizzaToppings.filter(
        (item) =>
          pizzas.some(
            (thisPizza) => item.pizza && thisPizza.id === item.pizza.id
          )
      );
      const totalToppingPrice = filteredExpandedPizzaToppings.reduce(
        (accumulator, item) => accumulator + item.topping.price,
        0
      );
      setToppingPrice(totalToppingPrice);
      updateTotal();
    };
    toppingCalculations();
  }, [currentToppingId]);

  useEffect(() => {
    const fetchData = async () => {
      const allPizzaToppings = await getPizzaToppings();
      const thisPizzaTopping = allPizzaToppings.find(
        (item) => item.pizzaId === pizza.id && item.toppingId === toppingObj.id
      );

      if (thisPizzaTopping) {
        setTopping(thisPizzaTopping);
        setCurrentToppingId(thisPizzaTopping.id); // Save the topping ID for deletion
        setIsChecked(true); // Set checkbox to checked if topping already exists
      } else {
        setTopping({
          pizzaId: pizza.id,
          toppingId: toppingObj.id,
        });
        setIsChecked(false); // Set checkbox to unchecked if topping doesn't exist
      }
    };

    fetchData(); // Call fetchData inside useEffect
  }, [pizza.id, toppingObj.id]);

  const handleCheckboxChange = async (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);

    if (checked) {
      // If checked, create a new pizza topping and store its ID
      try {
        const response = await createPizzaTopping(topping);
        setCurrentToppingId(response);
        console.log("Topping added:", topping.toppingId);
      } catch (error) {
        console.error("Failed to add topping", error);
      }
    } else {
      // If unchecked, delete the pizza topping using the stored ID
      try {
        await deletePizzaTopping(currentToppingId);
        setCurrentToppingId(null); // Clear the ID after deletion
        console.log("Topping removed:", topping.toppingId);
      } catch (error) {
        console.error("Failed to delete topping", error);
      }
    }
  };

  return (
    <label className="pizza-topping">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      {toppingObj.name}
    </label>
  );
};
