import {
    XCircle,
    ArrowLeft,
} from "lucide-react";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import Header from "../components/header";
import Footer from "../components/footer";


export default function PaymentCancel() {

    const navigate =
        useNavigate();


    const [
        searchParams,
    ] = useSearchParams();


    const orderID =
        searchParams.get(
            "order_id"
        );


    return (
        <div className="min-h-screen bg-[#F5F5DC] text-[#0A0A0A]">

            <Header />


            <main className="flex min-h-[70vh] items-center justify-center px-5 py-20">

                <div className="w-full max-w-[650px] rounded-[6px] border border-black/10 bg-[#F5F5DC] p-8 text-center sm:p-12">


                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-black/5">

                        <XCircle
                            className="h-10 w-10"
                        />

                    </div>


                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#FF8F00]">
                        GARAGE / PAYMENT
                    </div>


                    <h1 className="mt-3 font-['Oswald'] text-[48px] font-bold uppercase leading-none">
                        Payment Cancelled
                    </h1>


                    <p className="mx-auto mt-5 max-w-[470px] text-[14px] leading-6 text-black/55">

                        You cancelled the PayHere
                        payment before completing
                        the transaction.

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
                            onClick={() =>
                                navigate(
                                    "/checkout"
                                )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-[#FF8F00] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.1em] hover:bg-[#FFA733]"
                        >

                            <ArrowLeft className="h-4 w-4" />

                            Back to Checkout

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/products"
                                )
                            }
                            className="rounded-[2px] border border-black/10 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.1em]"
                        >
                            Continue Shopping
                        </button>

                    </div>

                </div>

            </main>


            <Footer />

        </div>
    );
}