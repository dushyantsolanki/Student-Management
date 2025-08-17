import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import { lazy } from "react";

const Subject = lazy(() => import("./page/Subject"));
const Student = lazy(() => import("./page/Student"));
const Mark = lazy(() => import("./page/Mark"));

export const routes = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { path: "/", Component: Student },
      { path: "/subject", Component: Subject },
      { path: "/mark", Component: Mark },
    ],
  },
]);
