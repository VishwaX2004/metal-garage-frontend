import {
    useEffect,
    useState,
} from "react";

import {
    CheckCircle2,
    Clock3,
    ArrowRight,
} from "lucide-react";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import axios from "axios";

import Header from "../components/header";
import Footer from "../components/footer";

const MAX_ATTEMPTS = 15;
const POLL_INTERVAL = 2000;

export default function PaymentSuccess() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const orderID = searchParams.get("order_id");

    const [status, setStatus] = useState("checking");

    useEffect(() => {
        if (!orderID) {
            setStatus("missing");
            return;
        }

        let cancelled = false;
        let attempts = 0;
        let timer = null;

        async function checkPayment() {
            try {
                const token =
                    localStorage.getItem("token") ||
                    localStorage.getItem("authToken") ||
                    localStorage.getItem("userToken");

                if (!token) {
                    if (!cancelled) {
                        setStatus("login");
                    }
                    return;
                }

                const apiUrl = import.meta.env.VITE_API_URL;

                const response = await axios.get(
                    `${apiUrl}/api/orders/${encodeURIComponent(
                        orderID
                    )}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (cancelled) {
                    return;
                }

                const currentOrder =
                    response.data?.order || response.data;

                if (currentOrder?.paymentStatus === "Paid") {
                    /*
                     * Payment confirmed.
                     */
                    localStorage.removeItem("cart");

                    window.dispatchEvent(
                        new CustomEvent("cartUpdated", {
                            detail: [],
                        })
                    );

                    setStatus("paid");
                    return;
                }

                if (
                    currentOrder?.paymentStatus === "Failed" ||
                    currentOrder?.paymentStatus === "Refunded"
                ) {
                    setStatus("failed");
                    return;
                }
            } catch (error) {
                console.error("Payment status error:", error);
            }

            /*
             * PayHere notification may arrive slightly
             * after the browser redirect.
             *
             * Poll for about 30 seconds, then stop.
             */
            attempts += 1;

            if (cancelled) {
                return;
            }

            if (attempts >= MAX_ATTEMPTS) {
                setStatus("timeout");
                return;
            }

            timer = setTimeout(checkPayment, POLL_INTERVAL);
        }

        checkPayment();

        return () => {
            cancelled = true;

            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [orderID]);

    /* =====================================================
       PAID
    ===================================================== */

    if (status === "paid") {
        return (
            <PaymentLayout>
                <div className="mx-auto max-w-[650px] rounded-[6px] border border-black/10 bg-[#F5F5DC] p-8 text-center sm:p-12">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FF8F00]">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>

                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#FF8F00]">
                        GARAGE / PAYMENT CONFIRMED
                    </div>

                    <h1 className="mt-3 font-['Oswald'] text-[48px] font-bold uppercase leading-none">
                        Payment Successful
                    </h1>

                    <p className="mx-auto mt-5 max-w-[480px] text-[14px] leading-6 text-black/55">
                        Your PayHere payment has been
                        successfully confirmed.
                    </p>

                    {orderID && (
                        <div className="mt-6 rounded-[4px] border border-black/10 bg-black/5 px-5 py-4">
                            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/40">
                                ORDER ID
                            </div>

                            <div className="mt-1 font-mono text-[13px] font-semibold">
                                {orderID}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            type="button"
                            onClick={() => navigate("/orders")}
                            className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-[#FF8F00] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.1em] hover:bg-[#FFA733]"
                        >
                            View Orders

                            <ArrowRight className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/products")}
                            className="rounded-[2px] border border-black/10 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.1em]"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </PaymentLayout>
        );
    }

    /* =====================================================
       FAILED
    ===================================================== */

    if (status === "failed") {
        return (
            <PaymentLayout>
                <div className="mx-auto max-w-[650px] rounded-[6px] border border-red-500/20 bg-[#F5F5DC] p-8 text-center sm:p-12">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
                        <Clock3 className="h-10 w-10 text-red-600" />
                    </div>

                    <h1 className="font-['Oswald'] text-[48px] font-bold uppercase">
                        Payment Failed
                    </h1>

                    <p className="mt-5 text-[14px] leading-6 text-black/55">
                        The PayHere payment was not completed.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/checkout")}
                        className="mt-8 rounded-[2px] bg-[#FF8F00] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.1em]"
                    >
                        Back to Checkout
                    </button>
                </div>
            </PaymentLayout>
        );
    }

    /* =====================================================
       LOGIN
    ===================================================== */

    if (status === "login") {
        return (
            <PaymentLayout>
                <div className="mx-auto max-w-[650px] p-12 text-center">
                    <h1 className="font-['Oswald'] text-[42px] font-bold uppercase">
                        Please Login
                    </h1>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="mt-8 rounded-[2px] bg-[#FF8F00] px-6 py-4 text-[11px] font-semibold uppercase"
                    >
                        Login
                    </button>
                </div>
            </PaymentLayout>
        );
    }

    /* =====================================================
       TIMEOUT (still not confirmed after polling)
    ===================================================== */

    if (status === "timeout") {
        return (
            <PaymentLayout>
                <div className="mx-auto max-w-[650px] rounded-[6px] border border-black/10 bg-[#F5F5DC] p-8 text-center sm:p-12">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FF8F00]/15">
                        <Clock3 className="h-10 w-10 text-[#FF8F00]" />
                    </div>

                    <h1 className="font-['Oswald'] text-[42px] font-bold uppercase leading-none">
                        Still Processing
                    </h1>

                    <p className="mx-auto mt-5 max-w-[470px] text-[14px] leading-6 text-black/55">
                        We have not received the payment
                        confirmation yet. It may take a
                        little longer. You can check your
                        orders for the latest status.
                    </p>

                    {orderID && (
                        <div className="mt-6 font-mono text-[11px] text-black/45">
                            Order: {orderID}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => navigate("/orders")}
                        className="mt-8 inline-flex items-center justify-center gap-2 rounded-[2px] bg-[#FF8F00] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.1em] hover:bg-[#FFA733]"
                    >
                        View Orders

                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </PaymentLayout>
        );
    }

    /* =====================================================
       DEFAULT / WAITING
    ===================================================== */

    return (
        <PaymentLayout>
            <div className="mx-auto max-w-[650px] rounded-[6px] border border-black/10 bg-[#F5F5DC] p-8 text-center sm:p-12">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FF8F00]/15">
                    <Clock3 className="h-10 w-10 text-[#FF8F00]" />
                </div>

                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#FF8F00]">
                    GARAGE / PAYMENT
                </div>

                <h1 className="mt-3 font-['Oswald'] text-[48px] font-bold uppercase leading-none">
                    Processing Payment
                </h1>

                <p className="mx-auto mt-5 max-w-[470px] text-[14px] leading-6 text-black/55">
                    PayHere has redirected you back to
                    Metal Garage.

                    <br />

                    We are checking the payment
                    confirmation from our server.
                </p>

                {orderID && (
                    <div className="mt-6 font-mono text-[11px] text-black/45">
                        Order: {orderID}
                    </div>
                )}

                <div className="mx-auto mt-8 h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-[#FF8F00]" />
            </div>
        </PaymentLayout>
    );
}

/* =========================================================
   LAYOUT
========================================================= */

function PaymentLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#F5F5DC] text-[#0A0A0A]">
            <Header />

            <main className="flex min-h-[70vh] items-center justify-center px-5 py-20">
                {children}
            </main>

            <Footer />
        </div>
    );
}