export const Topping = ({ topping }) => {
  return (
    <label className="pizza-topping">
      <input type="checkbox" />
      {topping.name}
    </label>
  );
};
