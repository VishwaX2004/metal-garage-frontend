import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    ArrowLeft,
    ArrowRight,
    Check,
    Lock,
    Package,
    ShieldCheck,
    ShoppingBag,
    User,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import axios from "axios";
import toast from "react-hot-toast";

import Header from "../components/header";
import Footer from "../components/footer";


/* =========================================================
   SETTINGS
========================================================= */

const TAX_RATE = 0.0825;
const CART_STORAGE_KEY = "cart";


/* =========================================================
   HELPERS
========================================================= */

function currency(value) {
    const number = Number(value) || 0;

    return `Rs.${number
        .toFixed(2)
        .replace(/\.00$/, "")
        .replace(/(\.\d)0$/, "$1")}`;
}


function getProductId(product) {
    return (
        product?.productID ||
        product?._id ||
        product?.id ||
        product?.sku ||
        product?.name
    );
}


function getProductPrice(product) {
    return Number(product?.price) || 0;
}


function getProductImage(product) {
    if (
        Array.isArray(product?.images) &&
        product.images.length > 0 &&
        typeof product.images[0] === "string"
    ) {
        return product.images[0];
    }

    return null;
}


function normalizeCartItem(item) {
    const product =
        item?.product &&
        typeof item.product === "object"
            ? item.product
            : item;

    const productId =
        getProductId(product);

    const quantity = Math.max(
        1,
        Number(
            item?.cartQuantity ??
                item?.quantity ??
                1
        ) || 1
    );

    return {
        ...product,
        productID:
            product?.productID ||
            productId,
        cartQuantity: quantity,
    };
}


function readCart() {
    try {
        const stored =
            localStorage.getItem(
                CART_STORAGE_KEY
            );

        if (!stored) {
            return [];
        }

        const parsed =
            JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .map(normalizeCartItem)
            .filter((item) =>
                getProductId(item)
            );
    } catch (error) {
        console.error(
            "Unable to read cart:",
            error
        );

        return [];
    }
}


/* =========================================================
   USER
========================================================= */

function getLoggedInUser() {
    try {
        const possibleKeys = [
            "user",
            "currentUser",
            "loggedUser",
            "authUser",
        ];

        for (const key of possibleKeys) {
            const stored =
                localStorage.getItem(key);

            if (!stored) {
                continue;
            }

            const parsed =
                JSON.parse(stored);

            if (parsed) {
                return parsed;
            }
        }

        return null;
    } catch (error) {
        console.error(
            "Unable to read logged user:",
            error
        );

        return null;
    }
}


/* =========================================================
   TOKEN
========================================================= */

function getAuthToken() {
    return (
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("userToken")
    );
}


/* =========================================================
   PAGE
========================================================= */

export default function CheckoutPage() {
    const navigate =
        useNavigate();


    /* =====================================================
       STATE
    ===================================================== */

    const [cartItems, setCartItems] =
        useState(() => readCart());

    const [user, setUser] =
        useState(() =>
            getLoggedInUser()
        );

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [orderCreated, setOrderCreated] =
        useState(false);

    const [orderId, setOrderId] =
        useState("");


    /* =====================================================
       FORM
    ===================================================== */

    const [form, setForm] =
        useState({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            province: "",
            postalCode: "",
        });


    /* =====================================================
       LOAD AUTH USER
    ===================================================== */

    useEffect(() => {
        const loadUser = () => {
            const loggedUser =
                getLoggedInUser();

            setUser(loggedUser);

            if (loggedUser) {
                setForm((current) => ({
                    ...current,

                    firstName:
                        loggedUser.firstName ||
                        loggedUser.firstname ||
                        current.firstName ||
                        "",

                    lastName:
                        loggedUser.lastName ||
                        loggedUser.lastname ||
                        current.lastName ||
                        "",

                    email:
                        loggedUser.email ||
                        current.email ||
                        "",
                }));
            }
        };

        loadUser();

        /*
         * Listen for login/logout changes.
         */
        window.addEventListener(
            "authUpdated",
            loadUser
        );

        window.addEventListener(
            "storage",
            loadUser
        );

        return () => {
            window.removeEventListener(
                "authUpdated",
                loadUser
            );

            window.removeEventListener(
                "storage",
                loadUser
            );
        };
    }, []);


    /* =====================================================
       AUTH CHECK
    ===================================================== */

    useEffect(() => {
        /*
         * Do not redirect just because user state has not
         * initialized yet. Check localStorage directly.
         */
        const token =
            getAuthToken();

        const loggedUser =
            getLoggedInUser();

        if (!token || !loggedUser) {
            toast.error(
                "Please login before checkout."
            );

            navigate("/login", {
                replace: true,
                state: {
                    from: "/checkout",
                    message:
                        "Please login to continue checkout.",
                },
            });
        }
    }, [navigate]);


    /* =====================================================
       CART CHECK
    ===================================================== */

    useEffect(() => {
        if (
            cartItems.length === 0 &&
            !orderCreated
        ) {
            toast.error(
                "Your cart is empty."
            );

            navigate("/cart", {
                replace: true,
            });
        }
    }, [
        cartItems.length,
        navigate,
        orderCreated,
    ]);


    /* =====================================================
       TOTALS
    ===================================================== */

    const totals = useMemo(() => {
        let subtotal = 0;
        let count = 0;

        cartItems.forEach((item) => {
            const price =
                getProductPrice(item);

            const quantity =
                Math.max(
                    1,
                    Number(
                        item.cartQuantity
                    ) || 1
                );

            subtotal +=
                price * quantity;

            count += quantity;
        });

        const tax =
            subtotal * TAX_RATE;

        const total =
            subtotal + tax;

        return {
            subtotal,
            tax,
            total,
            count,
        };
    }, [cartItems]);


    /* =====================================================
       FORM CHANGE
    ===================================================== */

    function handleChange(event) {
        const {
            name,
            value,
        } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }


    /* =====================================================
       VALIDATE
    ===================================================== */

    function validateForm() {
        if (!user) {
            toast.error(
                "Please login to your account."
            );

            return false;
        }

        if (!form.firstName.trim()) {
            toast.error(
                "Please enter your first name."
            );

            return false;
        }

        if (!form.lastName.trim()) {
            toast.error(
                "Please enter your last name."
            );

            return false;
        }

        if (!form.email.trim()) {
            toast.error(
                "Email address is required."
            );

            return false;
        }

        if (!form.phone.trim()) {
            toast.error(
                "Please enter your phone number."
            );

            return false;
        }

        if (!form.address.trim()) {
            toast.error(
                "Please enter your delivery address."
            );

            return false;
        }

        if (!form.city.trim()) {
            toast.error(
                "Please enter your city."
            );

            return false;
        }

        if (!form.province.trim()) {
            toast.error(
                "Please enter your province."
            );

            return false;
        }

        return true;
    }


    /* =====================================================
       PLACE ORDER
    ===================================================== */

    async function handlePlaceOrder() {
        if (isSubmitting) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        if (cartItems.length === 0) {
            toast.error(
                "Your cart is empty."
            );

            return;
        }

        const token =
            getAuthToken();

        const loggedUser =
            getLoggedInUser();

        /*
         * Verify authentication one more time
         * immediately before submitting.
         */
        if (!token || !loggedUser) {
            toast.error(
                "Your login session is missing. Please login again."
            );

            navigate("/login", {
                state: {
                    from: "/checkout",
                },
            });

            return;
        }

        try {
            setIsSubmitting(true);

            const apiUrl =
                import.meta.env
                    .VITE_API_URL;

            if (!apiUrl) {
                throw new Error(
                    "VITE_API_URL is not configured."
                );
            }


            /* =============================================
               ORDER DATA
            ============================================= */

            const orderData = {
                /*
                 * Backend can use the JWT to identify
                 * the logged-in user.
                 */
                customer: {
                    firstName:
                        form.firstName.trim(),

                    lastName:
                        form.lastName.trim(),

                    email:
                        form.email
                            .trim()
                            .toLowerCase(),

                    phone:
                        form.phone.trim(),
                },

                /*
                 * Your Order schema requires:
                 * fullName
                 * phone
                 * email
                 * address
                 * city
                 * province
                 * postalCode
                 */
                shippingAddress: {
                    fullName:
                        `${form.firstName.trim()} ${form.lastName.trim()}`,

                    phone:
                        form.phone.trim(),

                    email:
                        form.email
                            .trim()
                            .toLowerCase(),

                    address:
                        form.address.trim(),

                    city:
                        form.city.trim(),

                    province:
                        form.province.trim(),

                    postalCode:
                        form.postalCode.trim(),

                    notes: "",
                },

                items: cartItems.map(
                    (item) => {
                        const quantity =
                            Math.max(
                                1,
                                Number(
                                    item.cartQuantity
                                ) || 1
                            );

                        const price =
                            getProductPrice(
                                item
                            );

                        return {
                            productID:
                                item.productID ||
                                getProductId(item),

                            name:
                                item.name ||
                                "Product",

                            image:
                                getProductImage(
                                    item
                                ),

                            price,

                            quantity,

                            total:
                                price *
                                quantity,
                        };
                    }
                ),

                subtotal:
                    totals.subtotal,

                discount: 0,

                total:
                    totals.total,

                promoCode: "",

                paymentMethod:
                    "Cash on Delivery",
            };


            /* =============================================
               API REQUEST
            ============================================= */

            const response =
                await axios.post(
                    `${apiUrl}/api/orders`,
                    orderData,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json",
                        },
                    }
                );


            /* =============================================
               CREATED ORDER
            ============================================= */

            const createdOrder =
                response.data?.order ||
                response.data;

            const createdId =
                createdOrder?.orderID ||
                createdOrder?._id ||
                createdOrder?.id ||
                "";

            setOrderId(
                createdId
            );


            /* =============================================
               CLEAR CART
            ============================================= */

            localStorage.removeItem(
                CART_STORAGE_KEY
            );

            window.dispatchEvent(
                new CustomEvent(
                    "cartUpdated",
                    {
                        detail: [],
                    }
                )
            );

            setCartItems([]);

            setOrderCreated(true);

            toast.success(
                "Order placed successfully!"
            );

        } catch (error) {
            console.error(
                "Create order error:",
                error
            );

            const status =
                error?.response?.status;

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Unable to create your order.";

            if (status === 401) {
                /*
                 * Authentication really failed at backend.
                 */
                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "authToken"
                );

                localStorage.removeItem(
                    "userToken"
                );

                localStorage.removeItem(
                    "user"
                );

                localStorage.removeItem(
                    "currentUser"
                );

                window.dispatchEvent(
                    new CustomEvent(
                        "authUpdated",
                        {
                            detail: null,
                        }
                    )
                );

                toast.error(
                    "Your login session has expired. Please login again."
                );

                navigate("/login", {
                    replace: true,
                    state: {
                        from: "/checkout",
                    },
                });

                return;
            }

            toast.error(
                message
            );
        } finally {
            setIsSubmitting(false);
        }
    }


    /* =====================================================
       SUCCESS PAGE
    ===================================================== */

    if (orderCreated) {
        return (
            <div className="min-h-screen bg-[#F5F5DC] text-[#0A0A0A]">
                <Header />

                <main className="flex min-h-[70vh] items-center justify-center px-5 py-20">
                    <div className="w-full max-w-[650px] rounded-[6px] border border-black/10 bg-[#F5F5DC] p-8 text-center shadow-[0_20px_60px_rgba(10,10,10,.08)] sm:p-12">

                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FF8F00]">
                            <Check
                                className="h-10 w-10"
                                strokeWidth={2.5}
                            />
                        </div>

                        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#FF8F00]">
                            GARAGE / ORDER CONFIRMED
                        </div>

                        <h1 className="mb-4 font-['Oswald'] text-[42px] font-bold uppercase leading-none sm:text-[56px]">
                            Order Placed
                        </h1>

                        <p className="mx-auto max-w-[480px] text-[14px] leading-6 text-black/55">
                            Thanks for your order,{" "}
                            {form.firstName}.
                            Your die-cast collection
                            order has been successfully
                            created.
                        </p>

                        {orderId && (
                            <div className="mt-6 rounded-[4px] border border-black/10 bg-black/5 px-5 py-4">
                                <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-black/40">
                                    ORDER ID
                                </div>

                                <div className="break-all font-mono text-[13px] font-semibold">
                                    {orderId}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/products"
                                    )
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-[#FF8F00] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.1em] transition hover:bg-[#FFA733]"
                            >
                                Continue Shopping

                                <ArrowRight className="h-4 w-4" />
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/")
                                }
                                className="rounded-[2px] border border-black/10 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.1em] transition hover:border-black"
                            >
                                Back Home
                            </button>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }


    /* =====================================================
       CHECKOUT PAGE
    ===================================================== */

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#F5F5DC] text-[#0A0A0A]">

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

                .checkout-work {
                    font-family: 'Work Sans', sans-serif;
                }

                .checkout-oswald {
                    font-family: 'Oswald', sans-serif;
                    text-transform: uppercase;
                    font-weight: 700;
                    line-height: 1.02;
                }

                .checkout-mono {
                    font-family: 'JetBrains Mono', monospace;
                }
            `}</style>

            <div className="checkout-work">

                <Header />

                {/* HERO */}
                <section className="bg-[#0A0A0A] px-5 py-14 text-[#F5F5DC] sm:px-10 lg:py-20">
                    <div className="mx-auto max-w-[1320px]">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/cart")
                            }
                            className="mb-7 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F5F5DC]/55 transition hover:text-[#FF8F00]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Cart
                        </button>

                        <div className="checkout-mono mb-3 text-[10px] uppercase tracking-[0.18em] text-[#FF8F00]">
                            GARAGE / CHECKOUT
                        </div>

                        <h1 className="checkout-oswald text-[48px] sm:text-[64px] lg:text-[78px]">
                            Complete Order
                        </h1>

                        <p className="mt-5 max-w-[550px] text-[14px] leading-6 text-[#F5F5DC]/50">
                            Confirm your delivery
                            information and place your
                            order securely.
                        </p>
                    </div>
                </section>


                {/* MAIN */}
                <main className="mx-auto max-w-[1320px] px-5 py-16 sm:px-10 lg:py-20">

                    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">

                        {/* CUSTOMER */}
                        <section>

                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF8F00]">
                                    <User className="h-4 w-4" />
                                </div>

                                <div>
                                    <div className="checkout-mono text-[9px] uppercase tracking-[0.14em] text-[#FF8F00]">
                                        STEP 01
                                    </div>

                                    <h2 className="checkout-oswald text-[28px]">
                                        Customer Details
                                    </h2>
                                </div>
                            </div>


                            <div className="rounded-[6px] border border-black/10 bg-[#F5F5DC] p-6 sm:p-8">

                                <div className="mb-6 flex items-center gap-2 rounded-[3px] bg-black/5 px-4 py-3">

                                    <ShieldCheck className="h-4 w-4 text-[#FF8F00]" />

                                    <span className="text-[11px] text-black/55">
                                        Signed in as{" "}
                                        <strong>
                                            {user?.email ||
                                                form.email}
                                        </strong>
                                    </span>
                                </div>


                                <div className="grid gap-5 sm:grid-cols-2">

                                    <InputField
                                        label="First Name"
                                        name="firstName"
                                        value={
                                            form.firstName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="First name"
                                    />

                                    <InputField
                                        label="Last Name"
                                        name="lastName"
                                        value={
                                            form.lastName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Last name"
                                    />
                                </div>


                                <div className="mt-5 grid gap-5 sm:grid-cols-2">

                                    <InputField
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={
                                            form.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Email address"
                                    />

                                    <InputField
                                        label="Phone"
                                        name="phone"
                                        value={
                                            form.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Phone number"
                                    />
                                </div>
                            </div>


                            {/* DELIVERY */}
                            <div className="mb-5 mt-10 flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF8F00]">
                                    <Package className="h-4 w-4" />
                                </div>

                                <div>
                                    <div className="checkout-mono text-[9px] uppercase tracking-[0.14em] text-[#FF8F00]">
                                        STEP 02
                                    </div>

                                    <h2 className="checkout-oswald text-[28px]">
                                        Delivery Details
                                    </h2>
                                </div>
                            </div>


                            <div className="rounded-[6px] border border-black/10 bg-[#F5F5DC] p-6 sm:p-8">

                                <InputField
                                    label="Address"
                                    name="address"
                                    value={
                                        form.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="House number, street, area"
                                />


                                <div className="mt-5 grid gap-5 sm:grid-cols-3">

                                    <InputField
                                        label="City"
                                        name="city"
                                        value={
                                            form.city
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="City"
                                    />

                                    <InputField
                                        label="Province"
                                        name="province"
                                        value={
                                            form.province
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Province"
                                    />

                                    <InputField
                                        label="Postal Code"
                                        name="postalCode"
                                        value={
                                            form.postalCode
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Postal code"
                                    />
                                </div>
                            </div>


                            {/* PAYMENT */}
                            <div className="mb-5 mt-10 flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF8F00]">
                                    <Lock className="h-4 w-4" />
                                </div>

                                <div>
                                    <div className="checkout-mono text-[9px] uppercase tracking-[0.14em] text-[#FF8F00]">
                                        STEP 03
                                    </div>

                                    <h2 className="checkout-oswald text-[28px]">
                                        Payment
                                    </h2>
                                </div>
                            </div>


                            <div className="rounded-[6px] border border-black/10 bg-[#F5F5DC] p-6 sm:p-8">

                                <div className="rounded-[4px] border-2 border-[#FF8F00] bg-[#FF8F00]/10 p-5">

                                    <div className="flex items-center justify-between">

                                        <div>
                                            <div className="text-[13px] font-semibold">
                                                Cash on Delivery
                                            </div>

                                            <div className="mt-1 text-[11px] text-black/45">
                                                Pay when your
                                                order arrives.
                                            </div>
                                        </div>

                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF8F00]">
                                            <Check className="h-3 w-3" />
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </section>


                        {/* SUMMARY */}
                        <aside className="h-fit overflow-hidden rounded-[6px] bg-[#0A0A0A] text-[#F5F5DC] lg:sticky lg:top-6">

                            <div className="p-6 sm:p-7">

                                <div className="checkout-mono mb-2 text-[9px] uppercase tracking-[0.16em] text-[#FF8F00]">
                                    GARAGE SUMMARY
                                </div>

                                <h2 className="checkout-oswald mb-6 text-[30px]">
                                    Your Order
                                </h2>


                                {/* PRODUCTS */}
                                <div className="max-h-[360px] space-y-4 overflow-y-auto pr-1">

                                    {cartItems.map(
                                        (item) => {

                                            const productId =
                                                getProductId(
                                                    item
                                                );

                                            const image =
                                                getProductImage(
                                                    item
                                                );

                                            const quantity =
                                                Number(
                                                    item.cartQuantity
                                                ) || 1;

                                            const price =
                                                getProductPrice(
                                                    item
                                                );

                                            return (
                                                <div
                                                    key={
                                                        productId
                                                    }
                                                    className="flex gap-3 border-b border-[#F5F5DC]/10 pb-4"
                                                >

                                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[3px] bg-[#F5F5DC]">

                                                        {image ? (
                                                            <img
                                                                src={
                                                                    image
                                                                }
                                                                alt={
                                                                    item.name ||
                                                                    "Product"
                                                                }
                                                                className="h-full w-full object-contain"
                                                            />
                                                        ) : (
                                                            <ShoppingBag className="h-5 w-5 text-black/20" />
                                                        )}

                                                    </div>


                                                    <div className="min-w-0 flex-1">

                                                        <h3 className="truncate text-[12px] font-semibold">
                                                            {
                                                                item.name
                                                            }
                                                        </h3>

                                                        <div className="mt-1 font-mono text-[9px] text-[#F5F5DC]/40">
                                                            QTY{" "}
                                                            {
                                                                quantity
                                                            }
                                                        </div>

                                                    </div>


                                                    <div className="font-mono text-[12px] font-semibold">
                                                        {currency(
                                                            price *
                                                                quantity
                                                        )}
                                                    </div>

                                                </div>
                                            );
                                        }
                                    )}

                                </div>


                                {/* TOTALS */}
                                <div className="mt-5 space-y-3 border-t border-[#F5F5DC]/10 pt-5">

                                    <div className="flex justify-between text-[12px] text-[#F5F5DC]/55">

                                        <span>
                                            Subtotal
                                        </span>

                                        <span className="checkout-mono">
                                            {currency(
                                                totals.subtotal
                                            )}
                                        </span>

                                    </div>


                                    <div className="flex justify-between text-[12px] text-[#F5F5DC]/55">

                                        <span>
                                            Tax
                                        </span>

                                        <span className="checkout-mono">
                                            {currency(
                                                totals.tax
                                            )}
                                        </span>

                                    </div>

                                </div>


                                {/* TOTAL */}
                                <div className="mt-5 border-t border-[#F5F5DC]/10 pt-5">

                                    <div className="flex items-end justify-between">

                                        <span className="checkout-oswald text-[20px]">
                                            Total
                                        </span>

                                        <span className="checkout-mono text-[25px] font-semibold text-[#FF8F00]">
                                            {currency(
                                                totals.total
                                            )}
                                        </span>

                                    </div>

                                </div>


                                {/* PLACE ORDER */}
                                <button
                                    type="button"
                                    disabled={
                                        isSubmitting
                                    }
                                    onClick={
                                        handlePlaceOrder
                                    }
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-[2px] bg-[#FF8F00] px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0A0A0A] transition hover:bg-[#FFA733] disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {isSubmitting ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />

                                            Creating Order...
                                        </>
                                    ) : (
                                        <>
                                            Place Order

                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}

                                </button>


                                <div className="mt-5 flex items-center gap-2 text-[9px] text-[#F5F5DC]/35">

                                    <ShieldCheck className="h-4 w-4" />

                                    Secure order processing

                                </div>

                            </div>

                        </aside>

                    </div>

                </main>

                <Footer />

            </div>
        </div>
    );
}


/* =========================================================
   INPUT COMPONENT
========================================================= */

function InputField({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
}) {
    return (
        <label className="block">

            <span className="checkout-mono mb-2 block text-[9px] font-semibold uppercase tracking-[0.1em] text-black/50">
                {label}
            </span>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-[3px] border border-black/10 bg-transparent px-4 py-3.5 text-[13px] outline-none transition placeholder:text-black/25 focus:border-[#FF8F00] focus:ring-1 focus:ring-[#FF8F00]/20"
            />

        </label>
    );
}

