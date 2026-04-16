import { createBrowserRouter } from "react-router-dom";
import {RegisterPage} from "../features/auth/pages/RegisterPage";
import LoginPage from "../features/auth/pages/LoginPage";
import BookListPage from "../features/books/layout";
import BookDetailsPage from "../features/books/pages/BookDetailsPage";
import MyReservationsPage from "../features/books/pages/MyReservationsPage";
import HomeRouter from "./HomeRouter";


export const router = createBrowserRouter([
  {
    path: "/reservations",
    element: <MyReservationsPage />,
  },
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
    element: <HomeRouter />,
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