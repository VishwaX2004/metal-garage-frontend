import { useEffect } from "react";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderID = searchParams.get("order_id");

    useEffect(() => {
        // Clear the cart after successful payment
        localStorage.removeItem("cart");

        // Dispatch cartUpdated event to update header and other components
        window.dispatchEvent(
            new CustomEvent("cartUpdated", {
                detail: [],
            })
        );

        // Show success message and redirect to orders
        setTimeout(() => {
            navigate("/orders", {
                replace: true,
                state: {
                    paymentSuccess: true,
                    orderID,
                },
            });
        }, 500); // Small delay to ensure cart is cleared first
    }, [navigate, orderID]);

    return null;
}
