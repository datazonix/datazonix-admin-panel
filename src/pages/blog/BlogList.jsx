import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRegUser, FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/blog`);
        if (res.data.success && Array.isArray(res.data.blogs)) {
          setBlogs(res.data.blogs);
        } else {
          console.warn("Unexpected response format:", res.data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        notifications.show({
          title: "Error",
          message: "Failed to load blogs",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-GB");
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate} • ${formattedTime}`;
  };

  const tagColors = [
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-yellow-100 text-yellow-700",
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-orange-100 text-orange-700",
  ];

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`${BASE_URL}/blog/${id}`);
      if (res.data.success) {
        notifications.show({
          title: "Deleted",
          message: "Blog deleted successfully",
          color: "green",
        });
        setBlogs((prev) => prev.filter((blog) => blog._id !== id));
      } else {
        notifications.show({
          title: "Failed",
          message: "Unable to delete blog",
          color: "red",
        });
      }
    } catch (error) {
      console.error("Delete Error:", error);
      notifications.show({
        title: "Error",
        message: "Something went wrong while deleting",
        color: "red",
      });
    }
  };

  const handleEdit = (id) => {
    navigate(`/add-blog/${id}`);
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 animate-pulse">
      <div className="h-56 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
          <div className="h-5 w-12 bg-gray-200 rounded-full" />
        </div>
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="flex justify-between mt-4">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {loading
        ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        : blogs.map((blog, index) => (
            <div
              key={blog._id || index}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col border border-gray-300 relative max-h-[420px]"
            >
              {/* Edit/Delete buttons */}
              <div className="absolute top-3 right-3 flex gap-3 z-10">
                <button
                  onClick={() => handleEdit(blog._id)}
                  className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full"
                >
                  <FaEdit className="text-blue-600" size={16} />
                </button>

                <button
                  onClick={() => handleDelete(blog._id)}
                  className="p-2 bg-red-100 hover:bg-red-200 rounded-full"
                >
                  <FaTrash className="text-red-600" size={16} />
                </button>
              </div>

              {/* Image */}
              <div className="relative h-56">
                <img
                  src={
                      blog.image?.startsWith("http")
                        ? blog.image
                        : `https://api.datazonix.online${blog.image}`
                    }
                  alt={blog.title}
                  className="w-full h-full object-cover bg-gray-200"
                />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 px-4 py-3">
                {blog.tags?.slice(0, 4).map((tag, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      tagColors[i % tagColors.length]
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title & Short Desc */}
              <h2 className="text-lg font-semibold px-4">{blog.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-2 px-4">
                {blog.shortDescription}
              </p>

              {/* Author + Date */}
              <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600 my-2">
                <div className="flex items-center gap-2">
                  <FaRegUser size={16} />
                  <span>{blog.author}</span>
                </div>

                <span>{formatDate(blog.createdAt)}</span>
              </div>
            </div>
          ))}
    </div>
  );
};

export default BlogList;
