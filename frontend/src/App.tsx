import { RouterProvider } from "react-router-dom";
import {router} from "./app/routes"
import { CartProvider } from "./context/CartProvider";

function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}

export default App;