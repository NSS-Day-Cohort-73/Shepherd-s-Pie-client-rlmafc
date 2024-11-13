import { useEffect, useState } from "react";
import { StaffViews } from "./StaffViews";
import { AdminViews } from "./AdminViews";

export const ApplicationViews = () => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const localShepherdUser = localStorage.getItem("shepherd_user");
    const shepherdUserObject = JSON.parse(localShepherdUser);
    setCurrentUser(shepherdUserObject);
  }, []);

  return currentUser.isAdmin ? (
    <AdminViews currentUser={currentUser} />
  ) : (
    <StaffViews currentUser={currentUser} />
  );
};
