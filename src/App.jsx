import "./App.css";

import {
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

// ============================================================
// MAIN PAGES
// ============================================================

import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import AdminPage from "./pages/adminPage";
import ProductPage from "./pages/productPage";
import CartPage from "./pages/cartPage";
import AboutPage from "./pages/aboutPage";
import ProductOverview from "./pages/productOverview";
import CheckoutPage from "./pages/checkoutPage";
import OrderPage from "./pages/orderPage";
import ContactPage from "./pages/contactPage";
import RegisterPage from "./pages/registerPage";
import AccountPage from "./pages/accountPage";

// ============================================================
// PAYHERE PAGES
// ============================================================

import PaymentSuccess from "./pages/paymentSuccess";
import PaymentCancel from "./pages/paymentCancel";


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
                APPLICATION ROUTES
            ================================================== */}

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
                    element={<RegisterPage />}
                />


                {/* =================================================
                    ACCOUNT
                ================================================== */}

                <Route
                    path="/account"
                    element={<AccountPage />}
                />


                {/* =================================================
                    ACCOUNT SETTINGS
                    Uses the same AccountPage
                ================================================== */}

                <Route
                    path="/account/settings"
                    element={<AccountPage />}
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
                    element={<ContactPage />}
                />


                {/* =================================================
                    PAYHERE PAYMENT SUCCESS
                ==================================================

                    PayHere will redirect here after payment.

                    Example:

                    /payment/success?order_id=MG-12345

                ================================================== */}

                <Route
                    path="/payment/success"
                    element={<PaymentSuccess />}
                />


                {/* =================================================
                    PAYHERE PAYMENT CANCEL
                ==================================================

                    PayHere will redirect here when the
                    customer cancels the payment.

                    Example:

                    /payment/cancel?order_id=MG-12345

                ================================================== */}

                <Route
                    path="/payment/cancel"
                    element={<PaymentCancel />}
                />


                {/* =================================================
                    ADMIN
                ================================================== */}

                <Route
                    path="/admin/*"
                    element={<AdminPage />}
                />


                {/* =================================================
                    OPTIONAL 404 PAGE
                ==================================================

                    If you don't have a separate 404 page,
                    this simple fallback prevents a blank page.

                ================================================== */}

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

        </BrowserRouter>
    );
}