import { createBrowserRouter } from "react-router-dom";
import {RegisterPage} from "../features/auth/pages/RegisterPage";
import LoginPage from "../features/auth/pages/LoginPage";
import BookListPage from "../features/books/layout";
import BookDetailsPage from "../features/books/pages/BookDetailsPage";


export const router = createBrowserRouter([
  {
    path: "/books/:id",
    element: <BookDetailsPage />,
  },
  {
    path: "/books",
    element: <BookListPage />,
  },
  {
    path: "/",
    element: <BookListPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);