import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "../features/auth/pages/RegisterPage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <RegisterPage />, // default page
  },
  {
    path: "/login",
    element: <RegisterPage />,
  },
  {
    path: "/signup",
    element: <RegisterPage />,
  },
]);