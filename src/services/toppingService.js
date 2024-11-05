

export const getAllToppings = async () => {
    try {
        const response = await fetch("http://localhost:8088/toppings");
        return response.json();
    } catch (error) {
        console.error("Error fetching toppings", error);
    }
};

export const createPizzaTopping = async (pizzaToppingObject) => {
    try {
        const response = await fetch("http://localhost:8088/pizzaToppings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pizzaToppingObject)
        });
        const newPizzaTopping = response.json()
        return newPizzaTopping.id
    } catch (error) {
        console.error("Error posting pizza topping", error)
    }
}

export const deletePizzaById = async (pizzaId) => {
    try {
        const response = await fetch(`http://localhost:8088/pizzaToppings/${pizzaId}`, {
            method: "DELETE"
        });
    } catch (error) {
        console.error("Error deleting pizza record", error);
    }
}