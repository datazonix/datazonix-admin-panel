import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { sideBartoggle, setSelectedItem } from "../redux/slices/MainSlices";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { MdDashboard, MdContactMail, MdSettings, MdLogout, MdClose } from "react-icons/md";
import { notifications } from "@mantine/notifications";

const Sidebar = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.main.isToggle);
  const location = useLocation();
  const navigate = useNavigate();

  const NavLink = ({ icon: Icon, label, to }) => {
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        onClick={() => dispatch(setSelectedItem(label.toLowerCase()))}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
          ${isActive ? "bg-[#50486b] text-white" : "text-white hover:bg-[#50486b] hover:text-white"}`}
      >
        <Icon className="text-2xl" />
        {isOpen && <span className="text-base">{label}</span>}
      </Link>
    );
  };

  const handleLogout = () => {
    notifications.show({
      title: "Success",
      message: "You have been logged out successfully.",
      color: "green",
    });
    Cookies.remove("token");
    navigate("/login");

  };

  return (
    <div
  className={`h-screen fixed bg-[#150b35] shadow-lg flex flex-col justify-between transition-all duration-300
    ${isOpen ? "w-64" : "w-20"} p-4`}
>
  {/* Top Section */}
  <div className="overflow-y-auto flex-1">

    {/* Logo + Toggle / Close */}
    <div className="flex items-center justify-between mb-6">
      <div
        className="font-bold text-xl cursor-pointer text-white"
        onClick={() => !isOpen && dispatch(sideBartoggle())}
      >
        {isOpen ? 
        <img src="/datazonix-main-logo.png"  className="w-full h-8"/> : "DA"}
      </div>

      {isOpen && (
        <button
          onClick={() => dispatch(sideBartoggle())}
          className="p-2 rounded-md hover:bg-gray-400 text-white"
        >
          <MdClose className="text-2xl" />
        </button>
      )}
    </div>

    {/* Nav Links */}
    <div className="flex flex-col space-y-3 text-black">
      <NavLink icon={MdDashboard} label="Dashboard" to="/" />
      <NavLink icon={MdContactMail} label="Contact List" to="/contact" />
      <NavLink icon={MdContactMail} label="Schedule List" to="/schedule-list" />
      <NavLink icon={MdContactMail} label="Blog" to="/blog" />
      <NavLink icon={MdSettings} label="Setting" to="/settings" />
    </div>
  </div>

  {/* Logout Button */}
  <div className="pb-4">
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-red-500 bg-[#50486b] transition-colors"
    >
      <MdLogout className="text-2xl" />
      {isOpen && <span>Logout</span>}
    </button>
  </div>
</div>

  );
};

export default Sidebar;
