import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes"
import { CartProvider } from "./context/CartProvider";
import { AuthProvider} from "./context/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./features/auth/hooks/useAuth";

function AppContent() {
  const { isAuthenticated } = useAuth();
  
  return (
    <CartProvider key={isAuthenticated ? "logged-in" : "guest"}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </CartProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;