export const getAllToppings = async () => {
  try {
    const response = await fetch("http://localhost:8088/toppings");
    return response.json();
  } catch (error) {
    console.error("Error fetching toppings", error);
  }
};

export const getExpandedPizzaToppings = async () => {
  try {
    const response = await fetch(
      `http://localhost:8088/pizzaToppings?_expand=pizza&_expand=topping`
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching pizzaToppings.", error);
  }
};

export const createPizzaTopping = async (pizzaToppingObject) => {
  try {
    const response = await fetch("http://localhost:8088/pizzaToppings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pizzaToppingObject),
    });
    const newPizzaTopping = await response.json();
    return newPizzaTopping.id;
  } catch (error) {
    console.error("Error posting pizza topping", error);
  }
};

export const deletePizzaTopping = async (pizzaToppingId) => {
  try {
    const response = await fetch(
      `http://localhost:8088/pizzaToppings/${pizzaToppingId}`,
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    console.error("Error deleting pizza record", error);
  }
};

export const getPizzaToppingsByPizzaId = async (pizzaId) => {
  try {
    const response = await fetch(
      `http://localhost:8088/pizzaToppings?pizzaId=${pizzaId}&_expand=topping`
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching pizzaToppings.", error);
  }
};

export const getPizzaToppings = async () => {
  try {
    const response = await fetch("http://localhost:8088/pizzatoppings");
    return response.json();
  } catch (error) {
    console.error("Error fetching toppings", error);
  }
};
