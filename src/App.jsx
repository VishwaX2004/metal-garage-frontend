import "./App.css";

import {
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";

import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Loader } from "./components/loader";

// ============================================================
// MAIN PAGES (LAZY LOADED)
// ============================================================

const HomePage = lazy(() => import("./pages/homePage"));
const LoginPage = lazy(() => import("./pages/loginPage"));
const AdminPage = lazy(() => import("./pages/adminPage"));
const ProductPage = lazy(() => import("./pages/productPage"));
const CartPage = lazy(() => import("./pages/cartPage"));
const AboutPage = lazy(() => import("./pages/aboutPage"));
const ProductOverview = lazy(() => import("./pages/productOverview"));
const CheckoutPage = lazy(() => import("./pages/checkoutPage"));
const OrderPage = lazy(() => import("./pages/orderPage"));
const ContactPage = lazy(() => import("./pages/contactPage"));
const RegisterPage = lazy(() => import("./pages/registerPage"));
const AccountPage = lazy(() => import("./pages/accountPage"));

// ============================================================
// PAYHERE PAGES (LAZY LOADED)
// ============================================================

const PaymentSuccess = lazy(() => import("./pages/paymentSuccess"));
const PaymentCancel = lazy(() => import("./pages/paymentCancel"));

// ============================================================
// APP
// ============================================================

export default function App() {
    return (
        <BrowserRouter>
            {/* =================================================
                TOAST NOTIFICATIONS
            ================================================== */}

            <Toaster
                position="top-right"
                reverseOrder={false}
            />

            {/* =================================================
                APPLICATION ROUTES WITH SUSPENSE
            ================================================== */}

            <Suspense fallback={<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><Loader /></div>}>
                <Routes>
                {/* HOME */}
                <Route
                    path="/"
                    element={<HomePage />}
                />

                {/* PRODUCTS */}
                <Route
                    path="/products"
                    element={<ProductPage />}
                />

                {/* PRODUCT DETAILS */}
                <Route
                    path="/overview/:productID"
                    element={<ProductOverview />}
                />

                {/* CART */}
                <Route
                    path="/cart"
                    element={<CartPage />}
                />

                {/* CHECKOUT */}
                <Route
                    path="/checkout"
                    element={<CheckoutPage />}
                />

                {/* ORDERS */}
                <Route
                    path="/orders"
                    element={<OrderPage />}
                />

                {/* LOGIN */}
                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                {/* REGISTER */}
                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                {/* ACCOUNT */}
                <Route
                    path="/account"
                    element={<AccountPage />}
                />

                {/* ACCOUNT SETTINGS */}
                <Route
                    path="/account/settings"
                    element={<AccountPage />}
                />

                {/* ABOUT */}
                <Route
                    path="/about"
                    element={<AboutPage />}
                />

                {/* CONTACT */}
                <Route
                    path="/contact"
                    element={<ContactPage />}
                />

                {/* PAYHERE SUCCESS */}
                <Route
                    path="/payment/success"
                    element={<PaymentSuccess />}
                />

                {/* PAYHERE CANCEL */}
                <Route
                    path="/payment/cancel"
                    element={<PaymentCancel />}
                />

                {/* ADMIN */}
                <Route
                    path="/admin/*"
                    element={<AdminPage />}
                />

                {/* 404 */}
                <Route
                    path="*"
                    element={
                        <div
                            style={{
                                minHeight: "100vh",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                                gap: "12px",
                                padding: "40px",
                                textAlign: "center",
                            }}
                        >
                            <h1>404</h1>

                            <p>
                                Page not found.
                            </p>
                        </div>
                    }
                />
            </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
