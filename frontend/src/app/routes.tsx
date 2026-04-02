import { createBrowserRouter } from "react-router-dom";
import {RegisterPage} from "../features/auth/pages/RegisterPage";
import LoginPage from "../features/auth/pages/LoginPage";
import BookListPage from "../features/books/layout";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <BookListPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <RegisterPage />,
  },
]);