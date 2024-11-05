export const getPizzas = async () => {
    try {
        const response = await fetch("http://localhost:8088/pizzas");
        return response.json();
    } catch (error) {
        console.error("Error fetching pizzas:", error);
    }
};

export const getPizzasBySize = async () => {
    try {
        const response = await fetch("http://localhost:8088/pizzas?_expand=size");
        return response.json();
    } catch (error) {
        console.error("Error fetching pizzas:", error)
    }
}
  
export const addPizza = async (newPizza) => {
    try {
        const response = await fetch("http://localhost:8088/pizzas", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(newPizza)
        });
        return response.json();
    } catch (error) {
        console.error("Error adding pizza:", error);
    }
};
  
export const updatePizza = async (updatedPizza) => {
    try {
        const response = await fetch(
            `http://localhost:8088/pizzas/${updatedPizza.id}`,
            {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedPizza),
            }
      );
        return response.json();
    } catch (error) {
        console.error("Error updating pizza:", error);
    }
  };
  
  export const removePizzaById = async (pizzaId) => {
        try {
            await fetch(`http://localhost:8088/pizzas/${pizzaId}`, {
                method: "DELETE",
            });
            console.log(`Pizza deleted.`);
        } catch (error) {
            console.error("Error deleting pizza:", error);
        }
  };
