import React from "react";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Sidebar from "./components/Sidebar";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const App = () => {
  
const isOpen = useSelector((state) => state.main.isToggle); 
  return (
     <div className="flex gap-2 bg-green-50 ">
      <Sidebar />
      <div className={`flex-1 lg:px-6 p-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'}`}>
      {/* <TopHeader  /> */}
        <Outlet />
      </div>
    </div>
  );
};

export default App;
