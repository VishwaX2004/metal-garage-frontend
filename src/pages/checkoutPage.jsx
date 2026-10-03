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
    CreditCard,
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

const CART_STORAGE_KEY =
    "cart";


/* =========================================================
   HELPERS
========================================================= */

function currency(value) {
    const number =
        Number(value) || 0;

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
    return (
        Number(
            product?.price
        ) || 0
    );
}


function getProductImage(product) {
    if (
        Array.isArray(
            product?.images
        ) &&
        product.images.length >
            0 &&
        typeof product.images[0] ===
            "string"
    ) {
        return product.images[0];
    }

    return null;
}


function normalizeCartItem(item) {
    const product =
        item?.product &&
        typeof item.product ===
            "object"
            ? item.product
            : item;

    const productId =
        getProductId(product);

    const quantity =
        Math.max(
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

        cartQuantity:
            quantity,
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

        if (
            !Array.isArray(parsed)
        ) {
            return [];
        }

        return parsed
            .map(
                normalizeCartItem
            )
            .filter(
                (item) =>
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

        for (
            const key of possibleKeys
        ) {
            const stored =
                localStorage.getItem(
                    key
                );

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
        localStorage.getItem(
            "token"
        ) ||
        localStorage.getItem(
            "authToken"
        ) ||
        localStorage.getItem(
            "userToken"
        )
    );
}


/* =========================================================
   CLEAR CART
========================================================= */

function clearCart() {
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
        useState(
            () => readCart()
        );


    const [user, setUser] =
        useState(
            () =>
                getLoggedInUser()
        );


    const [isSubmitting, setIsSubmitting] =
        useState(false);


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

            paymentMethod:
                "PayHere",
        });


    /* =====================================================
       LOAD USER
    ===================================================== */

    useEffect(() => {

        const loadUser =
            () => {

                const loggedUser =
                    getLoggedInUser();

                setUser(
                    loggedUser
                );


                if (
                    loggedUser
                ) {
                    setForm(
                        (current) => ({
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
                        })
                    );
                }
            };


        loadUser();


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

        const token =
            getAuthToken();

        const loggedUser =
            getLoggedInUser();


        if (
            !token ||
            !loggedUser
        ) {
            toast.error(
                "Please login before checkout."
            );

            navigate(
                "/login",
                {
                    replace: true,

                    state: {
                        from:
                            "/checkout",
                    },
                }
            );
        }

    }, [navigate]);


    /* =====================================================
       CART CHECK
    ===================================================== */

    useEffect(() => {

        if (
            cartItems.length === 0
        ) {
            toast.error(
                "Your cart is empty."
            );

            navigate(
                "/cart",
                {
                    replace: true,
                }
            );
        }

    }, [
        cartItems.length,
        navigate,
    ]);


    /* =====================================================
       TOTALS
    ===================================================== */

    const totals =
        useMemo(() => {

            let subtotal = 0;

            let count = 0;


            cartItems.forEach(
                (item) => {

                    const price =
                        getProductPrice(
                            item
                        );

                    const quantity =
                        Math.max(
                            1,
                            Number(
                                item.cartQuantity
                            ) || 1
                        );


                    subtotal +=
                        price *
                        quantity;


                    count +=
                        quantity;
                }
            );


            const tax =
                Number(
                    (
                        subtotal *
                        TAX_RATE
                    ).toFixed(2)
                );


            const total =
                Number(
                    (
                        subtotal +
                        tax
                    ).toFixed(2)
                );


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

    function handleChange(
        event
    ) {
        const {
            name,
            value,
        } = event.target;


        setForm(
            (current) => ({
                ...current,

                [name]:
                    value,
            })
        );
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


        if (
            !form.firstName.trim()
        ) {
            toast.error(
                "Please enter your first name."
            );

            return false;
        }


        if (
            !form.lastName.trim()
        ) {
            toast.error(
                "Please enter your last name."
            );

            return false;
        }


        if (
            !form.email.trim()
        ) {
            toast.error(
                "Email address is required."
            );

            return false;
        }


        if (
            !form.phone.trim()
        ) {
            toast.error(
                "Please enter your phone number."
            );

            return false;
        }


        if (
            !form.address.trim()
        ) {
            toast.error(
                "Please enter your delivery address."
            );

            return false;
        }


        if (
            !form.city.trim()
        ) {
            toast.error(
                "Please enter your city."
            );

            return false;
        }


        if (
            !form.province.trim()
        ) {
            toast.error(
                "Please enter your province."
            );

            return false;
        }


        return true;
    }


    /* =====================================================
       START PAYHERE
    ===================================================== */

    async function startPayHerePayment(
        orderID,
        token
    ) {

        const apiUrl =
            import.meta.env
                .VITE_API_URL;


        const response =
            await axios.post(
                `${apiUrl}/api/payments/payhere/create`,

                {
                    orderId:
                        orderID,
                },

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json",
                    },
                }
            );


        const payment =
            response.data?.payment;


        if (!payment) {
            throw new Error(
                "PayHere payment data was not returned."
            );
        }


        /*
         * PayHere requires a normal HTML form POST.
         */

        const formElement =
            document.createElement(
                "form"
            );


        formElement.method =
            "POST";


        formElement.action =
            payment.action;


        Object.entries(
            payment
        ).forEach(
            ([key, value]) => {

                if (
                    key === "action"
                ) {
                    return;
                }


                const input =
                    document.createElement(
                        "input"
                    );


                input.type =
                    "hidden";


                input.name =
                    key;


                input.value =
                    value ?? "";


                formElement.appendChild(
                    input
                );
            }
        );


        document.body.appendChild(
            formElement
        );


        /*
         * Submit to PayHere Sandbox.
         */

        formElement.submit();
    }


    /* =====================================================
       PLACE ORDER
    ===================================================== */

    async function handlePlaceOrder() {

        if (
            isSubmitting
        ) {
            return;
        }


        if (
            !validateForm()
        ) {
            return;
        }


        if (
            cartItems.length === 0
        ) {
            toast.error(
                "Your cart is empty."
            );

            return;
        }


        const token =
            getAuthToken();


        const loggedUser =
            getLoggedInUser();


        if (
            !token ||
            !loggedUser
        ) {
            toast.error(
                "Your login session is missing. Please login again."
            );

            navigate(
                "/login",
                {
                    state: {
                        from:
                            "/checkout",
                    },
                }
            );

            return;
        }


        try {

            setIsSubmitting(
                true
            );


            const apiUrl =
                import.meta.env
                    .VITE_API_URL;


            if (!apiUrl) {
                throw new Error(
                    "VITE_API_URL is not configured."
                );
            }


            /* =================================================
               ORDER DATA
            ================================================= */

            const orderData = {

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

                    notes:
                        "",
                },


                items:
                    cartItems.map(
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
                                    getProductId(
                                        item
                                    ),

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


                promoCode:
                    "",


                discount:
                    0,


                /*
                 * IMPORTANT:
                 * Backend calculates the real
                 * total from MongoDB.
                 */

                paymentMethod:
                    form.paymentMethod,
            };


            /* =================================================
               CREATE ORDER
            ================================================= */

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


            const createdOrder =
                response.data?.order ||
                response.data;


            const createdOrderID =
                createdOrder?.orderID;


            if (!createdOrderID) {
                throw new Error(
                    "Order was created but no order ID was returned."
                );
            }


            /* =================================================
               PAYHERE
            ================================================= */

            if (
                form.paymentMethod ===
                "PayHere"
            ) {

                /*
                 * Do NOT clear cart here.
                 *
                 * PayHere must finish first.
                 */

                await startPayHerePayment(
                    createdOrderID,
                    token
                );


                return;
            }


            /* =================================================
               CASH ON DELIVERY
            ================================================= */

            clearCart();

            setCartItems([]);


            toast.success(
                "Order placed successfully!"
            );


            navigate(
                `/orders/${createdOrderID}`
            );

        } catch (error) {

            console.error(
                "Checkout error:",
                error
            );


            const status =
                error?.response?.status;


            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Unable to place your order.";


            if (
                status === 401
            ) {

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
                            detail:
                                null,
                        }
                    )
                );


                toast.error(
                    "Your login session has expired. Please login again."
                );


                navigate(
                    "/login",
                    {
                        replace:
                            true,

                        state: {
                            from:
                                "/checkout",
                        },
                    }
                );


                return;
            }


            toast.error(
                message
            );

        } finally {

            setIsSubmitting(
                false
            );
        }
    }


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#F5F5DC] text-[#0A0A0A]">

            <style>
                {`
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
                `}
            </style>


            <div className="checkout-work">

                <Header />


                {/* =================================================
                    HERO
                ================================================= */}

                <section className="bg-[#0A0A0A] px-5 py-14 text-[#F5F5DC] sm:px-10 lg:py-20">

                    <div className="mx-auto max-w-[1320px]">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/cart"
                                )
                            }
                            className="mb-7 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F5F5DC]/55 transition hover:text-[#FF8F00]"
                        >
                            <ArrowLeft
                                className="h-4 w-4"
                            />

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
                            information and choose
                            your payment method.
                        </p>

                    </div>

                </section>


                {/* =================================================
                    MAIN
                ================================================= */}

                <main className="mx-auto max-w-[1320px] px-5 py-16 sm:px-10 lg:py-20">

                    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">


                        {/* =================================================
                            LEFT
                        ================================================= */}

                        <section>


                            {/* CUSTOMER */}

                            <SectionTitle
                                number="01"
                                icon={
                                    <User className="h-4 w-4" />
                                }
                                title="Customer Details"
                            />


                            <div className="rounded-[6px] border border-black/10 bg-[#F5F5DC] p-6 sm:p-8">

                                <div className="mb-6 flex items-center gap-2 rounded-[3px] bg-black/5 px-4 py-3">

                                    <ShieldCheck className="h-4 w-4 text-[#FF8F00]" />

                                    <span className="text-[11px] text-black/55">

                                        Signed in as{" "}

                                        <strong>
                                            {
                                                user?.email ||
                                                form.email
                                            }
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


                            {/* =================================================
                                DELIVERY
                            ================================================= */}

                            <div className="mt-10">

                                <SectionTitle
                                    number="02"
                                    icon={
                                        <Package className="h-4 w-4" />
                                    }
                                    title="Delivery Details"
                                />


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
                                        placeholder="Delivery address"
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

                            </div>


                            {/* =================================================
                                PAYMENT
                            ================================================= */}

                            <div className="mt-10">

                                <SectionTitle
                                    number="03"
                                    icon={
                                        <CreditCard className="h-4 w-4" />
                                    }
                                    title="Payment"
                                />


                                <div className="space-y-4">


                                    {/* PAYHERE */}

                                    <PaymentOption
                                        selected={
                                            form.paymentMethod ===
                                            "PayHere"
                                        }
                                        value="PayHere"
                                        onChange={
                                            handleChange
                                        }
                                        title="PayHere"
                                        description="Secure online payment through PayHere Sandbox."
                                        icon={
                                            <CreditCard className="h-5 w-5" />
                                        }
                                    />


                                    {/* COD */}

                                    <PaymentOption
                                        selected={
                                            form.paymentMethod ===
                                            "Cash on Delivery"
                                        }
                                        value="Cash on Delivery"
                                        onChange={
                                            handleChange
                                        }
                                        title="Cash on Delivery"
                                        description="Pay when your order arrives."
                                        icon={
                                            <ShoppingBag className="h-5 w-5" />
                                        }
                                    />

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            RIGHT
                        ================================================= */}

                        <aside className="lg:sticky lg:top-24 lg:self-start">


                            {/* ORDER SUMMARY */}

                            <div className="rounded-[6px] bg-[#0A0A0A] p-6 text-[#F5F5DC] sm:p-8">

                                <div className="mb-6 flex items-center justify-between">

                                    <div>

                                        <div className="checkout-mono text-[9px] uppercase tracking-[0.15em] text-[#FF8F00]">
                                            GARAGE
                                        </div>

                                        <h2 className="checkout-oswald mt-1 text-[28px]">
                                            Order Summary
                                        </h2>

                                    </div>


                                    <ShoppingBag className="h-5 w-5 text-[#FF8F00]" />

                                </div>


                                {/* ITEMS */}

                                <div className="space-y-4">

                                    {cartItems.map(
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

                                            return (
                                                <div
                                                    key={
                                                        getProductId(
                                                            item
                                                        )
                                                    }
                                                    className="flex justify-between gap-4 border-b border-[#F5F5DC]/10 pb-4"
                                                >

                                                    <div>

                                                        <div className="text-[12px] font-semibold">
                                                            {
                                                                item.name
                                                            }
                                                        </div>

                                                        <div className="mt-1 text-[10px] text-[#F5F5DC]/40">
                                                            Qty {quantity}
                                                        </div>

                                                    </div>


                                                    <div className="checkout-mono text-[11px] text-[#FF8F00]">
                                                        {
                                                            currency(
                                                                price *
                                                                quantity
                                                            )
                                                        }
                                                    </div>

                                                </div>
                                            );
                                        }
                                    )}

                                </div>


                                {/* TOTALS */}

                                <div className="mt-6 space-y-3">

                                    <div className="flex justify-between text-[12px] text-[#F5F5DC]/55">

                                        <span>
                                            Subtotal
                                        </span>

                                        <span className="checkout-mono">
                                            {
                                                currency(
                                                    totals.subtotal
                                                )
                                            }
                                        </span>

                                    </div>


                                    <div className="flex justify-between text-[12px] text-[#F5F5DC]/55">

                                        <span>
                                            Tax
                                        </span>

                                        <span className="checkout-mono">
                                            {
                                                currency(
                                                    totals.tax
                                                )
                                            }
                                        </span>

                                    </div>


                                    <div className="border-t border-[#F5F5DC]/10 pt-5">

                                        <div className="flex items-end justify-between">

                                            <span className="checkout-oswald text-[20px]">
                                                Total
                                            </span>

                                            <span className="checkout-mono text-[25px] font-semibold text-[#FF8F00]">
                                                {
                                                    currency(
                                                        totals.total
                                                    )
                                                }
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* BUTTON */}

                                <button
                                    type="button"
                                    disabled={
                                        isSubmitting
                                    }
                                    onClick={
                                        handlePlaceOrder
                                    }
                                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-[2px] bg-[#FF8F00] px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0A0A0A] transition hover:bg-[#FFA733] disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {isSubmitting ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />

                                            Redirecting...
                                        </>
                                    ) : (
                                        <>
                                            {form.paymentMethod ===
                                            "PayHere"
                                                ? "Pay Securely with PayHere"
                                                : "Place Order"}

                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}

                                </button>


                                <div className="mt-5 flex items-center gap-2 text-[9px] text-[#F5F5DC]/35">

                                    <Lock className="h-4 w-4" />

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
   SECTION TITLE
========================================================= */

function SectionTitle({
    number,
    icon,
    title,
}) {
    return (
        <div className="mb-5 flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF8F00]">
                {icon}
            </div>

            <div>

                <div className="checkout-mono text-[9px] uppercase tracking-[0.14em] text-[#FF8F00]">
                    STEP {number}
                </div>

                <h2 className="checkout-oswald text-[28px]">
                    {title}
                </h2>

            </div>

        </div>
    );
}


/* =========================================================
   PAYMENT OPTION
========================================================= */

function PaymentOption({
    selected,
    value,
    onChange,
    title,
    description,
    icon,
}) {
    return (
        <label
            className={`block cursor-pointer rounded-[6px] border-2 p-5 transition ${
                selected
                    ? "border-[#FF8F00] bg-[#FF8F00]/10"
                    : "border-black/10 bg-[#F5F5DC] hover:border-black/25"
            }`}
        >

            <input
                type="radio"
                name="paymentMethod"
                value={value}
                checked={selected}
                onChange={onChange}
                className="sr-only"
            />


            <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-4">

                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            selected
                                ? "bg-[#FF8F00]"
                                : "bg-black/5"
                        }`}
                    >
                        {icon}
                    </div>


                    <div>

                        <div className="text-[13px] font-semibold">
                            {title}
                        </div>

                        <div className="mt-1 text-[11px] text-black/45">
                            {description}
                        </div>

                    </div>

                </div>


                <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full ${
                        selected
                            ? "bg-[#FF8F00]"
                            : "border border-black/20"
                    }`}
                >

                    {selected && (
                        <Check className="h-3 w-3" />
                    )}

                </div>

            </div>

        </label>
    );
}


/* =========================================================
   INPUT
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