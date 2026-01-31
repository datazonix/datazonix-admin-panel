import React, { useState } from "react";
import axios from "axios";
import { notifications } from "@mantine/notifications";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const CreateAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/auth/create-admin`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // 🌟 Success Notification
      notifications.show({
        title: "Admin Created",
        message: "Admin has been successfully created!",
        color: "green",
      });

      console.log("Response:", res.data);

      // Reset form
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      console.error(error);

      // ❌ Error Notification
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to create admin",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen items-center justify-center">
      <div className="max-w-lg mx-auto mt-10 bg-white p-8 shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Create New Admin
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Admin Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-300 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Admin Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-300 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Admin Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-300 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#50486b] hover:bg-purple-700 text-white py-2 rounded-md text-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAdmin;
