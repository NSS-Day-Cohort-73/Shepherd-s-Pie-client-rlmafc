import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { Welcome } from "../components/welcome/Welcome";
import { ViewOrders } from "../components/orders/ViewOrders";
import { OrderDetails } from "../components/orders/OrderDetails";
import { CreateOrder } from "../components/orders/CreateOrder";
import { StaffNavBar } from "../components/navbars/StaffNavBar";

export const StaffViews = ({ currentUser }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <StaffNavBar currentUser={currentUser} />
            <Outlet />
            {/* Outlet will render the index route or other nested routes */}
          </>
        }
      >
        {/* Index route for the home page */}
        <Route index element={<Welcome />} />

        {/* Other nested routes */}
        <Route path="orders/view">
          <Route index element={<ViewOrders currentUser={currentUser} />} />
          <Route
            path=":orderId"
            element={<OrderDetails currentUser={currentUser} />}
          />
        </Route>
        <Route
          path="orders/create/:orderId"
          element={<CreateOrder currentUser={currentUser} />}
        />
        <Route path="orders/edit/:orderId" element={<CreateOrder />} />
      </Route>
    </Routes>
  );
};
