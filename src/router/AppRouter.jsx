import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import DashboardMain from "../pages/dashboard/DashboardMain.jsx";
import CreateBlog from "../pages/blog/CreateBlog.jsx";
import ContactUsMain from "../pages/contact/ContactUsMain.jsx";
import ScheduleListMain from "../pages/schedule-list/ScheduleListMain.jsx";
import BlogMain from "../pages/blog/BlogMain.jsx";
import Login from "../_auth/Login.jsx";

// Route wrappers
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";
import CreateAdmin from "../pages/settings/CreateAdmin.jsx";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardMain />,
      },
      {
        path: "/blog",
        element: <BlogMain />,
      },
      {
        path: "/add-blog/:blogId",
        element: <CreateBlog />,
      },
      {
        path: "/add-blog",
        element: <CreateBlog />,
      },
      {
        path: "/contact",
        element: <ContactUsMain />,
      },
      {
        path: "/schedule-list",
        element: <ScheduleListMain />,
      },
      {
        path: "/settings",
        element: <CreateAdmin />
      }
    ],
  },

  // Public Routes
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
]);

export default AppRouter;
