import React from "react";
import "./App.css";


const Notifications = ({ message }) => {
  return (
    <div className="notification">
      {message}
    </div>
  );
};

export default Notifications;
