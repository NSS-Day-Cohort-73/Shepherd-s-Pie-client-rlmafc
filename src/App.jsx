import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Login } from "./components/auth/Login";
import { ApplicationViews } from "./views/ApplicationViews";
import { Authorized } from "./views/Authorized";

export const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="*"
        element={
          //check if the user is authorized first
          <Authorized>
            {/* ApplicationViews is the child component of authorized */}
            <ApplicationViews />
          </Authorized>
        }
      />
    </Routes>
  );
};

export default App;
