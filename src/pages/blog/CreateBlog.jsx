import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  lazy,
  Suspense,
} from "react";
import "react-quill-new/dist/quill.snow.css";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";

const ReactQuill = lazy(() => import("react-quill-new"));

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function CreateBlog() {
  const quillRef = useRef(null);
  const { blogId } = useParams();


  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    category: "",
    author: "",
    tags: [],
    image: null,
    description: "",
  });

  const [originalData, setOriginalData] = useState({});
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [categoryType, setCategoryType] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🟩 Fetch blog data if editing
  useEffect(() => {
    if (!blogId) return;

    const fetchBlogData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/blog/${blogId}`);
        const data = res.data;

        if (data.success && data.blog) {
          const blog = data.blog;

          const formatted = {
            title: blog.title || "",
            shortDescription: blog.shortDescription || "",
            category: blog.category || "",
            author: blog.author || "",
            tags: blog.tags || [],
            image: null,
            description: blog.description || "",
          };

          setFormData(formatted);
          setOriginalData(formatted);
          setThumbnailPreview(blog.image || "");
          setCategoryType(blog.category || "");
        } else {
          toast.error("Blog not found");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        toast.error("Failed to load blog data");
      }
    };

    fetchBlogData();
  }, [blogId]);

  // 🔹 Generic input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Thumbnail upload
  const handleThumbUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => setThumbnailPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // 🔹 Quill Image Upload
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const imageHandler = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file || !file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      const base64 = await fileToBase64(file);
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true) || { index: quill.getLength() };
      quill.insertEmbed(range.index, "image", base64);
      quill.setSelection(range.index + 1);

      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          description: quill.root.innerHTML,
        }));
      }, 0);
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image", "blockquote", "code-block"],
          ["clean"],
        ],
        handlers: { image: imageHandler },
      },
    }),
    []
  );

  // 🔹 Category & Custom input
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategoryType(value);

    if (value !== "other") {
      setFormData((prev) => ({ ...prev, category: value }));
    } else {
      setFormData((prev) => ({ ...prev, category: "" }));
    }
  };

  const handleCustomCategoryChange = (e) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }));
  };

  // 🔹 Tags
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const token = Cookies.get("token");

      if (!token) {
        notifications.show({
          title: "Unauthorized",
          message: "Please log in.",
          color: "red",
        });
        setUploading(false);
        navigate("/login");
        return;
      }

      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      };

      const formDataToSend = new FormData();

      // If CREATE
      if (!blogId) {
        formDataToSend.append("title", formData.title);
        formDataToSend.append("shortDescription", formData.shortDescription);
        formDataToSend.append("category", categoryType);
        formDataToSend.append("author", formData.author);
        formDataToSend.append("tags", JSON.stringify(formData.tags));
        formDataToSend.append("description", formData.description);

        if (formData.image instanceof File) {
          formDataToSend.append("image", formData.image);
        }

        const res = await axios.post(`${BASE_URL}/blog`, formDataToSend, {
          headers,
        });

        if (res.data.success || res.status === 201) {
          notifications.show({
            title: "Success",
            message: "Blog created successfully!",
            color: "green",
          });
          navigate("/blog");
        } else {
          notifications.show({
            title: "Error",
            message: res.data.message || "Something went wrong!",
            color: "red",
          });
        }

        setUploading(false);
        return;
      }

      // If UPDATE
      const changedFields = Object.keys(formData).filter((key) => {
        if (key === "image") return formData.image instanceof File;
        if (key === "tags") {
          return (
            JSON.stringify(formData.tags) !== JSON.stringify(originalData.tags)
          );
        }
        return formData[key] !== originalData[key];
      });

      if (
        changedFields.length === 0 &&
        categoryType === originalData.category
      ) {
        notifications.show({
          title: "Info",
          message: "No changes to update",
          color: "blue",
        });
        setUploading(false);
        return;
      }

      changedFields.forEach((key) => {
        if (key === "tags") {
          formDataToSend.append("tags", JSON.stringify(formData.tags));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (categoryType !== originalData.category) {
        formDataToSend.append("category", categoryType);
      }

      const res = await axios.put(
        `${BASE_URL}/blog/${blogId}`,
        formDataToSend,
        {
          headers,
        }
      );

      if (res.data.success || res.status === 200) {
        notifications.show({
          title: "Success",
          message: "Blog updated successfully!",
          color: "green",
        });
        navigate("/blog");
      } else {
        notifications.show({
          title: "Error",
          message: res.data.message || "Update failed!",
          color: "red",
        });
      }
    } catch (err) {
      console.error("Error submitting blog:", err);
      notifications.show({
        title: blogId ? "Update failed" : "Creation failed",
        message: err.message || "An error occurred",
        color: "red",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-md rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {blogId ? "✏️ Edit Blog" : "📝 Create New Blog"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter blog title"
            className="w-full p-2 border border-gray-300 rounded-md bg-purple-50 text-sm focus:outline-none ring-purple-600 focus:ring-2"
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block font-medium mb-1">Short Description</label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            required
            placeholder="A short summary..."
            className="w-full p-2 border border-gray-300 rounded-md bg-purple-50 text-sm focus:outline-none ring-purple-600 focus:ring-2"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            value={categoryType}
            onChange={handleCategoryChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-purple-50 text-sm focus:outline-none ring-purple-600 focus:ring-2"
          >
            <option value="">Select</option>
            <option value="customSoftwareDevelopment">
              Custom Software Development
            </option>
            <option value="mobileAppDevelopment">Mobile App Development</option>
            <option value="webDevelopment">Web Development</option>
            <option value="crmSoftware">CRM Software Development</option>
            <option value="digitalMarketing">Digital Marketing</option>
            <option value="seoServices">SEO Services</option>
            <option value="leadHandlerSolutions">Lead Handler Solutions</option>
            <option value="brandIdentityDesign">Brand Identity Design</option>
            <option value="other">Other</option>
          </select>

          {categoryType === "other" && (
            <input
              type="text"
              value={formData.category}
              onChange={handleCustomCategoryChange}
              placeholder="Enter custom category"
              className="mt-2 w-full p-2 border border-gray-300 rounded-md bg-purple-50 text-sm focus:outline-none ring-purple-600 focus:ring-2"
            />
          )}
        </div>

        {/* Author */}
        <div>
          <label className="block font-medium mb-1">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author name"
            className="w-full p-2 border border-gray-300 rounded-md bg-purple-50 text-sm focus:outline-none ring-purple-600 focus:ring-2"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block font-medium mb-1">Tags</label>
          <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md bg-purple-50">
            {formData.tags.map((tag, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}

            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Type and press Enter..."
              className="flex-grow p-1 bg-transparent outline-none text-sm focus:outline-none ring-purple-600 focus:ring-2"
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block font-medium mb-1">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbUpload}
            className="w-full p-2 border border-gray-300 rounded-md bg-purple-50 text-sm focus:outline-none ring-purple-600 focus:ring-2"
          />
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              className="mt-2 h-32 rounded-md object-cover"
            />
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>

          <Suspense fallback={<div>Loading editor...</div>}>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={formData.description}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, description: value }))
              }
              modules={modules}
              className="bg-white border border-gray-300 rounded-md min-h-[400px]"
            />
          </Suspense>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={uploading}
          className={`bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {uploading
            ? blogId
              ? "Updating..."
              : "Creating..."
            : blogId
            ? "Update Blog"
            : "Create Blog"}
        </button>
      </form>
    </div>
  );
}
