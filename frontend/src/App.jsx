import { RouterProvider } from "react-router-dom";
import { routes } from "./route";
import { ToastContainer } from "react-toastify";

function App({ children }) {
  return (
    <>
      <ToastContainer />
      <RouterProvider router={routes}>{children}</RouterProvider>
    </>
  );
}

export default App;
