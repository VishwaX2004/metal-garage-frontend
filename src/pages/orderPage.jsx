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
    Trash2,
    AlertTriangle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
    motion,
    AnimatePresence,
} from "framer-motion";

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
                    "bg-emerald-500/10 border-emerald-500/25",
                text: "text-emerald-500",
            };

        case "Shipped":
            return {
                wrapper:
                    "bg-blue-500/10 border-blue-500/25",
                text: "text-blue-500",
            };

        case "Confirmed":
            return {
                wrapper:
                    "bg-[#FF8F00]/10 border-[#FF8F00]/25",
                text: "text-[#D97700]",
            };

        case "Processing":
            return {
                wrapper:
                    "bg-purple-500/10 border-purple-500/25",
                text: "text-purple-600",
            };

        case "Cancelled":
            return {
                wrapper:
                    "bg-red-500/10 border-red-500/25",
                text: "text-red-500",
            };

        default:
            return {
                wrapper:
                    "bg-yellow-500/10 border-yellow-500/25",
                text: "text-yellow-600",
            };
    }
}

// =============================================================
// ANIMATION VARIANTS
// =============================================================

const pageVariants = {
    hidden: {
        opacity: 0,
    },

    visible: {
        opacity: 1,

        transition: {
            duration: 0.45,
            ease: "easeOut",
        },
    },
};

const headerVariants = {
    hidden: {
        opacity: 0,
        y: -25,
    },

    visible: {
        opacity: 1,
        y: 0,

        transition: {
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const contentVariants = {
    hidden: {
        opacity: 0,
        y: 20,
    },

    visible: {
        opacity: 1,
        y: 0,

        transition: {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const orderVariants = {
    hidden: {
        opacity: 0,
        y: 35,
        scale: 0.985,
    },

    visible: (index) => ({
        opacity: 1,
        y: 0,
        scale: 1,

        transition: {
            duration: 0.55,
            delay: index * 0.08,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

const itemVariants = {
    hidden: {
        opacity: 0,
        x: -15,
    },

    visible: (index) => ({
        opacity: 1,
        x: 0,

        transition: {
            duration: 0.4,
            delay: index * 0.05,
            ease: "easeOut",
        },
    }),
};

const modalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.94,
        y: 15,
    },

    visible: {
        opacity: 1,
        scale: 1,
        y: 0,

        transition: {
            duration: 0.25,
            ease: [0.22, 1, 0.36, 1],
        },
    },

    exit: {
        opacity: 0,
        scale: 0.96,
        y: 10,

        transition: {
            duration: 0.18,
            ease: "easeIn",
        },
    },
};

// =============================================================
// ORDER PAGE
// =============================================================

export default function OrderPage() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [deleteOrderData, setDeleteOrderData] =
        useState(null);

    const [deleting, setDeleting] =
        useState(false);

    // =========================================================
    // SCROLL TO TOP
    // =========================================================

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);

    // =========================================================
    // FETCH ORDERS
    // =========================================================

    const fetchOrders = useCallback(
        async (showRefresh = false) => {
            const token = getToken();

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

                const response = await axios.get(
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

                if (
                    err.response?.status === 401 ||
                    err.response?.status === 403
                ) {
                    localStorage.removeItem("token");
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
                    err.response?.data?.message ||
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
    // DELETE ORDER
    // =========================================================

    const handleDeleteOrder = async () => {
        if (!deleteOrderData) {
            return;
        }

        const token = getToken();

        if (!token) {
            setDeleteOrderData(null);

            toast.error(
                "Please login to delete your order."
            );

            navigate("/login");

            return;
        }

        try {
            setDeleting(true);

            const orderID =
                deleteOrderData.orderID;

            await axios.delete(
                `${API_URL}/api/orders/${encodeURIComponent(
                    orderID
                )}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            setOrders((currentOrders) =>
                currentOrders.filter(
                    (order) =>
                        order.orderID !== orderID
                )
            );

            setDeleteOrderData(null);

            toast.success(
                "Order deleted successfully."
            );
        } catch (err) {
            console.error(
                "Delete order error:",
                err
            );

            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {
                localStorage.removeItem("token");
                localStorage.removeItem(
                    "accessToken"
                );
                localStorage.removeItem(
                    "authToken"
                );

                setDeleteOrderData(null);

                toast.error(
                    "Your session has expired. Please login again."
                );

                navigate("/login");

                return;
            }

            const message =
                err.response?.data?.message ||
                "Unable to delete the order.";

            toast.error(message);
        } finally {
            setDeleting(false);
        }
    };

    // =========================================================
    // DELETE CONFIRMATION
    // =========================================================

    const openDeleteConfirmation = (order) => {
        if (!order?.orderID) {
            toast.error(
                "Unable to identify this order."
            );

            return;
        }

        setDeleteOrderData(order);
    };

    const closeDeleteConfirmation = () => {
        if (deleting) {
            return;
        }

        setDeleteOrderData(null);
    };

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
            <div className="min-h-screen overflow-hidden bg-[#F5F5DC] text-[#0A0A0A]">
                <Header />

                <main className="pt-[78px]">
                    <div className="mx-auto flex min-h-[70vh] max-w-[1320px] items-center justify-center px-5 sm:px-10">
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.5,
                            }}
                            className="flex flex-col items-center text-center"
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.04, 1],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#0A0A0A]"
                            >
                                <motion.div
                                    className="absolute inset-0 rounded-full border border-[#FF8F00]/30"
                                    animate={{
                                        scale: [
                                            1,
                                            1.35,
                                            1,
                                        ],
                                        opacity: [
                                            0.6,
                                            0,
                                            0.6,
                                        ],
                                    }}
                                    transition={{
                                        duration: 1.8,
                                        repeat: Infinity,
                                        ease: "easeOut",
                                    }}
                                />

                                <Loader2 className="relative z-10 h-7 w-7 animate-spin text-[#FF8F00]" />
                            </motion.div>

                            <h2 className="font-['Oswald',sans-serif] text-2xl uppercase tracking-wide">
                                Loading Orders
                            </h2>

                            <p className="mt-2 font-['Work_Sans',sans-serif] text-sm text-[#0A0A0A]/60">
                                Checking your garage collection history...
                            </p>

                            <div className="mt-5 h-[2px] w-[100px] bg-[#FF8F00]" />
                        </motion.div>
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
        <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen bg-[#F5F5DC] text-[#0A0A0A]"
        >
            <Header />

            <main className="pt-[78px]">

                {/* =================================================
                    PAGE HEADER
                ================================================== */}

                <motion.section
                    variants={headerVariants}
                    initial="hidden"
                    animate="visible"
                    className="border-b border-[#0A0A0A]/10 bg-[#0A0A0A]"
                >
                    <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-10 sm:py-20">

                        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">

                            <div>
                                <p className="mb-3 font-['JetBrains_Mono',monospace] text-[11px] uppercase tracking-[0.2em] text-[#FF8F00]">
                                    Metal Garage · Account
                                </p>

                                <h1 className="font-['Oswald',sans-serif] text-5xl font-bold uppercase leading-none tracking-tight text-[#F5F5DC] sm:text-6xl">
                                    My Orders
                                </h1>

                                <p className="mt-5 max-w-xl font-['Work_Sans',sans-serif] text-sm leading-6 text-[#F5F5DC]/65">
                                    Track your die-cast purchases,
                                    order status and collection
                                    history.
                                </p>
                            </div>

                            <div className="flex items-center gap-4">

                                <motion.div
                                    whileHover={{
                                        y: -3,
                                    }}
                                    className="border border-[#F5F5DC]/15 bg-[#F5F5DC]/5 px-6 py-4"
                                >
                                    <p className="font-['JetBrains_Mono',monospace] text-[10px] uppercase tracking-widest text-[#F5F5DC]/45">
                                        Total Orders
                                    </p>

                                    <p className="mt-1 font-['Oswald',sans-serif] text-3xl font-bold text-[#F5F5DC]">
                                        {orders.length}
                                    </p>
                                </motion.div>

                                <motion.button
                                    type="button"
                                    onClick={() =>
                                        fetchOrders(true)
                                    }
                                    disabled={refreshing}
                                    whileHover={{
                                        scale: 1.04,
                                    }}
                                    whileTap={{
                                        scale: 0.94,
                                    }}
                                    className="flex h-[58px] w-[58px] items-center justify-center border border-[#F5F5DC]/15 bg-[#F5F5DC]/5 text-[#F5F5DC] transition-all duration-200 hover:border-[#FF8F00] hover:text-[#FF8F00] disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label="Refresh orders"
                                >
                                    <RefreshCw
                                        className={`h-5 w-5 ${
                                            refreshing
                                                ? "animate-spin"
                                                : ""
                                        }`}
                                    />
                                </motion.button>

                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* =================================================
                    ORDERS CONTENT
                ================================================== */}

                <motion.section
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    className="mx-auto max-w-[1320px] px-5 py-10 sm:px-10 sm:py-14"
                >

                    {/* ERROR */}

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: -15,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -10,
                                }}
                                className="mb-8 border border-red-500/20 bg-red-500/5 p-5"
                            >
                                <div className="flex items-start gap-4">
                                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                                    <div>
                                        <h3 className="font-['Work_Sans',sans-serif] text-base font-semibold text-red-600">
                                            Unable to load orders
                                        </h3>

                                        <p className="mt-1 text-sm text-[#0A0A0A]/65">
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* =================================================
                        EMPTY ORDERS
                    ================================================== */}

                    {!error &&
                        orders.length === 0 && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 25,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                className="flex min-h-[50vh] items-center justify-center"
                            >
                                <div className="max-w-md text-center">

                                    <motion.div
                                        whileHover={{
                                            scale: 1.04,
                                            rotate: 2,
                                        }}
                                        className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-[#0A0A0A]"
                                    >
                                        <ShoppingBag
                                            className="h-10 w-10 text-[#FF8F00]"
                                            strokeWidth={1.5}
                                        />
                                    </motion.div>

                                    <p className="font-['JetBrains_Mono',monospace] text-[10px] uppercase tracking-[0.2em] text-[#FF8F00]">
                                        Garage Empty
                                    </p>

                                    <h2 className="mt-2 font-['Oswald',sans-serif] text-4xl font-bold uppercase">
                                        No Orders Yet
                                    </h2>

                                    <p className="mt-4 text-sm leading-6 text-[#0A0A0A]/65">
                                        You haven't placed an
                                        order yet. Start building
                                        your collection and your
                                        purchases will appear here.
                                    </p>

                                    <motion.button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                "/products"
                                            )
                                        }
                                        whileHover={{
                                            scale: 1.03,
                                            x: 3,
                                        }}
                                        whileTap={{
                                            scale: 0.97,
                                        }}
                                        className="mt-7 inline-flex items-center gap-3 bg-[#0A0A0A] px-7 py-4 font-['Work_Sans',sans-serif] text-xs font-semibold uppercase tracking-[0.12em] text-[#F5F5DC] transition-all duration-200 hover:bg-[#FF8F00] hover:text-[#0A0A0A]"
                                    >
                                        Start Shopping

                                        <ArrowRight className="h-4 w-4" />
                                    </motion.button>

                                </div>
                            </motion.div>
                        )}

                    {/* =================================================
                        ORDER LIST
                    ================================================== */}

                    {orders.length > 0 && (
                        <div className="space-y-8">

                            {orders.map(
                                (
                                    order,
                                    orderIndex
                                ) => {
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
                                        <motion.article
                                            key={
                                                order._id ||
                                                order.orderID ||
                                                orderIndex
                                            }
                                            custom={
                                                orderIndex
                                            }
                                            variants={
                                                orderVariants
                                            }
                                            initial="hidden"
                                            animate="visible"
                                            whileHover={{
                                                y: -3,
                                            }}
                                            className="overflow-hidden border border-[#0A0A0A]/10 bg-white/50 shadow-sm transition-shadow duration-300 hover:shadow-lg"
                                        >

                                            {/* =================================================
                                                ORDER TOP
                                            ================================================== */}

                                            <div className="border-b border-[#F5F5DC]/10 bg-[#0A0A0A] p-5 sm:p-7">

                                                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                                                    <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">

                                                        {/* ORDER ID */}

                                                        <div>
                                                            <p className="font-['JetBrains_Mono',monospace] text-[11px] font-medium uppercase tracking-[0.16em] text-[#F5F5DC]/50">
                                                                Order ID
                                                            </p>

                                                            <p className="mt-1.5 break-all font-['JetBrains_Mono',monospace] text-sm font-bold text-[#F5F5DC]">
                                                                {order.orderID ||
                                                                    "N/A"}
                                                            </p>
                                                        </div>

                                                        {/* DATE */}

                                                        <div>
                                                            <p className="font-['JetBrains_Mono',monospace] text-[11px] font-medium uppercase tracking-[0.16em] text-[#F5F5DC]/50">
                                                                Date
                                                            </p>

                                                            <div className="mt-1.5 flex items-center gap-2 font-['Work_Sans',sans-serif] text-sm font-medium text-[#F5F5DC]">
                                                                <CalendarDays className="h-4 w-4 shrink-0 text-[#FF8F00]" />

                                                                {formatDate(
                                                                    order.createdAt
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* PAYMENT */}

                                                        <div>
                                                            <p className="font-['JetBrains_Mono',monospace] text-[11px] font-medium uppercase tracking-[0.16em] text-[#F5F5DC]/50">
                                                                Payment
                                                            </p>

                                                            <div className="mt-1.5 flex items-center gap-2 font-['Work_Sans',sans-serif] text-sm font-medium text-[#F5F5DC]">
                                                                <CreditCard className="h-4 w-4 shrink-0 text-[#FF8F00]" />

                                                                {order.paymentMethod ||
                                                                    "Cash on Delivery"}
                                                            </div>
                                                        </div>

                                                        {/* TOTAL */}

                                                        <div>
                                                            <p className="font-['JetBrains_Mono',monospace] text-[11px] font-medium uppercase tracking-[0.16em] text-[#F5F5DC]/50">
                                                                Total
                                                            </p>

                                                            <p className="mt-0.5 font-['Oswald',sans-serif] text-2xl font-bold text-[#FF8F00]">
                                                                {formatPrice(
                                                                    order.total
                                                                )}
                                                            </p>
                                                        </div>

                                                    </div>

                                                    {/* STATUS */}

                                                    <motion.div
                                                        whileHover={{
                                                            scale: 1.03,
                                                        }}
                                                        className={`inline-flex w-fit items-center gap-2.5 border px-5 py-3 ${statusClasses.wrapper} ${statusClasses.text}`}
                                                    >
                                                        <StatusIcon className="h-5 w-5" />

                                                        <span className="font-['Work_Sans',sans-serif] text-sm font-bold uppercase tracking-wider">
                                                            {status}
                                                        </span>
                                                    </motion.div>

                                                </div>
                                            </div>

                                            {/* =================================================
                                                ORDER ITEMS
                                            ================================================== */}

                                            <div className="p-5 sm:p-7">

                                                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                                    <div>
                                                        <p className="font-['JetBrains_Mono',monospace] text-[10px] font-medium uppercase tracking-[0.18em] text-[#0A0A0A]/50">
                                                            Collection
                                                        </p>

                                                        <h3 className="mt-1 font-['Oswald',sans-serif] text-2xl font-bold uppercase">
                                                            {order.items?.length ||
                                                                0}{" "}
                                                            Product
                                                            {order.items?.length ===
                                                            1
                                                                ? ""
                                                                : "s"}
                                                        </h3>
                                                    </div>

                                                    {/* DELETE */}

                                                    <motion.button
                                                        type="button"
                                                        onClick={() =>
                                                            openDeleteConfirmation(
                                                                order
                                                            )
                                                        }
                                                        disabled={
                                                            deleting
                                                        }
                                                        whileHover={{
                                                            scale: 1.03,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.97,
                                                        }}
                                                        className="inline-flex w-fit items-center gap-2 border border-red-500/25 bg-red-500/5 px-4 py-2.5 font-['Work_Sans',sans-serif] text-xs font-bold uppercase tracking-[0.08em] text-red-600 transition-all duration-200 hover:border-red-500 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />

                                                        Delete Order
                                                    </motion.button>

                                                </div>

                                                <div className="divide-y divide-[#0A0A0A]/10">

                                                    {(order.items || []).map(
                                                        (
                                                            item,
                                                            itemIndex
                                                        ) => (
                                                            <motion.div
                                                                key={`${order.orderID}-${item.productID}-${itemIndex}`}
                                                                custom={
                                                                    itemIndex
                                                                }
                                                                variants={
                                                                    itemVariants
                                                                }
                                                                initial="hidden"
                                                                animate="visible"
                                                                className="flex gap-4 py-6 first:pt-0 last:pb-0"
                                                            >

                                                                {/* IMAGE */}

                                                                <motion.div
                                                                    whileHover={{
                                                                        scale: 1.03,
                                                                    }}
                                                                    className="h-24 w-24 shrink-0 overflow-hidden border border-[#0A0A0A]/10 bg-[#ECE8D6] sm:h-28 sm:w-28"
                                                                >
                                                                    {item.image ? (
                                                                        <img
                                                                            src={
                                                                                item.image
                                                                            }
                                                                            alt={
                                                                                item.name ||
                                                                                "Product"
                                                                            }
                                                                            className="h-full w-full object-contain p-2 transition-transform duration-500 hover:scale-105"
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
                                                                </motion.div>

                                                                {/* DETAILS */}

                                                                <div className="min-w-0 flex-1">

                                                                    <p className="font-['JetBrains_Mono',monospace] text-[10px] font-medium uppercase tracking-[0.15em] text-[#0A0A0A]/50">
                                                                        {item.productID ||
                                                                            "PRODUCT"}
                                                                    </p>

                                                                    <h4 className="mt-1 line-clamp-2 font-['Oswald',sans-serif] text-xl font-semibold uppercase leading-tight">
                                                                        {item.name ||
                                                                            "Unnamed Product"}
                                                                    </h4>

                                                                    <div className="mt-2.5 flex flex-wrap items-center gap-x-6 gap-y-2 font-['Work_Sans',sans-serif] text-sm text-[#0A0A0A]/65">

                                                                        <span>
                                                                            Qty:{" "}
                                                                            <strong className="font-bold text-[#0A0A0A]">
                                                                                {item.quantity ||
                                                                                    0}
                                                                            </strong>
                                                                        </span>

                                                                        <span>
                                                                            Unit:{" "}
                                                                            <strong className="font-semibold text-[#0A0A0A]">
                                                                                {formatPrice(
                                                                                    item.price
                                                                                )}
                                                                            </strong>
                                                                        </span>

                                                                    </div>
                                                                </div>

                                                                {/* ITEM TOTAL */}

                                                                <div className="shrink-0 text-right">

                                                                    <p className="font-['JetBrains_Mono',monospace] text-[10px] font-medium uppercase tracking-wider text-[#0A0A0A]/50">
                                                                        Total
                                                                    </p>

                                                                    <p className="mt-1 font-['Oswald',sans-serif] text-xl font-bold">
                                                                        {formatPrice(
                                                                            item.total
                                                                        )}
                                                                    </p>

                                                                </div>

                                                            </motion.div>
                                                        )
                                                    )}

                                                </div>

                                                {/* =================================================
                                                    ORDER SUMMARY
                                                ================================================== */}

                                                <div className="mt-8 grid gap-6 border-t border-[#0A0A0A]/10 pt-7 md:grid-cols-2">

                                                    {/* ADDRESS */}

                                                    <motion.div
                                                        whileHover={{
                                                            y: -2,
                                                        }}
                                                        className="border border-[#0A0A0A]/10 bg-[#ECE8D6]/60 p-5 sm:p-6"
                                                    >

                                                        <div className="flex items-center gap-2.5">

                                                            <MapPin className="h-5 w-5 text-[#FF8F00]" />

                                                            <h4 className="font-['Work_Sans',sans-serif] text-sm font-bold uppercase tracking-wider">
                                                                Delivery Address
                                                            </h4>

                                                        </div>

                                                        <div className="mt-4 space-y-0.5 font-['Work_Sans',sans-serif] text-[15px] leading-7 text-[#0A0A0A]/70">

                                                            <p className="text-base font-bold text-[#0A0A0A]">
                                                                {order.shippingAddress?.fullName ||
                                                                    "Name unavailable"}
                                                            </p>

                                                            <p>
                                                                {order.shippingAddress?.address ||
                                                                    "Address unavailable"}
                                                            </p>

                                                            <p>
                                                                {order.shippingAddress?.city ||
                                                                    "City"}
                                                                {order.shippingAddress?.province
                                                                    ? `, ${order.shippingAddress.province}`
                                                                    : ""}
                                                            </p>

                                                            {order.shippingAddress?.postalCode && (
                                                                <p>
                                                                    {order.shippingAddress.postalCode}
                                                                </p>
                                                            )}

                                                            {order.shippingAddress?.phone && (
                                                                <p className="pt-1 font-semibold text-[#0A0A0A]">
                                                                    {order.shippingAddress.phone}
                                                                </p>
                                                            )}

                                                        </div>

                                                    </motion.div>

                                                    {/* PRICE SUMMARY */}

                                                    <motion.div
                                                        whileHover={{
                                                            y: -2,
                                                        }}
                                                        className="border border-[#0A0A0A]/10 bg-[#ECE8D6]/60 p-5 sm:p-6"
                                                    >

                                                        <h4 className="font-['Work_Sans',sans-serif] text-sm font-bold uppercase tracking-wider">
                                                            Order Summary
                                                        </h4>

                                                        <div className="mt-5 space-y-4 font-['Work_Sans',sans-serif] text-[15px]">

                                                            {/* SUBTOTAL */}

                                                            <div className="flex items-center justify-between gap-4">
                                                                <span className="text-[#0A0A0A]/60">
                                                                    Subtotal
                                                                </span>

                                                                <span className="font-semibold">
                                                                    {formatPrice(
                                                                        order.subtotal
                                                                    )}
                                                                </span>
                                                            </div>

                                                            {/* DISCOUNT */}

                                                            {Number(
                                                                order.discount
                                                            ) > 0 && (
                                                                <div className="flex items-center justify-between gap-4 text-emerald-600">
                                                                    <span>
                                                                        Discount
                                                                    </span>

                                                                    <span className="font-semibold">
                                                                        -{" "}
                                                                        {formatPrice(
                                                                            order.discount
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* PROMO */}

                                                            {order.promoCode && (
                                                                <div className="flex items-center justify-between gap-4">
                                                                    <span className="text-[#0A0A0A]/50">
                                                                        Promo
                                                                    </span>

                                                                    <span className="font-['JetBrains_Mono',monospace] text-xs font-bold">
                                                                        {
                                                                            order.promoCode
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* GRAND TOTAL */}

                                                            <div className="flex items-center justify-between gap-4 border-t border-[#0A0A0A]/10 pt-4">

                                                                <span className="font-bold uppercase tracking-wide">
                                                                    Grand Total
                                                                </span>

                                                                <span className="font-['Oswald',sans-serif] text-2xl font-bold text-[#FF8F00] sm:text-3xl">
                                                                    {formatPrice(
                                                                        order.total
                                                                    )}
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </motion.div>

                                                </div>
                                            </div>

                                        </motion.article>
                                    );
                                }
                            )}

                        </div>
                    )}

                </motion.section>
            </main>

            <Footer />

            {/* =====================================================
                DELETE CONFIRMATION MODAL
            ====================================================== */}

            <AnimatePresence>
                {deleteOrderData && (
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
                        onClick={
                            closeDeleteConfirmation
                        }
                    >

                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full max-w-md border border-[#0A0A0A]/10 bg-[#F5F5DC] p-6 shadow-2xl sm:p-8"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >

                            <motion.div
                                initial={{
                                    scale: 0.7,
                                    opacity: 0,
                                }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                }}
                                transition={{
                                    delay: 0.08,
                                    duration: 0.3,
                                }}
                                className="mb-5 flex h-14 w-14 items-center justify-center bg-red-500/10"
                            >
                                <AlertTriangle className="h-7 w-7 text-red-500" />
                            </motion.div>

                            <p className="font-['JetBrains_Mono',monospace] text-[10px] uppercase tracking-[0.18em] text-red-500">
                                Delete Order
                            </p>

                            <h2 className="mt-2 font-['Oswald',sans-serif] text-3xl font-bold uppercase">
                                Are you sure?
                            </h2>

                            <p className="mt-4 text-sm leading-6 text-[#0A0A0A]/65">
                                This will permanently remove
                                order{" "}
                                <strong className="text-[#0A0A0A]">
                                    {
                                        deleteOrderData.orderID
                                    }
                                </strong>{" "}
                                from your order history.
                            </p>

                            <p className="mt-3 text-xs leading-5 text-red-600">
                                This action cannot be undone.
                            </p>

                            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                <motion.button
                                    type="button"
                                    onClick={
                                        closeDeleteConfirmation
                                    }
                                    disabled={deleting}
                                    whileHover={{
                                        scale: 1.02,
                                    }}
                                    whileTap={{
                                        scale: 0.98,
                                    }}
                                    className="flex items-center justify-center border border-[#0A0A0A]/15 px-5 py-3 font-['Work_Sans',sans-serif] text-xs font-semibold uppercase tracking-wider text-[#0A0A0A] transition-all duration-200 hover:border-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </motion.button>

                                <motion.button
                                    type="button"
                                    onClick={
                                        handleDeleteOrder
                                    }
                                    disabled={deleting}
                                    whileHover={{
                                        scale: 1.02,
                                    }}
                                    whileTap={{
                                        scale: 0.98,
                                    }}
                                    className="flex items-center justify-center gap-2 bg-red-500 px-5 py-3 font-['Work_Sans',sans-serif] text-xs font-semibold uppercase tracking-wider text-white transition-all duration-200 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {deleting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4" />
                                            Delete Order
                                        </>
                                    )}
                                </motion.button>

                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
}
