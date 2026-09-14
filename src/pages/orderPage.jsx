import {
    useCallback,
    useEffect,
    useState,
} from "react";

import axios from "axios";

import toast from "react-hot-toast";

import {
    Package,
    Truck,
    CheckCircle2,
    Clock3,
    XCircle,
    MapPin,
    CalendarDays,
    CreditCard,
    RefreshCw,
    ShoppingBag,
    ArrowRight,
    Loader2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Header from "../components/header";
import Footer from "../components/footer";

// =============================================================
// API URL
// =============================================================

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

// =============================================================
// HELPERS
// =============================================================

function getToken() {
    return (
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        null
    );
}

function formatPrice(value) {
    return `Rs. ${Number(value || 0).toLocaleString(
        "en-LK",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )}`;
}

function formatDate(date) {
    if (!date) {
        return "Date unavailable";
    }

    try {
        return new Date(date).toLocaleDateString(
            "en-LK",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        );
    } catch {
        return "Date unavailable";
    }
}

function getStatusIcon(status) {
    switch (status) {
        case "Delivered":
            return CheckCircle2;

        case "Shipped":
            return Truck;

        case "Cancelled":
            return XCircle;

        case "Confirmed":
        case "Processing":
            return Package;

        default:
            return Clock3;
    }
}

function getStatusClasses(status) {
    switch (status) {
        case "Delivered":
            return {
                wrapper:
                    "bg-emerald-500/10 border-emerald-500/20",
                text: "text-emerald-400",
            };

        case "Shipped":
            return {
                wrapper:
                    "bg-blue-500/10 border-blue-500/20",
                text: "text-blue-400",
            };

        case "Confirmed":
            return {
                wrapper:
                    "bg-[#FF8F00]/10 border-[#FF8F00]/20",
                text: "text-[#FF8F00]",
            };

        case "Processing":
            return {
                wrapper:
                    "bg-purple-500/10 border-purple-500/20",
                text: "text-purple-400",
            };

        case "Cancelled":
            return {
                wrapper:
                    "bg-red-500/10 border-red-500/20",
                text: "text-red-400",
            };

        default:
            return {
                wrapper:
                    "bg-yellow-500/10 border-yellow-500/20",
                text: "text-yellow-400",
            };
    }
}

// =============================================================
// ORDER PAGE
// =============================================================

export default function OrderPage() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] = useState("");

    // =========================================================
    // FETCH ORDERS
    // =========================================================

    const fetchOrders = useCallback(
        async (showRefresh = false) => {
            const token = getToken();

            // ---------------------------------------------------
            // USER NOT LOGGED IN
            // ---------------------------------------------------

            if (!token) {
                setOrders([]);
                setLoading(false);
                setRefreshing(false);

                toast.error(
                    "Please login to view your orders."
                );

                navigate("/login");

                return;
            }

            try {
                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const response =
                    await axios.get(
                        `${API_URL}/api/orders/my-orders`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                const receivedOrders =
                    response.data?.orders;

                if (
                    Array.isArray(
                        receivedOrders
                    )
                ) {
                    setOrders(receivedOrders);
                } else {
                    setOrders([]);
                }
            } catch (err) {
                console.error(
                    "Fetch orders error:",
                    err
                );

                // ------------------------------------------------
                // TOKEN INVALID / EXPIRED
                // ------------------------------------------------

                if (
                    err.response?.status ===
                        401 ||
                    err.response?.status === 403
                ) {
                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "accessToken"
                    );

                    localStorage.removeItem(
                        "authToken"
                    );

                    setOrders([]);

                    toast.error(
                        "Your session has expired. Please login again."
                    );

                    navigate("/login");

                    return;
                }

                const message =
                    err.response?.data
                        ?.message ||
                    "Unable to load your orders.";

                setError(message);

                toast.error(message);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [navigate]
    );

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // =========================================================
    // LOADING STATE
    // =========================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F5DC] text-[#0A0A0A]">
                <Header />

                <main className="pt-[78px]">
                    <div className="mx-auto flex min-h-[70vh] max-w-[1320px] items-center justify-center px-5 sm:px-10">
                        <div className="flex flex-col items-center text-center">

                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#0A0A0A]/10 bg-[#0A0A0A]">
                                <Loader2
                                    className="h-7 w-7 animate-spin text-[#FF8F00]"
                                />
                            </div>

                            <h2 className="font-['Oswald',sans-serif] text-2xl uppercase tracking-wide">
                                Loading Orders
                            </h2>

                            <p className="mt-2 font-['Work_Sans',sans-serif] text-sm text-[#0A0A0A]/60">
                                Checking your garage collection history...
                            </p>

                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    // =========================================================
    // PAGE
    // =========================================================

    return (
        <div className="min-h-screen bg-[#F5F5DC] text-[#0A0A0A]">

            <Header />

            <main className="pt-[78px]">

                {/* =================================================
                    PAGE HEADER
                ================================================== */}

                <section className="border-b border-[#0A0A0A]/10 bg-[#0A0A0A]">
                    <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-10 sm:py-20">

                        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">

                            <div>
                                <p className="mb-3 font-['JetBrains_Mono',monospace] text-[11px] uppercase tracking-[0.2em] text-[#FF8F00]">
                                    Metal Garage · Account
                                </p>

                                <h1 className="font-['Oswald',sans-serif] text-5xl font-bold uppercase leading-none tracking-tight text-[#F5F5DC] sm:text-6xl">
                                    My Orders
                                </h1>

                                <p className="mt-5 max-w-xl font-['Work_Sans',sans-serif] text-sm leading-6 text-[#F5F5DC]/60">
                                    Track your die-cast purchases,
                                    order status and collection
                                    history.
                                </p>
                            </div>

                            {/* Order count */}

                            <div className="flex items-center gap-4">

                                <div className="border border-[#F5F5DC]/10 bg-[#F5F5DC]/5 px-6 py-4">
                                    <p className="font-['JetBrains_Mono',monospace] text-[10px] uppercase tracking-widest text-[#F5F5DC]/40">
                                        Total Orders
                                    </p>

                                    <p className="mt-1 font-['Oswald',sans-serif] text-3xl font-bold text-[#F5F5DC]">
                                        {orders.length}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        fetchOrders(true)
                                    }
                                    disabled={refreshing}
                                    className="
                                        flex
                                        h-[58px]
                                        w-[58px]
                                        items-center
                                        justify-center
                                        border
                                        border-[#F5F5DC]/10
                                        bg-[#F5F5DC]/5
                                        text-[#F5F5DC]
                                        transition-all
                                        duration-200
                                        hover:border-[#FF8F00]
                                        hover:text-[#FF8F00]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                    aria-label="Refresh orders"
                                >
                                    <RefreshCw
                                        className={`h-5 w-5 ${
                                            refreshing
                                                ? "animate-spin"
                                                : ""
                                        }`}
                                    />
                                </button>

                            </div>

                        </div>

                    </div>
                </section>

                {/* =================================================
                    ORDERS CONTENT
                ================================================== */}

                <section className="mx-auto max-w-[1320px] px-5 py-10 sm:px-10 sm:py-14">

                    {/* ERROR */}

                    {error && (
                        <div className="mb-8 border border-red-500/20 bg-red-500/5 p-5">

                            <div className="flex items-start gap-4">

                                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                                <div>
                                    <h3 className="font-['Work_Sans',sans-serif] font-semibold text-red-600">
                                        Unable to load orders
                                    </h3>

                                    <p className="mt-1 text-sm text-[#0A0A0A]/60">
                                        {error}
                                    </p>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* =================================================
                        EMPTY ORDERS
                    ================================================== */}

                    {!error &&
                        orders.length === 0 && (
                            <div className="flex min-h-[50vh] items-center justify-center">

                                <div className="max-w-md text-center">

                                    <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-[#0A0A0A]">
                                        <ShoppingBag
                                            className="h-10 w-10 text-[#FF8F00]"
                                            strokeWidth={1.5}
                                        />
                                    </div>

                                    <p className="font-['JetBrains_Mono',monospace] text-[10px] uppercase tracking-[0.2em] text-[#FF8F00]">
                                        Garage Empty
                                    </p>

                                    <h2 className="mt-2 font-['Oswald',sans-serif] text-4xl font-bold uppercase">
                                        No Orders Yet
                                    </h2>

                                    <p className="mt-4 text-sm leading-6 text-[#0A0A0A]/60">
                                        You haven't placed an
                                        order yet. Start building
                                        your collection and your
                                        purchases will appear here.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                "/products"
                                            )
                                        }
                                        className="
                                            mt-7
                                            inline-flex
                                            items-center
                                            gap-3
                                            bg-[#0A0A0A]
                                            px-7
                                            py-4
                                            font-['Work_Sans',sans-serif]
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-[0.12em]
                                            text-[#F5F5DC]
                                            transition-all
                                            duration-200
                                            hover:bg-[#FF8F00]
                                            hover:text-[#0A0A0A]
                                        "
                                    >
                                        Start Shopping

                                        <ArrowRight className="h-4 w-4" />
                                    </button>

                                </div>
                            </div>
                        )}

                    {/* =================================================
                        ORDER LIST
                    ================================================== */}

                    {orders.length > 0 && (
                        <div className="space-y-8">

                            {orders.map(
                                (order, orderIndex) => {
                                    const status =
                                        order.orderStatus ||
                                        "Pending";

                                    const StatusIcon =
                                        getStatusIcon(
                                            status
                                        );

                                    const statusClasses =
                                        getStatusClasses(
                                            status
                                        );

                                    return (
                                        <article
                                            key={
                                                order._id ||
                                                order.orderID ||
                                                orderIndex
                                            }
                                            className="
                                                overflow-hidden
                                                border
                                                border-[#0A0A0A]/10
                                                bg-white/40
                                                shadow-sm
                                            "
                                        >

                                            {/* =====================
                                                ORDER TOP
                                            ====================== */}

                                            <div className="border-b border-[#0A0A0A]/10 bg-[#0A0A0A] p-5 sm:p-7">

                                                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                                    <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">

                                                        {/* Order ID */}

                                                        <div>
                                                            <p className="font-['JetBrains_Mono',monospace] text-[9px] uppercase tracking-[0.16em] text-[#F5F5DC]/40">
                                                                Order ID
                                                            </p>

                                                            <p className="mt-1 font-['JetBrains_Mono',monospace] text-xs font-semibold text-[#F5F5DC]">
                                                                {order.orderID ||
                                                                    "N/A"}
                                                            </p>
                                                        </div>

                                                        {/* Date */}

                                                        <div>
                                                            <p className="font-['JetBrains_Mono',monospace] text-[9px] uppercase tracking-[0.16em] text-[#F5F5DC]/40">
                                                                Date
                                                            </p>

                                                            <div className="mt-1 flex items-center gap-1.5 text-xs text-[#F5F5DC]">
                                                                <CalendarDays className="h-3.5 w-3.5 text-[#FF8F00]" />

                                                                {formatDate(
                                                                    order.createdAt
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Payment */}

                                                        <div>
                                                            <p className="font-['JetBrains_Mono',monospace] text-[9px] uppercase tracking-[0.16em] text-[#F5F5DC]/40">
                                                                Payment
                                                            </p>

                                                            <div className="mt-1 flex items-center gap-1.5 text-xs text-[#F5F5DC]">
                                                                <CreditCard className="h-3.5 w-3.5 text-[#FF8F00]" />

                                                                {order.paymentMethod ||
                                                                    "Cash on Delivery"}
                                                            </div>
                                                        </div>

                                                        {/* Total */}

                                                        <div>
                                                            <p className="font-['JetBrains_Mono',monospace] text-[9px] uppercase tracking-[0.16em] text-[#F5F5DC]/40">
                                                                Total
                                                            </p>

                                                            <p className="mt-1 font-['Oswald',sans-serif] text-xl font-bold text-[#FF8F00]">
                                                                {formatPrice(
                                                                    order.total
                                                                )}
                                                            </p>
                                                        </div>

                                                    </div>

                                                    {/* STATUS */}

                                                    <div
                                                        className={`
                                                            inline-flex
                                                            w-fit
                                                            items-center
                                                            gap-2
                                                            border
                                                            px-4
                                                            py-2.5
                                                            ${statusClasses.wrapper}
                                                            ${statusClasses.text}
                                                        `}
                                                    >
                                                        <StatusIcon className="h-4 w-4" />

                                                        <span className="font-['Work_Sans',sans-serif] text-xs font-semibold uppercase tracking-wider">
                                                            {status}
                                                        </span>
                                                    </div>

                                                </div>

                                            </div>

                                            {/* =====================
                                                ORDER ITEMS
                                            ====================== */}

                                            <div className="p-5 sm:p-7">

                                                <div className="mb-5 flex items-center justify-between">

                                                    <div>
                                                        <p className="font-['JetBrains_Mono',monospace] text-[9px] uppercase tracking-[0.18em] text-[#0A0A0A]/40">
                                                            Collection
                                                        </p>

                                                        <h3 className="mt-1 font-['Oswald',sans-serif] text-xl font-bold uppercase">
                                                            {order.items?.length ||
                                                                0}{" "}
                                                            Product
                                                            {order.items?.length ===
                                                            1
                                                                ? ""
                                                                : "s"}
                                                        </h3>
                                                    </div>

                                                </div>

                                                <div className="divide-y divide-[#0A0A0A]/10">

                                                    {(
                                                        order.items ||
                                                        []
                                                    ).map(
                                                        (
                                                            item,
                                                            itemIndex
                                                        ) => (
                                                            <div
                                                                key={`${order.orderID}-${item.productID}-${itemIndex}`}
                                                                className="flex gap-4 py-5 first:pt-0 last:pb-0"
                                                            >

                                                                {/* IMAGE */}

                                                                <div className="h-24 w-24 shrink-0 overflow-hidden border border-[#0A0A0A]/10 bg-[#ECE8D6] sm:h-28 sm:w-28">

                                                                    {item.image ? (
                                                                        <img
                                                                            src={
                                                                                item.image
                                                                            }
                                                                            alt={
                                                                                item.name ||
                                                                                "Product"
                                                                            }
                                                                            className="h-full w-full object-contain p-2"
                                                                            onError={(
                                                                                event
                                                                            ) => {
                                                                                event.currentTarget.style.display =
                                                                                    "none";
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div className="flex h-full w-full items-center justify-center">
                                                                            <Package className="h-7 w-7 text-[#0A0A0A]/20" />
                                                                        </div>
                                                                    )}

                                                                </div>

                                                                {/* DETAILS */}

                                                                <div className="min-w-0 flex-1">

                                                                    <p className="font-['JetBrains_Mono',monospace] text-[9px] uppercase tracking-[0.15em] text-[#0A0A0A]/40">
                                                                        {item.productID ||
                                                                            "PRODUCT"}
                                                                    </p>

                                                                    <h4 className="mt-1 line-clamp-2 font-['Oswald',sans-serif] text-lg font-semibold uppercase">
                                                                        {item.name ||
                                                                            "Unnamed Product"}
                                                                    </h4>

                                                                    <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#0A0A0A]/55">

                                                                        <span>
                                                                            Qty:{" "}
                                                                            <strong className="text-[#0A0A0A]">
                                                                                {item.quantity ||
                                                                                    0}
                                                                            </strong>
                                                                        </span>

                                                                        <span>
                                                                            Unit:{" "}
                                                                            <strong className="text-[#0A0A0A]">
                                                                                {formatPrice(
                                                                                    item.price
                                                                                )}
                                                                            </strong>
                                                                        </span>

                                                                    </div>

                                                                </div>

                                                                {/* ITEM TOTAL */}

                                                                <div className="shrink-0 text-right">

                                                                    <p className="font-['JetBrains_Mono',monospace] text-[9px] uppercase tracking-wider text-[#0A0A0A]/40">
                                                                        Total
                                                                    </p>

                                                                    <p className="mt-1 font-['Oswald',sans-serif] text-lg font-bold">
                                                                        {formatPrice(
                                                                            item.total
                                                                        )}
                                                                    </p>

                                                                </div>

                                                            </div>
                                                        )
                                                    )}

                                                </div>

                                                {/* =====================
                                                    ORDER SUMMARY
                                                ====================== */}

                                                <div className="mt-7 grid gap-6 border-t border-[#0A0A0A]/10 pt-6 md:grid-cols-2">

                                                    {/* ADDRESS */}

                                                    <div className="border border-[#0A0A0A]/10 bg-[#ECE8D6]/40 p-5">

                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4 text-[#FF8F00]" />

                                                            <h4 className="font-['Work_Sans',sans-serif] text-xs font-bold uppercase tracking-wider">
                                                                Delivery Address
                                                            </h4>
                                                        </div>

                                                        <div className="mt-3 text-sm leading-6 text-[#0A0A0A]/65">

                                                            <p className="font-semibold text-[#0A0A0A]">
                                                                {
                                                                    order.shippingAddress
                                                                        ?.fullName
                                                                }
                                                            </p>

                                                            <p>
                                                                {
                                                                    order.shippingAddress
                                                                        ?.address
                                                                }
                                                            </p>

                                                            <p>
                                                                {
                                                                    order.shippingAddress
                                                                        ?.city
                                                                }
                                                                ,{" "}
                                                                {
                                                                    order.shippingAddress
                                                                        ?.province
                                                                }
                                                            </p>

                                                            {order
                                                                .shippingAddress
                                                                ?.postalCode && (
                                                                <p>
                                                                    {
                                                                        order
                                                                            .shippingAddress
                                                                            .postalCode
                                                                    }
                                                                </p>
                                                            )}

                                                            <p className="mt-1">
                                                                {
                                                                    order.shippingAddress
                                                                        ?.phone
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                    {/* PRICE SUMMARY */}

                                                    <div className="border border-[#0A0A0A]/10 bg-[#ECE8D6]/40 p-5">

                                                        <h4 className="font-['Work_Sans',sans-serif] text-xs font-bold uppercase tracking-wider">
                                                            Order Summary
                                                        </h4>

                                                        <div className="mt-4 space-y-3 text-sm">

                                                            <div className="flex justify-between">
                                                                <span className="text-[#0A0A0A]/55">
                                                                    Subtotal
                                                                </span>

                                                                <span className="font-medium">
                                                                    {formatPrice(
                                                                        order.subtotal
                                                                    )}
                                                                </span>
                                                            </div>

                                                            {Number(
                                                                order.discount
                                                            ) >
                                                                0 && (
                                                                <div className="flex justify-between text-emerald-600">
                                                                    <span>
                                                                        Discount
                                                                    </span>

                                                                    <span>
                                                                        -{" "}
                                                                        {formatPrice(
                                                                            order.discount
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {order.promoCode && (
                                                                <div className="flex justify-between text-xs">
                                                                    <span className="text-[#0A0A0A]/45">
                                                                        Promo
                                                                    </span>

                                                                    <span className="font-['JetBrains_Mono',monospace] font-semibold">
                                                                        {
                                                                            order.promoCode
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}

                                                            <div className="flex justify-between border-t border-[#0A0A0A]/10 pt-3">
                                                                <span className="font-semibold uppercase">
                                                                    Grand Total
                                                                </span>

                                                                <span className="font-['Oswald',sans-serif] text-2xl font-bold text-[#FF8F00]">
                                                                    {formatPrice(
                                                                        order.total
                                                                    )}
                                                                </span>
                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        </article>
                                    );
                                }
                            )}

                        </div>
                    )}

                </section>
            </main>

            <Footer />
        </div>
    );
}

