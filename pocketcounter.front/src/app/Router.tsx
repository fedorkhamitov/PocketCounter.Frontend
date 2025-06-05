import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
import Error404 from "../components/Error404";
import LoginPage from "../pages/LoginPage";
import ProductsPage from "../pages/ProductsPage";
import AddProductPage from "../pages/AddNewProductPage";
import OrdersPage from "../pages/OrdersPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/products",
        element: <ProductsPage />,
      },
      {
        path: "/orders",
        element: <OrdersPage />,
      },
      {
        path: "/customers",
        element: <div>Hello Customers!</div>,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/product/new",
        element: <AddProductPage />,
      },
    ],
    errorElement: Error404()
  },
]);

export default router;
