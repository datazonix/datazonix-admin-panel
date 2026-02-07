import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      notifications.show({
        title: "Error",
        message: "Please fill all fields",
        color: "red",
      });
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, formData);
debugger;
      // Show success
      notifications.show({
        title: "Success",
        message: "Login successful!",
        color: "green",
      });

      // Store token
      Cookies.set("token", res.data.token, { expires: 7 });

      // Redirect
      navigate("/");
    } catch (error) {
      notifications.show({
        title: "Login Failed",
        message: error?.response?.data?.message || "Invalid credentials",
        color: "red",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-black to-gray-900 p-4">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-xl p-8 animate-fadeIn">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back
        </h2>
        <p className="text-gray-300 text-center mb-8">
          Login to continue accessing your dashboard
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="text-gray-200 text-sm">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              className="w-full mt-1 px-4 py-2 bg-white/20 text-white rounded-lg outline-none border border-white/30 focus:border-purple-400 backdrop-blur-md"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="text-gray-200 text-sm">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              className="w-full mt-1 px-4 py-2 bg-white/20 text-white rounded-lg outline-none border border-white/30 focus:border-purple-400 backdrop-blur-md"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-lg transition-all duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-gray-300 text-center mt-8 text-sm">
          Don't have an account?{" "}
          <span className="text-purple-400 cursor-pointer hover:underline">
            Create one
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
