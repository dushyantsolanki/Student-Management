import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Subject from "./page/Subject";
import Student from "./page/Student";
import Mark from "./page/Mark";

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
