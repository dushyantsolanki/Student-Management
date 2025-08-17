import { RouterProvider } from "react-router-dom";
import { routes } from "./route";
import { ToastContainer } from "react-toastify";
import { Suspense } from "react";
import { Loader } from "./component/Loader";

function App() {
  return (
    <>
      <ToastContainer />
      <Suspense
        fallback={
          <div className="min-h-screen w-full flex items-center justify-center">
            <Loader />
          </div>
        }
      >
        <RouterProvider router={routes} />
      </Suspense>
    </>
  );
}

export default App;
