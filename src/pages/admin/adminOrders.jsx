import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
    FaBoxOpen,
    FaBoxes,
    FaSearch,
    FaExclamationTriangle,
    FaTimesCircle,
    FaCheckCircle,
    FaEye,
    FaTrashAlt,
    FaChevronLeft,
    FaChevronRight,
    FaTimes,
    FaTruck,
    FaClock,
    FaUser,
    FaPhone,
    FaMapMarkerAlt,
    FaEnvelope,
    FaMoneyBillWave,
    FaCalendarAlt,
    FaShoppingBag,
} from "react-icons/fa";
import { Loader } from "../../components/loader";

/* =========================================================
   DELETE CONFIRM MODAL
========================================================= */

function AdminOrderDeleteConfirm({
    orderID,
    onClose,
    refresh,
}) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        const token = localStorage.getItem("token");

        if (!orderID) {
            toast.error("Order ID is required");
            return;
        }

        if (!token) {
            toast.error("Authentication required");
            return;
        }

        try {
            setIsDeleting(true);

            /*
             * Admin delete endpoint.
             *
             * If your backend uses another endpoint,
             * change this URL only.
             */

            const response = await axios.delete(
                `${
                    import.meta.env.VITE_API_URL
                }/api/orders/${encodeURIComponent(orderID)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                response.data?.message ||
                    "Order deleted successfully"
            );

            refresh();
            onClose();
        } catch (error) {
            console.error(
                "Delete order error:",
                error.response?.data || error
            );

            toast.error(
                error.response?.data?.message ||
                    "Unable to delete order"
            );

            setIsDeleting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-[#0A0A0A]/[0.62] px-5 backdrop-blur-[4px]">
            <div className="w-full max-w-[620px] overflow-hidden rounded-[14px] border border-black/15 bg-[#F5F5DC] shadow-[0_30px_70px_rgba(0,0,0,.25)]">

                {/* HEADER */}

                <div className="flex items-center justify-between border-b border-black/[0.14] px-[22px] py-5">

                    <div>
                        <h3 className="text-base font-semibold text-[#0A0A0A]">
                            Delete Order
                        </h3>

                        <p className="mt-1 text-[11px] text-black/40">
                            This action cannot be undone
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-black/50 transition hover:bg-[#ECE8D6] hover:text-[#0A0A0A]"
                    >
                        <FaTimes />
                    </button>

                </div>

                {/* CONTENT */}

                <div className="px-[22px] py-6">

                    <div className="flex items-start gap-4 rounded-lg border border-[#FF3B00]/15 bg-[#FF3B00]/[0.05] p-4">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FF3B00]/10 text-[#FF3B00]">
                            <FaTrashAlt />
                        </div>

                        <div>

                            <p className="text-sm font-semibold text-[#0A0A0A]">
                                Are you sure you want to delete this
                                order?
                            </p>

                            <p className="mt-2 font-mono text-[10px] text-black/45">
                                ORDER ID: {orderID}
                            </p>

                            <p className="mt-3 text-[11px] leading-5 text-[#FF3B00]">
                                Deleting this order will permanently
                                remove it from the admin order list.
                            </p>

                        </div>

                    </div>

                </div>

                {/* FOOTER */}

                <div className="flex justify-end gap-[9px] border-t border-black/[0.14] px-[22px] py-4">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="rounded-[7px] border border-black/[0.14] bg-[#F5F5DC] px-[18px] py-[11px] text-[12px] font-semibold uppercase tracking-[0.06em] text-[#0A0A0A] transition hover:border-[#0A0A0A] hover:bg-[#ECE8D6]"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-2 rounded-[7px] bg-[#0A0A0A] px-[18px] py-[11px] text-[12px] font-semibold uppercase tracking-[0.06em] text-[#F5F5DC] transition hover:bg-[#FF3B00] hover:text-[#0A0A0A] disabled:opacity-60"
                    >
                        {isDeleting ? (
                            <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#F5F5DC] border-t-transparent" />
                                Deleting
                            </>
                        ) : (
                            <>
                                <FaTrashAlt className="text-[11px]" />
                                Delete
                            </>
                        )}
                    </button>

                </div>

            </div>
        </div>
    );
}

/* =========================================================
   ORDER DETAILS MODAL
========================================================= */

function OrderDetailsModal({
    order,
    onClose,
    onStatusUpdate,
}) {
    const [orderStatus, setOrderStatus] = useState(
        order?.orderStatus || "Pending"
    );

    const [paymentStatus, setPaymentStatus] = useState(
        order?.paymentStatus || "Pending"
    );

    const [isUpdating, setIsUpdating] = useState(false);

    if (!order) {
        return null;
    }

    async function handleUpdate() {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Authentication required");
            return;
        }

        try {
            setIsUpdating(true);

            const response = await axios.put(
                `${
                    import.meta.env.VITE_API_URL
                }/api/orders/admin/${encodeURIComponent(
                    order.orderID
                )}/status`,
                {
                    orderStatus,
                    paymentStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                response.data?.message ||
                    "Order updated successfully"
            );

            onStatusUpdate(
                order.orderID,
                orderStatus,
                paymentStatus
            );
        } catch (error) {
            console.error(
                "Update order error:",
                error.response?.data || error
            );

            toast.error(
                error.response?.data?.message ||
                    "Unable to update order"
            );
        } finally {
            setIsUpdating(false);
        }
    }

    const shipping = order.shippingAddress || {};

    return (
        <div className="fixed inset-0 z-[1400] flex items-center justify-center bg-[#0A0A0A]/[0.62] px-4 py-5 backdrop-blur-[4px]">

            <div className="flex max-h-[92vh] w-full max-w-[1050px] flex-col overflow-hidden rounded-[14px] border border-black/15 bg-[#F5F5DC] shadow-[0_30px_70px_rgba(10,10,10,.25)]">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="flex shrink-0 items-center justify-between border-b border-black/[0.14] px-5 py-4 sm:px-[22px]">

                    <div>

                        <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.14em] text-black/40">
                            GARAGE / ORDER DETAILS
                        </div>

                        <h2 className="font-mono text-[17px] font-semibold">
                            {order.orderID}
                        </h2>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-[7px] text-black/45 transition hover:bg-[#ECE8D6] hover:text-[#0A0A0A]"
                    >
                        <FaTimes />
                    </button>

                </div>

                {/* =================================================
                    BODY
                ================================================= */}

                <div className="overflow-y-auto">

                    <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-[1.35fr_.85fr] sm:p-[22px]">

                        {/* LEFT */}

                        <div className="space-y-5">

                            {/* CUSTOMER */}

                            <div className="rounded-[10px] border border-black/[0.12] bg-[#ECE8D6] p-4">

                                <div className="mb-4 flex items-center gap-2">

                                    <div className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-black/[0.06]">
                                        <FaUser className="text-[12px]" />
                                    </div>

                                    <div>
                                        <h3 className="text-[13px] font-semibold">
                                            Customer
                                        </h3>

                                        <p className="text-[10px] text-black/40">
                                            Customer information
                                        </p>
                                    </div>

                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                                    <InfoRow
                                        icon={<FaUser />}
                                        label="Full Name"
                                        value={
                                            shipping.fullName ||
                                            "N/A"
                                        }
                                    />

                                    <InfoRow
                                        icon={<FaEnvelope />}
                                        label="Email"
                                        value={
                                            shipping.email ||
                                            order.customerEmail ||
                                            "N/A"
                                        }
                                    />

                                    <InfoRow
                                        icon={<FaPhone />}
                                        label="Phone"
                                        value={
                                            shipping.phone ||
                                            "N/A"
                                        }
                                    />

                                    <InfoRow
                                        icon={<FaMapMarkerAlt />}
                                        label="City"
                                        value={
                                            shipping.city ||
                                            "N/A"
                                        }
                                    />

                                </div>

                            </div>

                            {/* SHIPPING */}

                            <div className="rounded-[10px] border border-black/[0.12] bg-[#ECE8D6] p-4">

                                <div className="mb-4 flex items-center gap-2">

                                    <div className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-[#FF8F00]/[0.12] text-[#CC7000]">
                                        <FaTruck className="text-[12px]" />
                                    </div>

                                    <div>
                                        <h3 className="text-[13px] font-semibold">
                                            Shipping Address
                                        </h3>

                                        <p className="text-[10px] text-black/40">
                                            Delivery information
                                        </p>
                                    </div>

                                </div>

                                <div className="rounded-[8px] border border-black/[0.08] bg-[#F5F5DC] p-3">

                                    <p className="text-[12px] font-semibold">
                                        {shipping.fullName ||
                                            "Customer"}
                                    </p>

                                    <p className="mt-2 text-[11px] leading-5 text-black/60">
                                        {shipping.address ||
                                            "No address"}
                                    </p>

                                    <p className="text-[11px] leading-5 text-black/60">
                                        {shipping.city ||
                                            ""}
                                        {shipping.city &&
                                        shipping.province
                                            ? ", "
                                            : ""}
                                        {shipping.province ||
                                            ""}
                                        {shipping.postalCode
                                            ? ` - ${shipping.postalCode}`
                                            : ""}
                                    </p>

                                    {shipping.notes && (
                                        <div className="mt-3 border-t border-black/[0.08] pt-3">

                                            <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-black/35">
                                                Customer Note
                                            </p>

                                            <p className="mt-1 text-[11px] leading-5 text-black/60">
                                                {
                                                    shipping.notes
                                                }
                                            </p>

                                        </div>
                                    )}

                                </div>

                            </div>

                            {/* PRODUCTS */}

                            <div className="rounded-[10px] border border-black/[0.12] bg-[#ECE8D6] p-4">

                                <div className="mb-4 flex items-center justify-between">

                                    <div className="flex items-center gap-2">

                                        <div className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-black/[0.06]">
                                            <FaShoppingBag className="text-[12px]" />
                                        </div>

                                        <div>

                                            <h3 className="text-[13px] font-semibold">
                                                Order Items
                                            </h3>

                                            <p className="text-[10px] text-black/40">
                                                Products included in this order
                                            </p>

                                        </div>

                                    </div>

                                    <span className="mono-font text-[10px] text-black/40">
                                        {order.items?.length || 0} ITEMS
                                    </span>

                                </div>

                                <div className="space-y-2">

                                    {Array.isArray(order.items) &&
                                    order.items.length > 0 ? (
                                        order.items.map(
                                            (
                                                item,
                                                index
                                            ) => (
                                                <div
                                                    key={`${item.productID}-${index}`}
                                                    className="flex items-center gap-3 rounded-[8px] border border-black/[0.08] bg-[#F5F5DC] p-3"
                                                >

                                                    <div className="flex h-[55px] w-[55px] shrink-0 items-center justify-center overflow-hidden rounded-[7px] border border-black/[0.08] bg-[#ECE8D6]">

                                                        {item.image ? (
                                                            <img
                                                                src={
                                                                    item.image
                                                                }
                                                                alt={
                                                                    item.name ||
                                                                    "Product"
                                                                }
                                                                className="h-full w-full object-contain"
                                                            />
                                                        ) : (
                                                            <FaBoxOpen className="text-black/25" />
                                                        )}

                                                    </div>

                                                    <div className="min-w-0 flex-1">

                                                        <p className="truncate text-[12px] font-semibold">
                                                            {
                                                                item.name
                                                            }
                                                        </p>

                                                        <p className="mono-font mt-1 text-[9px] text-black/35">
                                                            {
                                                                item.productID
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-[10px] text-black/45">
                                                            Rs.{" "}
                                                            {Number(
                                                                item.price ||
                                                                    0
                                                            ).toLocaleString()}{" "}
                                                            ×{" "}
                                                            {
                                                                item.quantity
                                                            }
                                                        </p>

                                                    </div>

                                                    <div className="mono-font text-[12px] font-semibold">
                                                        Rs.{" "}
                                                        {Number(
                                                            item.total ||
                                                                0
                                                        ).toLocaleString()}
                                                    </div>

                                                </div>
                                            )
                                        )
                                    ) : (
                                        <p className="py-8 text-center text-[11px] text-black/40">
                                            No order items found.
                                        </p>
                                    )}

                                </div>

                            </div>

                        </div>

                        {/* RIGHT */}

                        <div className="space-y-5">

                            {/* SUMMARY */}

                            <div className="rounded-[10px] border border-black/[0.12] bg-[#0A0A0A] p-5 text-[#F5F5DC]">

                                <div className="mb-5 flex items-center justify-between">

                                    <div>

                                        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#F5F5DC]/45">
                                            ORDER TOTAL
                                        </p>

                                        <p className="mt-1 font-mono text-[26px] font-semibold">
                                            Rs.{" "}
                                            {Number(
                                                order.total ||
                                                    0
                                            ).toLocaleString()}
                                        </p>

                                    </div>

                                    <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#FF8F00]/15 text-[#FF8F00]">
                                        <FaMoneyBillWave />
                                    </div>

                                </div>

                                <div className="space-y-2 border-t border-[#F5F5DC]/10 pt-4">

                                    <SummaryRow
                                        label="Subtotal"
                                        value={`Rs. ${Number(
                                            order.subtotal ||
                                                0
                                        ).toLocaleString()}`}
                                    />

                                    <SummaryRow
                                        label="Discount"
                                        value={`- Rs. ${Number(
                                            order.discount ||
                                                0
                                        ).toLocaleString()}`}
                                        valueClass="text-[#FF8F00]"
                                    />

                                    {order.promoCode && (
                                        <div className="flex items-center justify-between">

                                            <span className="text-[10px] text-[#F5F5DC]/45">
                                                Promo Code
                                            </span>

                                            <span className="rounded-full bg-[#F5F5DC]/10 px-2 py-1 font-mono text-[9px]">
                                                {
                                                    order.promoCode
                                                }
                                            </span>

                                        </div>
                                    )}

                                    <div className="mt-3 flex items-center justify-between border-t border-[#F5F5DC]/10 pt-3">

                                        <span className="text-[11px] font-semibold">
                                            Total
                                        </span>

                                        <span className="font-mono text-[15px] font-semibold">
                                            Rs.{" "}
                                            {Number(
                                                order.total ||
                                                    0
                                            ).toLocaleString()}
                                        </span>

                                    </div>

                                </div>

                            </div>

                            {/* STATUS CONTROL */}

                            <div className="rounded-[10px] border border-black/[0.12] bg-[#ECE8D6] p-4">

                                <div className="mb-4">

                                    <div className="flex items-center gap-2">

                                        <div className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-[#FF8F00]/[0.12] text-[#CC7000]">
                                            <FaTruck className="text-[12px]" />
                                        </div>

                                        <div>

                                            <h3 className="text-[13px] font-semibold">
                                                Order Status
                                            </h3>

                                            <p className="text-[10px] text-black/40">
                                                Manage order progress
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.08em] text-black/40">
                                    Delivery Status
                                </label>

                                <select
                                    value={orderStatus}
                                    onChange={(e) =>
                                        setOrderStatus(
                                            e.target.value
                                        )
                                    }
                                    className="mb-4 w-full rounded-[7px] border border-black/[0.13] bg-[#F5F5DC] px-3 py-2.5 text-[12px] outline-none transition focus:border-[#FF8F00]"
                                >
                                    <option value="Pending">
                                        Pending
                                    </option>

                                    <option value="Confirmed">
                                        Confirmed
                                    </option>

                                    <option value="Processing">
                                        Processing
                                    </option>

                                    <option value="Shipped">
                                        Shipped
                                    </option>

                                    <option value="Delivered">
                                        Delivered
                                    </option>

                                    <option value="Cancelled">
                                        Cancelled
                                    </option>
                                </select>

                                <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.08em] text-black/40">
                                    Payment Status
                                </label>

                                <select
                                    value={paymentStatus}
                                    onChange={(e) =>
                                        setPaymentStatus(
                                            e.target.value
                                        )
                                    }
                                    className="mb-4 w-full rounded-[7px] border border-black/[0.13] bg-[#F5F5DC] px-3 py-2.5 text-[12px] outline-none transition focus:border-[#FF8F00]"
                                >
                                    <option value="Pending">
                                        Pending
                                    </option>

                                    <option value="Paid">
                                        Paid
                                    </option>

                                    <option value="Failed">
                                        Failed
                                    </option>

                                    <option value="Refunded">
                                        Refunded
                                    </option>
                                </select>

                                <button
                                    type="button"
                                    onClick={handleUpdate}
                                    disabled={isUpdating}
                                    className="flex w-full items-center justify-center gap-2 rounded-[7px] bg-[#0A0A0A] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#F5F5DC] transition hover:bg-[#FF8F00] hover:text-[#0A0A0A] disabled:opacity-60"
                                >
                                    {isUpdating ? (
                                        <>
                                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#F5F5DC] border-t-transparent" />
                                            Updating
                                        </>
                                    ) : (
                                        <>
                                            <FaCheckCircle />
                                            Save Status
                                        </>
                                    )}
                                </button>

                            </div>

                            {/* ORDER META */}

                            <div className="rounded-[10px] border border-black/[0.12] bg-[#ECE8D6] p-4">

                                <div className="mb-4 flex items-center gap-2">

                                    <div className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-black/[0.06]">
                                        <FaClock className="text-[12px]" />
                                    </div>

                                    <div>

                                        <h3 className="text-[13px] font-semibold">
                                            Order Information
                                        </h3>

                                        <p className="text-[10px] text-black/40">
                                            Order metadata
                                        </p>

                                    </div>

                                </div>

                                <div className="space-y-3">

                                    <InfoRow
                                        icon={<FaCalendarAlt />}
                                        label="Created"
                                        value={formatDate(
                                            order.createdAt
                                        )}
                                    />

                                    <InfoRow
                                        icon={<FaMoneyBillWave />}
                                        label="Payment Method"
                                        value={
                                            order.paymentMethod ||
                                            "Cash on Delivery"
                                        }
                                    />

                                    <InfoRow
                                        icon={<FaEnvelope />}
                                        label="Customer Email"
                                        value={
                                            order.customerEmail ||
                                            shipping.email ||
                                            "N/A"
                                        }
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* FOOTER */}

                <div className="flex shrink-0 justify-end border-t border-black/[0.14] px-5 py-4 sm:px-[22px]">

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-[7px] border border-black/[0.14] bg-[#F5F5DC] px-[18px] py-[11px] text-[12px] font-semibold uppercase tracking-[0.06em] transition hover:border-[#0A0A0A] hover:bg-[#ECE8D6]"
                    >
                        Close
                    </button>

                </div>

            </div>
        </div>
    );
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
    icon,
    label,
    value,
}) {
    return (
        <div className="flex min-w-0 items-start gap-2.5">

            <div className="mt-[2px] shrink-0 text-[10px] text-black/30">
                {icon}
            </div>

            <div className="min-w-0">

                <p className="font-mono text-[8px] uppercase tracking-[0.07em] text-black/35">
                    {label}
                </p>

                <p className="mt-[3px] break-words text-[11px] text-black/70">
                    {value}
                </p>

            </div>

        </div>
    );
}

/* =========================================================
   SUMMARY ROW
========================================================= */

function SummaryRow({
    label,
    value,
    valueClass = "",
}) {
    return (
        <div className="flex items-center justify-between">

            <span className="text-[10px] text-[#F5F5DC]/45">
                {label}
            </span>

            <span
                className={`font-mono text-[10px] ${valueClass}`}
            >
                {value}
            </span>

        </div>
    );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
    status,
    type = "order",
}) {
    const value = String(status || "Pending");

    let classes =
        "bg-black/[0.05] text-black/55";

    if (type === "payment") {
        if (value === "Paid") {
            classes =
                "bg-[#2F7A45]/10 text-[#2F7A45]";
        } else if (value === "Failed") {
            classes =
                "bg-[#FF3B00]/[0.08] text-[#FF3B00]";
        } else if (value === "Refunded") {
            classes =
                "bg-[#7B4BA5]/10 text-[#7B4BA5]";
        } else {
            classes =
                "bg-[#FF8F00]/[0.12] text-[#CC7000]";
        }
    } else {
        if (value === "Delivered") {
            classes =
                "bg-[#2F7A45]/10 text-[#2F7A45]";
        } else if (value === "Cancelled") {
            classes =
                "bg-[#FF3B00]/[0.08] text-[#FF3B00]";
        } else if (
            value === "Shipped"
        ) {
            classes =
                "bg-[#2878B5]/10 text-[#2878B5]";
        } else if (
            value === "Processing"
        ) {
            classes =
                "bg-[#FF8F00]/[0.12] text-[#CC7000]";
        } else if (
            value === "Confirmed"
        ) {
            classes =
                "bg-[#2F7A45]/[0.08] text-[#2F7A45]";
        } else {
            classes =
                "bg-black/[0.06] text-black/55";
        }
    }

    return (
        <span
            className={`mono-font inline-flex whitespace-nowrap items-center gap-[6px] rounded-full px-[9px] py-[5px] text-[9px] font-semibold uppercase ${classes}`}
        >
            <span className="h-[5px] w-[5px] rounded-full bg-current" />
            {value}
        </span>
    );
}

/* =========================================================
   MAIN ADMIN ORDER PAGE
========================================================= */

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [orderStatus, setOrderStatus] =
        useState("all");

    const [paymentStatus, setPaymentStatus] =
        useState("all");

    const [selectedOrder, setSelectedOrder] =
        useState(null);

    const [
        isDeleteConfirmVisible,
        setIsDeleteConfirmVisible,
    ] = useState(false);

    const [orderToDelete, setOrderToDelete] =
        useState(null);

    /* =====================================================
       FETCH ORDERS
    ===================================================== */

    async function fetchOrders() {
        const token =
            localStorage.getItem("token");

        if (!token) {
            toast.error(
                "Authentication required"
            );

            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);

            const response = await axios.get(
                `${
                    import.meta.env.VITE_API_URL
                }/api/orders/admin/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const receivedOrders =
                response.data?.orders;

            setOrders(
                Array.isArray(receivedOrders)
                    ? receivedOrders
                    : Array.isArray(
                          response.data
                      )
                    ? response.data
                    : []
            );
        } catch (error) {
            console.error(
                "Fetch orders error:",
                error.response?.data || error
            );

            toast.error(
                error.response?.data?.message ||
                    "Failed to load orders"
            );
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    /* =====================================================
       FILTER ORDERS
    ===================================================== */

    const filteredOrders = useMemo(() => {
        const searchText =
            search.toLowerCase().trim();

        return orders.filter((order) => {
            const shipping =
                order.shippingAddress || {};

            const customerName =
                shipping.fullName
                    ?.toLowerCase()
                    .trim() || "";

            const customerEmail =
                (
                    order.customerEmail ||
                    shipping.email ||
                    ""
                )
                    .toLowerCase()
                    .trim();

            const phone =
                String(
                    shipping.phone || ""
                ).toLowerCase();

            const orderID =
                String(
                    order.orderID || ""
                ).toLowerCase();

            const matchesSearch =
                !searchText ||
                orderID.includes(
                    searchText
                ) ||
                customerName.includes(
                    searchText
                ) ||
                customerEmail.includes(
                    searchText
                ) ||
                phone.includes(
                    searchText
                );

            const matchesOrderStatus =
                orderStatus === "all" ||
                order.orderStatus ===
                    orderStatus;

            const matchesPaymentStatus =
                paymentStatus === "all" ||
                order.paymentStatus ===
                    paymentStatus;

            return (
                matchesSearch &&
                matchesOrderStatus &&
                matchesPaymentStatus
            );
        });
    }, [
        orders,
        search,
        orderStatus,
        paymentStatus,
    ]);

    /* =====================================================
       STATISTICS
    ===================================================== */

    const totalOrders =
        orders.length;

    const pendingOrders =
        orders.filter(
            (order) =>
                order.orderStatus ===
                "Pending"
        ).length;

    const processingOrders =
        orders.filter(
            (order) =>
                order.orderStatus ===
                    "Processing" ||
                order.orderStatus ===
                    "Confirmed"
        ).length;

    const deliveredOrders =
        orders.filter(
            (order) =>
                order.orderStatus ===
                "Delivered"
        ).length;

    const totalRevenue =
        orders.reduce(
            (total, order) =>
                total +
                Number(order.total || 0),
            0
        );

    /* =====================================================
       RESET FILTERS
    ===================================================== */

    function resetFilters() {
        setSearch("");
        setOrderStatus("all");
        setPaymentStatus("all");
    }

    /* =====================================================
       UPDATE LOCAL ORDER
    ===================================================== */

    function handleStatusUpdate(
        orderID,
        newOrderStatus,
        newPaymentStatus
    ) {
        setOrders((currentOrders) =>
            currentOrders.map((order) =>
                order.orderID === orderID
                    ? {
                          ...order,
                          orderStatus:
                              newOrderStatus,
                          paymentStatus:
                              newPaymentStatus,
                      }
                    : order
            )
        );

        setSelectedOrder((current) =>
            current
                ? {
                      ...current,
                      orderStatus:
                          newOrderStatus,
                      paymentStatus:
                          newPaymentStatus,
                  }
                : current
        );
    }

    /* =====================================================
       OPEN DELETE
    ===================================================== */

    function openDelete(orderID) {
        if (!orderID) {
            toast.error(
                "Order ID is required"
            );
            return;
        }

        setOrderToDelete(orderID);
        setIsDeleteConfirmVisible(true);
    }

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

                .metal-garage-orders {
                    font-family: 'Work Sans', sans-serif;
                    -webkit-font-smoothing: antialiased;
                }

                .display-font {
                    font-family: 'Oswald', sans-serif;
                    text-transform: uppercase;
                    letter-spacing: .01em;
                    font-weight: 700;
                    line-height: 1.05;
                }

                .mono-font {
                    font-family: 'JetBrains Mono', monospace;
                    letter-spacing: .03em;
                }

                @keyframes rowIn {
                    from {
                        opacity: 0;
                        transform: translateY(4px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .metal-row {
                    animation: rowIn .2s ease both;
                }

                @keyframes cardIn {
                    from {
                        opacity: 0;
                        transform: translateY(8px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .order-card {
                    animation: cardIn .3s ease both;
                }
            `}</style>

            <div className="metal-garage-orders min-h-screen w-full bg-[#ECE8D6] text-[#0A0A0A]">

                {/* =================================================
                    MODALS
                ================================================= */}

                {selectedOrder && (
                    <OrderDetailsModal
                        order={selectedOrder}
                        onClose={() =>
                            setSelectedOrder(null)
                        }
                        onStatusUpdate={
                            handleStatusUpdate
                        }
                    />
                )}

                {isDeleteConfirmVisible && (
                    <AdminOrderDeleteConfirm
                        orderID={orderToDelete}
                        refresh={fetchOrders}
                        onClose={() => {
                            setIsDeleteConfirmVisible(
                                false
                            );

                            setOrderToDelete(
                                null
                            );
                        }}
                    />
                )}

                {/* =================================================
                    MAIN
                ================================================= */}

                <main className="w-full">

                    <section className="px-4 pb-12 pt-6 sm:px-6 lg:px-8 xl:px-10">

                        <div className="mx-auto max-w-[1700px]">

                            {/* =================================================
                                HEADER
                            ================================================= */}

                            <div className="mb-6 flex flex-wrap items-center justify-between gap-5">

                                <div>

                                    <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-black/40">
                                        GARAGE / SALES
                                    </div>

                                    <h1 className="display-font text-[30px] sm:text-[34px] lg:text-[38px]">
                                        Order Management
                                    </h1>

                                    <p className="mt-[7px] max-w-[620px] text-[12px] leading-5 text-black/48">
                                        Manage customer orders,
                                        monitor payments and
                                        track delivery progress.
                                    </p>

                                </div>

                                <div className="flex items-center gap-2 rounded-[7px] border border-black/[0.12] bg-[#F5F5DC] px-4 py-3">

                                    <FaBoxes className="text-[#FF8F00]" />

                                    <div>
                                        <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-black/35">
                                            Total Revenue
                                        </p>

                                        <p className="mono-font mt-1 text-[13px] font-semibold">
                                            Rs.{" "}
                                            {totalRevenue.toLocaleString()}
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/* =================================================
                                STAT CARDS
                            ================================================= */}

                            <div className="mb-[22px] grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-4">

                                <StatCard
                                    title="Total Orders"
                                    value={
                                        totalOrders
                                    }
                                    description="All customer orders"
                                    icon={
                                        <FaBoxOpen />
                                    }
                                    iconType="black"
                                />

                                <StatCard
                                    title="Pending Orders"
                                    value={
                                        pendingOrders
                                    }
                                    description="Orders awaiting confirmation"
                                    icon={
                                        <FaClock />
                                    }
                                    iconType="orange"
                                />

                                <StatCard
                                    title="Processing"
                                    value={
                                        processingOrders
                                    }
                                    description="Orders being prepared"
                                    icon={
                                        <FaTruck />
                                    }
                                    iconType="orange"
                                />

                                <StatCard
                                    title="Delivered"
                                    value={
                                        deliveredOrders
                                    }
                                    description="Successfully delivered"
                                    icon={
                                        <FaCheckCircle />
                                    }
                                    iconType="green"
                                />

                            </div>

                            {/* =================================================
                                FILTERS
                            ================================================= */}

                            <div className="mb-[18px] flex flex-wrap items-center gap-3 rounded-[12px] border border-black/[0.14] bg-[#F5F5DC] p-[17px]">

                                {/* SEARCH */}

                                <div className="flex min-w-[250px] flex-1 items-center gap-2.5 rounded-[7px] border border-black/[0.14] bg-[#ECE8D6] px-[13px] py-[10px]">

                                    <FaSearch className="text-[14px] text-black/40" />

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="Search order ID, customer, email or phone..."
                                        className="w-full border-none bg-transparent text-[13px] outline-none placeholder:text-black/40"
                                    />

                                </div>

                                {/* ORDER STATUS */}

                                <select
                                    value={
                                        orderStatus
                                    }
                                    onChange={(e) =>
                                        setOrderStatus(
                                            e.target
                                                .value
                                        )
                                    }
                                    className="min-w-[155px] cursor-pointer rounded-[7px] border border-black/[0.14] bg-[#ECE8D6] px-[13px] py-[10px] text-[12px] outline-none"
                                >
                                    <option value="all">
                                        All Order Status
                                    </option>

                                    <option value="Pending">
                                        Pending
                                    </option>

                                    <option value="Confirmed">
                                        Confirmed
                                    </option>

                                    <option value="Processing">
                                        Processing
                                    </option>

                                    <option value="Shipped">
                                        Shipped
                                    </option>

                                    <option value="Delivered">
                                        Delivered
                                    </option>

                                    <option value="Cancelled">
                                        Cancelled
                                    </option>
                                </select>

                                {/* PAYMENT STATUS */}

                                <select
                                    value={
                                        paymentStatus
                                    }
                                    onChange={(e) =>
                                        setPaymentStatus(
                                            e.target
                                                .value
                                        )
                                    }
                                    className="min-w-[155px] cursor-pointer rounded-[7px] border border-black/[0.14] bg-[#ECE8D6] px-[13px] py-[10px] text-[12px] outline-none"
                                >
                                    <option value="all">
                                        All Payment Status
                                    </option>

                                    <option value="Pending">
                                        Pending
                                    </option>

                                    <option value="Paid">
                                        Paid
                                    </option>

                                    <option value="Failed">
                                        Failed
                                    </option>

                                    <option value="Refunded">
                                        Refunded
                                    </option>
                                </select>

                                {/* RESET */}

                                <button
                                    type="button"
                                    onClick={
                                        resetFilters
                                    }
                                    className="rounded-[7px] border border-black/[0.14] bg-[#F5F5DC] px-[18px] py-[11px] text-[12px] font-semibold uppercase tracking-[0.06em] transition hover:border-[#0A0A0A] hover:bg-[#ECE8D6]"
                                >
                                    Reset
                                </button>

                            </div>

                            {/* =================================================
                                TABLE
                            ================================================= */}

                            <div className="overflow-hidden rounded-[12px] border border-black/[0.14] bg-[#F5F5DC]">

                                {/* TABLE HEADER */}

                                <div className="flex items-center justify-between gap-3 border-b border-black/[0.14] px-[22px] py-5">

                                    <div>

                                        <h2 className="text-[15px] font-semibold">
                                            All Orders
                                        </h2>

                                        <p className="mt-1 text-[11.5px] text-black/43">
                                            Customer orders and
                                            delivery status
                                        </p>

                                    </div>

                                    <div className="mono-font text-[11px] text-black/45">
                                        {
                                            filteredOrders.length
                                        }{" "}
                                        ORDERS
                                    </div>

                                </div>

                                {/* LOADING */}

                                {isLoading ? (
                                    <div className="flex min-h-[380px] items-center justify-center">
                                        <Loader />
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">

                                        <table className="w-full min-w-[1180px] border-collapse">

                                            <thead>

                                                <tr>

                                                    <TableHeader>
                                                        Order
                                                    </TableHeader>

                                                    <TableHeader>
                                                        Customer
                                                    </TableHeader>

                                                    <TableHeader>
                                                        Items
                                                    </TableHeader>

                                                    <TableHeader>
                                                        Total
                                                    </TableHeader>

                                                    <TableHeader>
                                                        Payment
                                                    </TableHeader>

                                                    <TableHeader>
                                                        Status
                                                    </TableHeader>

                                                    <TableHeader>
                                                        Date
                                                    </TableHeader>

                                                    <TableHeader>
                                                        Actions
                                                    </TableHeader>

                                                </tr>

                                            </thead>

                                            <tbody>

                                                {filteredOrders.length >
                                                0 ? (
                                                    filteredOrders.map(
                                                        (
                                                            order,
                                                            index
                                                        ) => {
                                                            const shipping =
                                                                order.shippingAddress ||
                                                                {};

                                                            const itemCount =
                                                                Array.isArray(
                                                                    order.items
                                                                )
                                                                    ? order.items.reduce(
                                                                          (
                                                                              total,
                                                                              item
                                                                          ) =>
                                                                              total +
                                                                              Number(
                                                                                  item.quantity ||
                                                                                      0
                                                                              ),
                                                                          0
                                                                      )
                                                                    : 0;

                                                            return (
                                                                <tr
                                                                    key={
                                                                        order.orderID ||
                                                                        order._id ||
                                                                        index
                                                                    }
                                                                    className="metal-row border-b border-black/[0.07] hover:bg-[#ECE8D6]"
                                                                    style={{
                                                                        animationDelay: `${index * 30}ms`,
                                                                    }}
                                                                >

                                                                    {/* ORDER */}

                                                                    <td className="px-[18px] py-[15px]">

                                                                        <div className="min-w-[165px]">

                                                                            <div className="flex items-center gap-2">

                                                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[7px] bg-black/[0.05]">
                                                                                    <FaBoxOpen className="text-[12px] text-black/50" />
                                                                                </div>

                                                                                <div className="min-w-0">

                                                                                    <p className="mono-font truncate text-[11px] font-semibold">
                                                                                        {
                                                                                            order.orderID
                                                                                        }
                                                                                    </p>

                                                                                    <p className="mt-1 text-[9px] text-black/35">
                                                                                        COD
                                                                                    </p>

                                                                                </div>

                                                                            </div>

                                                                        </div>

                                                                    </td>

                                                                    {/* CUSTOMER */}

                                                                    <td className="px-[18px] py-[15px]">

                                                                        <div className="min-w-[190px]">

                                                                            <p className="max-w-[190px] truncate text-[12px] font-semibold">
                                                                                {
                                                                                    shipping.fullName ||
                                                                                    "Unknown Customer"
                                                                                }
                                                                            </p>

                                                                            <p className="mt-1 max-w-[190px] truncate text-[10px] text-black/40">
                                                                                {
                                                                                    order.customerEmail ||
                                                                                    shipping.email ||
                                                                                    "No email"
                                                                                }
                                                                            </p>

                                                                            {shipping.phone && (
                                                                                <p className="mono-font mt-1 text-[9px] text-black/35">
                                                                                    {
                                                                                        shipping.phone
                                                                                    }
                                                                                </p>
                                                                            )}

                                                                        </div>

                                                                    </td>

                                                                    {/* ITEMS */}

                                                                    <td className="px-[18px] py-[15px]">

                                                                        <div className="flex min-w-[100px] items-center gap-2">

                                                                            <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#ECE8D6]">
                                                                                <FaShoppingBag className="text-[10px] text-black/40" />
                                                                            </div>

                                                                            <div>

                                                                                <p className="mono-font text-[11px] font-semibold">
                                                                                    {
                                                                                        itemCount
                                                                                    }
                                                                                </p>

                                                                                <p className="text-[9px] text-black/35">
                                                                                    {itemCount ===
                                                                                    1
                                                                                        ? "unit"
                                                                                        : "units"}
                                                                                </p>

                                                                            </div>

                                                                        </div>

                                                                    </td>

                                                                    {/* TOTAL */}

                                                                    <td className="px-[18px] py-[15px]">

                                                                        <div className="min-w-[120px]">

                                                                            <p className="mono-font text-[12px] font-semibold">
                                                                                Rs.{" "}
                                                                                {Number(
                                                                                    order.total ||
                                                                                        0
                                                                                ).toLocaleString()}
                                                                            </p>

                                                                            {Number(
                                                                                order.discount ||
                                                                                    0
                                                                            ) >
                                                                                0 && (
                                                                                <p className="mt-1 font-mono text-[9px] text-[#CC7000]">
                                                                                    -
                                                                                    Rs.{" "}
                                                                                    {Number(
                                                                                        order.discount
                                                                                    ).toLocaleString()}{" "}
                                                                                    discount
                                                                                </p>
                                                                            )}

                                                                        </div>

                                                                    </td>

                                                                    {/* PAYMENT */}

                                                                    <td className="px-[18px] py-[15px]">

                                                                        <StatusBadge
                                                                            status={
                                                                                order.paymentStatus
                                                                            }
                                                                            type="payment"
                                                                        />

                                                                    </td>

                                                                    {/* ORDER STATUS */}

                                                                    <td className="px-[18px] py-[15px]">

                                                                        <StatusBadge
                                                                            status={
                                                                                order.orderStatus
                                                                            }
                                                                        />

                                                                    </td>

                                                                    {/* DATE */}

                                                                    <td className="px-[18px] py-[15px]">

                                                                        <div className="min-w-[110px]">

                                                                            <p className="text-[11px] font-medium">
                                                                                {formatShortDate(
                                                                                    order.createdAt
                                                                                )}
                                                                            </p>

                                                                            <p className="mono-font mt-1 text-[8.5px] text-black/35">
                                                                                {formatTime(
                                                                                    order.createdAt
                                                                                )}
                                                                            </p>

                                                                        </div>

                                                                    </td>

                                                                    {/* ACTIONS */}

                                                                    <td className="px-[18px] py-[15px]">

                                                                        <div className="flex items-center gap-[5px]">

                                                                            <button
                                                                                type="button"
                                                                                title="View order"
                                                                                onClick={() =>
                                                                                    setSelectedOrder(
                                                                                        order
                                                                                    )
                                                                                }
                                                                                className="flex h-[31px] w-[31px] items-center justify-center rounded-[6px] text-black/45 transition hover:bg-[#ECE8D6] hover:text-[#0A0A0A]"
                                                                            >
                                                                                <FaEye />
                                                                            </button>

                                                                            <button
                                                                                type="button"
                                                                                title="Delete order"
                                                                                onClick={() =>
                                                                                    openDelete(
                                                                                        order.orderID
                                                                                    )
                                                                                }
                                                                                className="flex h-[31px] w-[31px] items-center justify-center rounded-[6px] text-black/45 transition hover:bg-[#ECE8D6] hover:text-[#FF3B00]"
                                                                            >
                                                                                <FaTrashAlt />
                                                                            </button>

                                                                        </div>

                                                                    </td>

                                                                </tr>
                                                            );
                                                        }
                                                    )
                                                ) : (
                                                    <tr>

                                                        <td
                                                            colSpan="8"
                                                            className="px-6 py-20 text-center"
                                                        >

                                                            <div className="flex flex-col items-center">

                                                                <FaBoxOpen className="mb-4 text-3xl text-black/25" />

                                                                <p className="text-sm font-semibold">
                                                                    No orders
                                                                    found
                                                                </p>

                                                                <p className="mt-1 text-[11px] text-black/40">
                                                                    Try changing
                                                                    your filters
                                                                    or search
                                                                    query.
                                                                </p>

                                                            </div>

                                                        </td>

                                                    </tr>
                                                )}

                                            </tbody>

                                        </table>

                                    </div>
                                )}

                                {/* =================================================
                                    FOOTER
                                ================================================= */}

                                {!isLoading && (
                                    <div className="flex items-center justify-between border-t border-black/[0.14] px-[18px] py-[15px]">

                                        <div className="text-[11px] text-black/43">

                                            Showing{" "}

                                            <span className="font-semibold">
                                                {
                                                    filteredOrders.length
                                                }
                                            </span>{" "}

                                            order
                                            {filteredOrders.length !==
                                            1
                                                ? "s"
                                                : ""}

                                        </div>

                                        <div className="flex gap-[5px]">

                                            <button
                                                type="button"
                                                disabled
                                                className="flex h-[31px] w-[31px] items-center justify-center rounded-[6px] border border-black/[0.14] text-black/30"
                                            >
                                                <FaChevronLeft className="text-[9px]" />
                                            </button>

                                            <button
                                                type="button"
                                                className="flex h-[31px] w-[31px] items-center justify-center rounded-[6px] bg-[#0A0A0A] font-mono text-[10px] text-[#F5F5DC]"
                                            >
                                                1
                                            </button>

                                            <button
                                                type="button"
                                                disabled
                                                className="flex h-[31px] w-[31px] items-center justify-center rounded-[6px] border border-black/[0.14] text-black/30"
                                            >
                                                <FaChevronRight className="text-[9px]" />
                                            </button>

                                        </div>

                                    </div>
                                )}

                            </div>

                            {/* =================================================
                                BOTTOM META
                            ================================================= */}

                            <div className="mt-5 flex items-center justify-between text-[10px] text-black/35">

                                <span className="mono-font">
                                    METAL GARAGE / ORDER MANAGEMENT
                                </span>

                                <span className="mono-font">
                                    {orders.length} ORDERS
                                </span>

                            </div>

                        </div>

                    </section>

                </main>

            </div>
        </>
    );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
    title,
    value,
    description,
    icon,
    iconType,
}) {
    const iconClasses = {
        black:
            "bg-black/[0.06] text-[#0A0A0A]",

        orange:
            "bg-[#FF8F00]/[0.12] text-[#CC7000]",

        red:
            "bg-[#FF3B00]/10 text-[#FF3B00]",

        green:
            "bg-[#2F7A45]/[0.12] text-[#2F7A45]",
    };

    return (
        <div className="rounded-[12px] border border-black/[0.14] bg-[#F5F5DC] px-[21px] py-[19px] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(10,10,10,.07)]">

            <div className="mb-[14px]">

                <div
                    className={`flex h-[38px] w-[38px] items-center justify-center rounded-[9px] ${iconClasses[iconType]}`}
                >
                    {icon}
                </div>

            </div>

            <div className="mb-[5px] text-[12px] text-black/50">
                {title}
            </div>

            <div className="mono-font text-[25px] font-semibold">
                {value}
            </div>

            <div className="mt-[5px] text-[11px] text-black/40">
                {description}
            </div>

        </div>
    );
}

/* =========================================================
   TABLE HEADER
========================================================= */

function TableHeader({
    children,
}) {
    return (
        <th className="whitespace-nowrap border-b border-black/[0.14] px-[18px] py-[13px] text-left font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-black/42">
            {children}
        </th>
    );
}

/* =========================================================
   DATE HELPERS
========================================================= */

function formatDate(date) {
    if (!date) {
        return "N/A";
    }

    const parsedDate = new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return "N/A";
    }

    return parsedDate.toLocaleString(
        "en-LK",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );
}

function formatShortDate(date) {
    if (!date) {
        return "N/A";
    }

    const parsedDate = new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return "N/A";
    }

    return parsedDate.toLocaleDateString(
        "en-LK",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );
}

function formatTime(date) {
    if (!date) {
        return "";
    }

    const parsedDate = new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return "";
    }

    return parsedDate.toLocaleTimeString(
        "en-LK",
        {
            hour: "2-digit",
            minute: "2-digit",
        }
    );
}

