import React from "react";
import { useNavigate } from "react-router-dom";
import BlogList from "./BlogList";

const BlogMain = () => {
    const navigate = useNavigate();
  return (
    <div className="w-full p-3">
      {/* Top Section */}
      <div className="flex items-center justify-between mb-6 border border-gray-300 rounded-lg py-2 px-4 shadow-sm bg-white/80">
        {/* Left Heading */}
        <h1 className="text-2xl font-semibold text-gray-800">Add Blog</h1>

        {/* Right Add Button */}
        <button onClick={() => navigate("/add-blog")}  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition">
          + Add
        </button>
      </div>

      {/* Main Content */}
      <div>
        <BlogList />
      </div>
    </div>
  );
};

export default BlogMain;
