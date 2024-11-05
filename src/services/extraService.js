// GET request to fetch all sizes
export const getSizes = async () => {
  try {
    const response = await fetch("http://localhost:8088/sizes");
    const sizes = await response.json();
    return sizes;
  } catch (error) {
    console.error("Error fetching sizes:", error);
  }
};

// GET request to fetch all cheeses
export const getCheeses = async () => {
  try {
    const response = await fetch("http://localhost:8088/cheeses");
    const cheeses = await response.json();
    return cheeses;
  } catch (error) {
    console.error("Error fetching cheeses:", error);
  }
};

// GET request to fetch all sauces
export const getSauces = async () => {
  try {
    const response = await fetch("http://localhost:8088/sauces");
    const sauces = await response.json();
    return sauces;
  } catch (error) {
    console.error("Error fetching sauces:", error);
  }
};
