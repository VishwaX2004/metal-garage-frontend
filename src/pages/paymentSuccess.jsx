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
        localStorage.removeItem("cart");

        window.dispatchEvent(
            new CustomEvent("cartUpdated", {
                detail: [],
            })
        );

        navigate("/orders", {
            replace: true,
            state: {
                paymentSuccess: true,
                orderID,
            },
        });
    }, [navigate, orderID]);

    return null;
}
