import "./App.css";

import {
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import AdminPage from "./pages/adminPage";
import ProductPage from "./pages/productPage";
import CartPage from "./pages/cartPage";
import AboutPage from "./pages/aboutPage";
import ProductOverview from "./pages/productOverview";
import CheckoutPage from "./pages/checkoutPage";
import OrderPage from "./pages/orderPage";

export default function App() {
    return (
        <BrowserRouter>

            <Toaster
                position="top-right"
                reverseOrder={false}
            />

            <Routes>

                {/* =================================================
                    HOME
                ================================================== */}

                <Route
                    path="/"
                    element={<HomePage />}
                />

                {/* =================================================
                    PRODUCTS
                ================================================== */}

                <Route
                    path="/products"
                    element={<ProductPage />}
                />

                {/* =================================================
                    PRODUCT DETAILS
                ================================================== */}

                <Route
                    path="/overview/:productID"
                    element={<ProductOverview />}
                />

                {/* =================================================
                    CART
                ================================================== */}

                <Route
                    path="/cart"
                    element={<CartPage />}
                />

                {/* =================================================
                    CHECKOUT
                ================================================== */}

                <Route
                    path="/checkout"
                    element={<CheckoutPage />}
                />

                {/* =================================================
                    ORDERS
                ================================================== */}

                <Route
                    path="/orders"
                    element={<OrderPage />}
                />

                {/* =================================================
                    LOGIN
                ================================================== */}

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                {/* =================================================
                    REGISTER
                ================================================== */}

                <Route
                    path="/register"
                    element={
                        <h1>Register</h1>
                    }
                />

                {/* =================================================
                    ABOUT
                ================================================== */}

                <Route
                    path="/about"
                    element={<AboutPage />}
                />

                {/* =================================================
                    CONTACT
                ================================================== */}

                <Route
                    path="/contact"
                    element={
                        <h1>Contact</h1>
                    }
                />

                {/* =================================================
                    ADMIN
                ================================================== */}

                <Route
                    path="/admin/*"
                    element={<AdminPage />}
                />

            </Routes>

        </BrowserRouter>
    );
}

