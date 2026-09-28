import { Link, Route, Routes, useLocation } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

import AdminProductPage from "./admin/adminProducts";
import AdminAddProduct from "./admin/adminAddProduct";
import AdminUpdateProductPage from "./admin/adminUpdateProduct";
import AdminOrders from "./admin/adminOrders";
import AdminUser from "./admin/adminUser";

import {
    RxDashboard,
    RxCube,
    RxPerson,
    RxReader,
    RxChevronRight,
    RxHamburgerMenu,
    RxBell,
    RxQuestionMarkCircled,
    RxMagnifyingGlass,
    RxPlus,
    RxDownload,
} from "react-icons/rx";

import {
    FiDollarSign,
    FiShoppingCart,
    FiUsers,
    FiAlertTriangle,
    FiPackage,
    FiBarChart2,
    FiTag,
    FiTrendingUp,
    FiTrendingDown,
    FiChevronDown,
    FiImage,
} from "react-icons/fi";

/* ============================================================
   API CONFIG
============================================================ */

const API = String(
    import.meta.env.VITE_API_URL || ""
).replace(/\/+$/, "");

const PRODUCTS_URL = `${API}/api/products`;
const ORDERS_URL = `${API}/api/orders/admin/all`;
const USERS_URL = `${API}/api/users/admin`;

/* ============================================================
   HELPERS
============================================================ */

function extractArray(data, keys = []) {
    if (Array.isArray(data)) {
        return data;
    }

    for (const key of [
        ...keys,
        "data",
        "items",
        "results",
    ]) {
        if (Array.isArray(data?.[key])) {
            return data[key];
        }
    }

    return [];
}

function money(value) {
    return `Rs. ${Number(value || 0).toLocaleString(
        undefined,
        {
            maximumFractionDigits: 0,
        }
    )}`;
}

function shortMoney(value) {
    const n = Number(value || 0);

    if (n >= 1_000_000) {
        return `Rs. ${(n / 1_000_000).toFixed(1)}M`;
    }

    if (n >= 1_000) {
        return `Rs. ${(n / 1_000).toFixed(1)}k`;
    }

    return `Rs. ${Math.round(n)}`;
}

/* ============================================================
   IMAGE HELPERS
============================================================ */

/*
    Product schema:

    images: {
        type: [String],
        default: [],
    }

    Therefore images normally looks like:

    [
        "https://....jpg",
        "https://....jpg"
    ]

    These helpers also support:
        image: "url"
        images: "url"
*/

function getProductImage(product) {
    if (!product) {
        return null;
    }

    if (
        Array.isArray(product.images) &&
        product.images.length > 0
    ) {
        const validImage = product.images.find(
            (image) =>
                typeof image === "string" &&
                image.trim() !== ""
        );

        if (validImage) {
            return validImage.trim();
        }
    }

    if (
        typeof product.images === "string" &&
        product.images.trim()
    ) {
        return product.images.trim();
    }

    if (
        typeof product.image === "string" &&
        product.image.trim()
    ) {
        return product.image.trim();
    }

    if (
        typeof product.imageUrl === "string" &&
        product.imageUrl.trim()
    ) {
        return product.imageUrl.trim();
    }

    return null;
}

function getItemImage(item) {
    if (!item) {
        return null;
    }

    if (
        typeof item.image === "string" &&
        item.image.trim()
    ) {
        return item.image.trim();
    }

    if (
        typeof item.imageUrl === "string" &&
        item.imageUrl.trim()
    ) {
        return item.imageUrl.trim();
    }

    if (
        typeof item.productImage === "string" &&
        item.productImage.trim()
    ) {
        return item.productImage.trim();
    }

    if (
        Array.isArray(item.images) &&
        item.images.length > 0
    ) {
        const image = item.images.find(
            (value) =>
                typeof value === "string" &&
                value.trim()
        );

        if (image) {
            return image.trim();
        }
    }

    if (
        typeof item.product?.image === "string" &&
        item.product.image.trim()
    ) {
        return item.product.image.trim();
    }

    if (
        Array.isArray(item.product?.images) &&
        item.product.images.length > 0
    ) {
        const image =
            item.product.images.find(
                (value) =>
                    typeof value === "string" &&
                    value.trim()
            );

        if (image) {
            return image.trim();
        }
    }

    return null;
}

/* ============================================================
   ORDER HELPERS
============================================================ */

function getOrderDate(order) {
    const raw =
        order?.createdAt ||
        order?.date ||
        order?.orderDate ||
        order?.orderedAt;

    if (!raw) {
        return null;
    }

    const d = new Date(raw);

    return isNaN(d.getTime()) ? null : d;
}

function getOrderItems(order) {
    const list =
        order?.items ||
        order?.products ||
        order?.orderItems ||
        [];

    return Array.isArray(list) ? list : [];
}

function getItemName(item) {
    return (
        item?.name ||
        item?.productName ||
        item?.productInfo?.name ||
        item?.product?.name ||
        null
    );
}

function getItemProductID(item) {
    return (
        item?.productID ||
        item?.productId ||
        item?.product?.productID ||
        item?.product?._id ||
        null
    );
}

function getItemQty(item) {
    return (
        Number(
            item?.quantity ??
                item?.qty ??
                item?.cartQuantity ??
                1
        ) || 1
    );
}

function getItemPrice(item) {
    return Number(
        item?.price ??
            item?.productInfo?.price ??
            item?.product?.price ??
            0
    );
}

function getOrderTotal(order) {
    const direct =
        order?.total ??
        order?.totalAmount ??
        order?.amount;

    if (
        direct !== undefined &&
        direct !== null &&
        !isNaN(Number(direct))
    ) {
        return Number(direct);
    }

    return getOrderItems(order).reduce(
        (sum, item) =>
            sum +
            getItemPrice(item) *
                getItemQty(item),
        0
    );
}

/* ============================================================
   ORDER STATUS
============================================================ */

function getOrderStatus(order) {
    const raw =
        order?.orderStatus ||
        order?.status ||
        "Pending";

    const status =
        String(raw).toLowerCase();

    if (
        status === "cancelled" ||
        status === "canceled"
    ) {
        return "cancelled";
    }

    if (
        ["shipped", "delivered"].includes(
            status
        )
    ) {
        return "shipped";
    }

    if (
        ["paid", "confirmed"].includes(
            status
        )
    ) {
        return "paid";
    }

    return "pending";
}

function getDisplayOrderStatus(order) {
    const raw =
        order?.orderStatus ||
        order?.status ||
        "Pending";

    return String(raw);
}

function getOrderID(order) {
    return (
        order?.orderID ||
        order?.orderId ||
        order?._id ||
        "-"
    );
}

/* ============================================================
   CUSTOMER HELPERS
============================================================ */

function getCustomerName(order) {
    return (
        order?.shippingAddress?.fullName ||
        order?.customerName ||
        order?.name ||
        [order?.firstName, order?.lastName]
            .filter(Boolean)
            .join(" ") ||
        order?.shippingAddress?.email ||
        order?.customerEmail ||
        order?.email ||
        "Customer"
    );
}

function getCustomerEmail(order) {
    return (
        order?.customerEmail ||
        order?.shippingAddress?.email ||
        order?.email ||
        ""
    );
}

function initialsOf(name) {
    const parts = String(name || "?")
        .trim()
        .split(/\s+/);

    return (
        (parts[0]?.[0] || "?") +
        (parts[1]?.[0] || "")
    ).toUpperCase();
}

/* ============================================================
   STATUS HELPERS
============================================================ */

function statusType(status) {
    if (status === "cancelled") {
        return "cancelled";
    }

    if (
        [
            "shipped",
            "delivered",
            "completed",
        ].includes(status)
    ) {
        return "shipped";
    }

    if (status === "paid") {
        return "paid";
    }

    return "pending";
}

function isCompleted(status) {
    return [
        "paid",
        "shipped",
        "delivered",
        "completed",
    ].includes(status);
}

function percentChange(
    current,
    previous
) {
    if (!previous) {
        return current > 0 ? 100 : 0;
    }

    return (
        ((current - previous) /
            previous) *
        100
    );
}

/* ============================================================
   DASHBOARD DATA HOOK
============================================================ */

function useDashboardData() {
    const [products, setProducts] =
        useState([]);

    const [orders, setOrders] =
        useState([]);

    const [users, setUsers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [errors, setErrors] =
        useState({});

    const load = useCallback(
        async () => {
            setLoading(true);

            const token =
                localStorage.getItem(
                    "token"
                ) ||
                localStorage.getItem(
                    "accessToken"
                );

            const headers = token
                ? {
                      Authorization: `Bearer ${token}`,
                  }
                : {};

            const [
                productsResult,
                ordersResult,
                usersResult,
            ] =
                await Promise.allSettled([
                    axios.get(
                        PRODUCTS_URL,
                        {
                            headers,
                        }
                    ),

                    axios.get(
                        ORDERS_URL,
                        {
                            headers,
                        }
                    ),

                    axios.get(
                        USERS_URL,
                        {
                            headers,
                        }
                    ),
                ]);

            const nextErrors = {};

            /* PRODUCTS */

            if (
                productsResult.status ===
                "fulfilled"
            ) {
                setProducts(
                    extractArray(
                        productsResult
                            .value.data,
                        ["products"]
                    )
                );
            } else {
                console.error(
                    "Products API error:",
                    productsResult.reason
                );

                nextErrors.products =
                    true;

                setProducts([]);
            }

            /* ORDERS */

            if (
                ordersResult.status ===
                "fulfilled"
            ) {
                setOrders(
                    extractArray(
                        ordersResult
                            .value.data,
                        ["orders"]
                    )
                );
            } else {
                console.error(
                    "Orders API error:",
                    ordersResult.reason
                );

                nextErrors.orders =
                    true;

                setOrders([]);
            }

            /* USERS */

            if (
                usersResult.status ===
                "fulfilled"
            ) {
                setUsers(
                    extractArray(
                        usersResult
                            .value.data,
                        ["users"]
                    )
                );
            } else {
                console.error(
                    "Users API error:",
                    usersResult.reason
                );

                nextErrors.users =
                    true;

                setUsers([]);
            }

            setErrors(nextErrors);
            setLoading(false);
        },
        []
    );

    useEffect(() => {
        load();
    }, [load]);

    return {
        products,
        orders,
        users,
        loading,
        errors,
        reload: load,
    };
}

/* ============================================================
   PAGE TITLES
============================================================ */

function getPageMeta(pathname) {
    if (
        pathname.startsWith(
            "/admin/orders"
        )
    ) {
        return {
            crumb: "Garage / Orders",
            title: "Orders",
        };
    }

    if (
        pathname.startsWith(
            "/admin/products"
        )
    ) {
        return {
            crumb: "Garage / Catalog",
            title: "Products",
        };
    }

    if (
        pathname.startsWith(
            "/admin/add-product"
        )
    ) {
        return {
            crumb: "Garage / Catalog",
            title: "Add Product",
        };
    }

    if (
        pathname.startsWith(
            "/admin/update-product"
        )
    ) {
        return {
            crumb: "Garage / Catalog",
            title: "Update Product",
        };
    }

    if (
        pathname.startsWith(
            "/admin/users"
        )
    ) {
        return {
            crumb: "Garage / People",
            title: "Users",
        };
    }

    return {
        crumb: "Garage / Overview",
        title: "Dashboard",
    };
}

/* ============================================================
   ADMIN PAGE
============================================================ */

export default function AdminPage() {
    const location =
        useLocation();

    const [
        sidebarOpen,
        setSidebarOpen,
    ] = useState(false);

    const data =
        useDashboardData();

    const pendingCount = useMemo(
        () =>
            data.orders.filter(
                (order) =>
                    [
                        "pending",
                        "processing",
                    ].includes(
                        String(
                            order?.orderStatus ||
                                order?.status ||
                                ""
                        ).toLowerCase()
                    )
            ).length,
        [data.orders]
    );

    const meta = getPageMeta(
        location.pathname
    );

    return (
        <div className="min-h-screen w-full bg-[#ECE8D6] text-[#0A0A0A]">
            {/* MOBILE OVERLAY */}

            <div
                onClick={() =>
                    setSidebarOpen(false)
                }
                className={`fixed inset-0 z-[850] bg-black/50 transition-all duration-300 lg:hidden ${
                    sidebarOpen
                        ? "visible opacity-100"
                        : "invisible opacity-0"
                }`}
            />

            {/* SIDEBAR */}

            <aside
                className={`fixed bottom-0 left-0 top-0 z-[900] flex w-[258px] flex-col border-r border-[#F5F5DC]/15 bg-[#0A0A0A] text-[#F5F5DC] shadow-[20px_0_40px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >
                <div className="flex h-[82px] shrink-0 items-center border-b border-[#F5F5DC]/15 px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF8F00] font-['Oswald'] text-lg font-bold text-[#0A0A0A] shadow-[0_0_25px_rgba(255,143,0,0.18)]">
                            MG
                        </div>

                        <div>
                            <div className="font-['Oswald'] text-[17px] font-bold uppercase tracking-wide">
                                Metal Garage
                            </div>

                            <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#FF8F00]">
                                Admin Console
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-[14px] py-[18px]">
                    <div className="mb-[22px]">
                        <SidebarHeading>
                            Overview
                        </SidebarHeading>

                        <SidebarLink
                            to="/admin"
                            label="Dashboard"
                            icon={
                                <RxDashboard />
                            }
                            active={
                                location.pathname ===
                                    "/admin" ||
                                location.pathname ===
                                    "/admin/"
                            }
                            onClick={() =>
                                setSidebarOpen(
                                    false
                                )
                            }
                        />

                        <SidebarLink
                            to="/admin/orders"
                            label="Orders"
                            count={
                                pendingCount >
                                0
                                    ? String(
                                          pendingCount
                                      )
                                    : undefined
                            }
                            icon={
                                <RxReader />
                            }
                            active={location.pathname.startsWith(
                                "/admin/orders"
                            )}
                            onClick={() =>
                                setSidebarOpen(
                                    false
                                )
                            }
                        />

                        <SidebarLink
                            to="/admin/products"
                            label="Products"
                            icon={
                                <RxCube />
                            }
                            active={
                                location.pathname.startsWith(
                                    "/admin/products"
                                ) ||
                                location.pathname.startsWith(
                                    "/admin/add-product"
                                ) ||
                                location.pathname.startsWith(
                                    "/admin/update-product"
                                )
                            }
                            onClick={() =>
                                setSidebarOpen(
                                    false
                                )
                            }
                        />
                    </div>

                    <div className="mb-[22px]">
                        <SidebarHeading>
                            People
                        </SidebarHeading>

                        <SidebarLink
                            to="/admin/users"
                            label="Users"
                            icon={
                                <RxPerson />
                            }
                            active={location.pathname.startsWith(
                                "/admin/users"
                            )}
                            onClick={() =>
                                setSidebarOpen(
                                    false
                                )
                            }
                        />
                    </div>

                    <div className="mb-[22px]">
                        <SidebarHeading>
                            Insights
                        </SidebarHeading>

                        <SidebarStaticItem
                            label="Analytics"
                            icon={
                                <FiBarChart2 />
                            }
                        />

                        <SidebarStaticItem
                            label="Marketing"
                            icon={
                                <FiTag />
                            }
                        />
                    </div>

                    <div>
                        <SidebarHeading>
                            System
                        </SidebarHeading>

                        <SidebarStaticItem
                            label="Settings"
                            icon={
                                <FiPackage />
                            }
                        />
                    </div>
                </nav>

                <div className="shrink-0 border-t border-[#F5F5DC]/15 p-4">
                    <div className="group flex cursor-pointer items-center gap-[11px] rounded-lg p-2 transition-all duration-200 hover:bg-[#F5F5DC]/[0.06]">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF8F00] to-[#CC7000] font-['Oswald'] text-[13px] font-bold text-[#0A0A0A]">
                            RT
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="truncate text-[13px] font-semibold text-[#F5F5DC]">
                                Rae Torres
                            </div>

                            <div className="text-[11px] text-[#F5F5DC]/50">
                                Store Admin
                            </div>
                        </div>

                        <RxChevronRight className="h-4 w-4 text-[#F5F5DC]/50 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                </div>
            </aside>

            {/* MAIN */}

            <div className="min-h-screen lg:ml-[258px]">
                <header className="sticky top-0 z-[800] flex min-h-[82px] items-center justify-between gap-6 border-b border-[#0A0A0A]/[0.14] bg-[#F5F5DC] px-4 py-[18px] sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            aria-label="Open menu"
                            onClick={() =>
                                setSidebarOpen(
                                    true
                                )
                            }
                            className="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-[#0A0A0A]/[0.14] text-[#0A0A0A] transition-all duration-200 hover:border-[#0A0A0A] hover:bg-[#ECE8D6] lg:hidden"
                        >
                            <RxHamburgerMenu className="text-[18px]" />
                        </button>

                        <div>
                            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[#0A0A0A]/45">
                                {meta.crumb}
                            </div>

                            <h1 className="font-['Oswald'] text-[22px] font-bold uppercase leading-none tracking-[0.01em]">
                                {meta.title}
                            </h1>
                        </div>
                    </div>

                    <div className="hidden w-[320px] max-w-full items-center gap-2.5 rounded-lg border border-[#0A0A0A]/[0.14] bg-[#ECE8D6] px-3.5 py-2.5 xl:flex">
                        <RxMagnifyingGlass className="shrink-0 text-[16px] text-[#0A0A0A]/40" />

                        <input
                            type="text"
                            placeholder="Search orders, products, customers..."
                            className="w-full bg-transparent text-[13px] text-[#0A0A0A] outline-none placeholder:text-[#0A0A0A]/40"
                        />

                        <span className="rounded border border-[#0A0A0A]/[0.14] px-1.5 py-0.5 font-mono text-[10px] text-[#0A0A0A]/35">
                            ⌘K
                        </span>
                    </div>

                    <div className="flex items-center gap-3.5">
                        <button
                            type="button"
                            aria-label="Notifications"
                            className="relative flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-[#0A0A0A]/[0.14] text-[#0A0A0A] transition-all duration-200 hover:border-[#0A0A0A] hover:bg-[#ECE8D6]"
                        >
                            <RxBell className="text-[17px]" />

                            {pendingCount >
                                0 && (
                                <span className="absolute right-[7px] top-[7px] h-[7px] w-[7px] rounded-full border-[1.5px] border-[#F5F5DC] bg-[#FF3B00]" />
                            )}
                        </button>

                        <button
                            type="button"
                            aria-label="Help"
                            className="hidden h-[38px] w-[38px] items-center justify-center rounded-lg border border-[#0A0A0A]/[0.14] text-[#0A0A0A] transition-all duration-200 hover:border-[#0A0A0A] hover:bg-[#ECE8D6] sm:flex"
                        >
                            <RxQuestionMarkCircled className="text-[17px]" />
                        </button>

                        <div className="flex items-center gap-2.5 border-l border-[#0A0A0A]/[0.14] pl-3.5">
                            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-gradient-to-br from-[#FF8F00] to-[#CC7000] font-['Oswald'] text-[12px] font-bold text-[#0A0A0A]">
                                RT
                            </div>

                            <FiChevronDown className="hidden text-[14px] text-[#0A0A0A]/40 sm:block" />
                        </div>
                    </div>
                </header>

                <div className="min-h-[calc(100vh-82px)] bg-[#ECE8D6]">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <DashboardContent
                                    data={data}
                                />
                            }
                        />

                        <Route
                            path="users"
                            element={
                                <AdminUser />
                            }
                        />

                        <Route
                            path="products"
                            element={
                                <AdminProductPage />
                            }
                        />

                        <Route
                            path="orders"
                            element={
                                <AdminOrders />
                            }
                        />

                        <Route
                            path="add-product"
                            element={
                                <AdminAddProduct />
                            }
                        />

                        <Route
                            path="update-product"
                            element={
                                <AdminUpdateProductPage />
                            }
                        />

                        <Route
                            path="*"
                            element={
                                <SimplePage title="404 Not Found" />
                            }
                        />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   DASHBOARD CONTENT
============================================================ */

function DashboardContent({
    data,
}) {
    const {
        products,
        orders,
        users,
        loading,
        errors,
        reload,
    } = data;

    /*
        IMPORTANT:

        Create a product lookup table.

        Example:

        product.productID
            ->
        product.images[0]
    */

    const productMap = useMemo(() => {
        const map = new Map();

        products.forEach(
            (product) => {
                const id =
                    product?.productID ||
                    product?._id;

                if (id) {
                    map.set(
                        String(id),
                        product
                    );
                }
            }
        );

        return map;
    }, [products]);

    const stats = useMemo(() => {
        const now = new Date();

        const thisMonth =
            now.getMonth();

        const thisYear =
            now.getFullYear();

        const previousMonth =
            new Date(
                thisYear,
                thisMonth - 1,
                1
            );

        let revenueThis = 0;
        let revenuePrev = 0;

        let ordersThis = 0;
        let ordersPrev = 0;

        orders.forEach(
            (order) => {
                const status =
                    getOrderStatus(
                        order
                    );

                const date =
                    getOrderDate(
                        order
                    );

                if (!date) {
                    return;
                }

                const sameThis =
                    date.getMonth() ===
                        thisMonth &&
                    date.getFullYear() ===
                        thisYear;

                const samePrev =
                    date.getMonth() ===
                        previousMonth.getMonth() &&
                    date.getFullYear() ===
                        previousMonth.getFullYear();

                if (sameThis) {
                    ordersThis += 1;
                }

                if (samePrev) {
                    ordersPrev += 1;
                }

                if (
                    status ===
                    "cancelled"
                ) {
                    return;
                }

                if (sameThis) {
                    revenueThis +=
                        getOrderTotal(
                            order
                        );
                }

                if (samePrev) {
                    revenuePrev +=
                        getOrderTotal(
                            order
                        );
                }
            }
        );

        const awaiting =
            orders.filter(
                (order) => {
                    const status =
                        String(
                            order?.orderStatus ||
                                order?.status ||
                                ""
                        ).toLowerCase();

                    return [
                        "pending",
                        "processing",
                    ].includes(
                        status
                    );
                }
            ).length;

        let newUsers = 0;
        let usersPrev = 0;

        users.forEach(
            (user) => {
                const raw =
                    user?.createdAt ||
                    user?.date ||
                    user?.registeredAt;

                if (!raw) {
                    return;
                }

                const date =
                    new Date(raw);

                if (
                    isNaN(
                        date.getTime()
                    )
                ) {
                    return;
                }

                if (
                    date.getMonth() ===
                        thisMonth &&
                    date.getFullYear() ===
                        thisYear
                ) {
                    newUsers += 1;
                }

                if (
                    date.getMonth() ===
                        previousMonth.getMonth() &&
                    date.getFullYear() ===
                        previousMonth.getFullYear()
                ) {
                    usersPrev += 1;
                }
            }
        );

        const lowStock =
            products.filter(
                (product) =>
                    Number(
                        product?.quantity
                    ) <= 10
            ).length;

        return {
            revenueThis,
            revenuePrev,

            revenueChange:
                percentChange(
                    revenueThis,
                    revenuePrev
                ),

            ordersThis,

            ordersChange:
                percentChange(
                    ordersThis,
                    ordersPrev
                ),

            awaiting,

            newUsers,

            usersChange:
                percentChange(
                    newUsers,
                    usersPrev
                ),

            lowStock,
        };
    }, [
        orders,
        users,
        products,
    ]);

    /* ========================================================
       LAST 7 DAYS
    ======================================================== */

    const weekBars = useMemo(
        () => {
            const days = [];

            const today =
                new Date();

            today.setHours(
                0,
                0,
                0,
                0
            );

            for (
                let i = 6;
                i >= 0;
                i--
            ) {
                const date =
                    new Date(
                        today
                    );

                date.setDate(
                    today.getDate() -
                        i
                );

                days.push({
                    key: date.toDateString(),

                    label: date
                        .toLocaleDateString(
                            undefined,
                            {
                                weekday:
                                    "short",
                            }
                        )
                        .toUpperCase(),

                    completed: 0,
                    pending: 0,
                });
            }

            orders.forEach(
                (order) => {
                    const date =
                        getOrderDate(
                            order
                        );

                    if (!date) {
                        return;
                    }

                    const bucket =
                        days.find(
                            (item) =>
                                item.key ===
                                date.toDateString()
                        );

                    if (!bucket) {
                        return;
                    }

                    const status =
                        getOrderStatus(
                            order
                        );

                    if (
                        status ===
                        "cancelled"
                    ) {
                        return;
                    }

                    const total =
                        getOrderTotal(
                            order
                        );

                    if (
                        isCompleted(
                            status
                        )
                    ) {
                        bucket.completed +=
                            total;
                    } else {
                        bucket.pending +=
                            total;
                    }
                }
            );

            return days;
        },
        [orders]
    );

    const weekTotal =
        weekBars.reduce(
            (sum, bar) =>
                sum +
                bar.completed +
                bar.pending,
            0
        );

    /* ========================================================
       TOP PRODUCTS
    ======================================================== */

    const topProducts = useMemo(
        () => {
            const map =
                new Map();

            orders.forEach(
                (order) => {
                    if (
                        getOrderStatus(
                            order
                        ) ===
                        "cancelled"
                    ) {
                        return;
                    }

                    getOrderItems(
                        order
                    ).forEach(
                        (item) => {
                            const name =
                                getItemName(
                                    item
                                );

                            if (!name) {
                                return;
                            }

                            const productID =
                                getItemProductID(
                                    item
                                );

                            /*
                                First try image stored
                                inside the order item.

                                If not available,
                                find the product in
                                /api/products.
                            */

                            const product =
                                productID
                                    ? productMap.get(
                                          String(
                                              productID
                                          )
                                      )
                                    : null;

                            const image =
                                getItemImage(
                                    item
                                ) ||
                                getProductImage(
                                    product
                                );

                            const existing =
                                map.get(
                                    String(
                                        productID ||
                                            name
                                    )
                                );

                            const entry =
                                existing || {
                                    id:
                                        productID ||
                                        name,
                                    name,
                                    units: 0,
                                    amount: 0,
                                    image:
                                        image ||
                                        null,
                                };

                            entry.units +=
                                getItemQty(
                                    item
                                );

                            entry.amount +=
                                getItemPrice(
                                    item
                                ) *
                                getItemQty(
                                    item
                                );

                            if (
                                !entry.image &&
                                image
                            ) {
                                entry.image =
                                    image;
                            }

                            map.set(
                                String(
                                    productID ||
                                        name
                                ),
                                entry
                            );
                        }
                    );
                }
            );

            return [
                ...map.values(),
            ]
                .sort(
                    (a, b) =>
                        b.units -
                        a.units
                )
                .slice(0, 5);
        },
        [
            orders,
            productMap,
        ]
    );

    /* ========================================================
       RECENT ORDERS
    ======================================================== */

    const recentOrders =
        useMemo(
            () => {
                return [
                    ...orders,
                ]
                    .sort(
                        (a, b) =>
                            (getOrderDate(
                                b
                            )?.getTime() ||
                                0) -
                            (getOrderDate(
                                a
                            )?.getTime() ||
                                0)
                    )
                    .slice(0, 5);
            },
            [orders]
        );

    /* ========================================================
       LOW STOCK

       FIX:
       Only display actual low-stock products.
    ======================================================== */

    const lowStockList =
        useMemo(
            () => {
                return products
                    .filter(
                        (product) =>
                            Number(
                                product?.quantity
                            ) <= 10
                    )
                    .sort(
                        (a, b) =>
                            Number(
                                a?.quantity ||
                                    0
                            ) -
                            Number(
                                b?.quantity ||
                                    0
                            )
                    )
                    .slice(0, 5);
            },
            [products]
        );

    /* ========================================================
       EXPORT ORDERS
    ======================================================== */

    function exportOrders() {
        if (!orders.length) {
            return;
        }

        const rows = [
            [
                "Order",
                "Customer",
                "Status",
                "Date",
                "Total",
            ],
        ];

        orders.forEach(
            (order) => {
                rows.push([
                    getOrderID(
                        order
                    ),

                    getCustomerName(
                        order
                    ),

                    getDisplayOrderStatus(
                        order
                    ),

                    getOrderDate(
                        order
                    )?.toISOString() ||
                        "",

                    getOrderTotal(
                        order
                    ),
                ]);
            }
        );

        const csv =
            rows
                .map(
                    (row) =>
                        row
                            .map(
                                (
                                    value
                                ) =>
                                    `"${String(
                                        value
                                    ).replace(
                                        /"/g,
                                        '""'
                                    )}"`
                            )
                            .join(",")
                )
                .join("\n");

        const blob =
            new Blob(
                [csv],
                {
                    type: "text/csv;charset=utf-8;",
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href = url;

        link.download =
            "metal-garage-orders.csv";

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        URL.revokeObjectURL(
            url
        );
    }

    const todayText =
        new Date().toLocaleDateString(
            undefined,
            {
                month: "short",
                day: "numeric",
            }
        );

    const failed =
        Object.keys(errors);

    return (
        <div className="px-4 pb-[60px] pt-5 sm:px-6 sm:pt-7 lg:px-8">
            {/* HEADER */}

            <div className="mb-[26px] flex flex-wrap items-center justify-between gap-3.5">
                <div className="text-[13px] text-[#0A0A0A]/50">
                    Welcome back — here's
                    what's happening across
                    the garage today,{" "}
                    <span className="font-mono text-[#0A0A0A]">
                        {todayText}
                    </span>
                    .
                </div>

                <div className="flex gap-2.5">
                    <button
                        type="button"
                        onClick={
                            exportOrders
                        }
                        className="inline-flex items-center gap-2 rounded-[7px] border border-[#0A0A0A]/[0.14] px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] transition-all duration-200 hover:border-[#0A0A0A] hover:bg-[#ECE8D6]"
                    >
                        <RxDownload className="text-[14px]" />
                        Export
                    </button>

                    <Link
                        to="/admin/add-product"
                        className="inline-flex items-center gap-2 rounded-[7px] bg-[#0A0A0A] px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#F5F5DC] transition-all duration-200 hover:bg-[#FF8F00] hover:text-[#0A0A0A]"
                    >
                        <RxPlus className="text-[14px]" />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* API ERRORS */}

            {failed.length >
                0 && (
                <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#FF3B00]/20 bg-[#FF3B00]/[0.06] px-4 py-3 text-[12px] text-[#FF3B00]">
                    <span>
                        Could not load:{" "}
                        <b className="uppercase">
                            {failed.join(
                                ", "
                            )}
                        </b>
                        . Check the API
                        routes and your
                        login token.
                    </span>

                    <button
                        type="button"
                        onClick={
                            reload
                        }
                        className="rounded-[6px] border border-[#FF3B00]/30 px-3 py-1 font-semibold uppercase tracking-[0.06em] hover:bg-[#FF3B00]/10"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* STAT CARDS */}

            <div className="mb-[26px] grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    icon={
                        <FiDollarSign />
                    }
                    iconType="orange"
                    loading={
                        loading
                    }
                    trendValue={
                        stats.revenueChange
                    }
                    label="Revenue this month"
                    value={money(
                        stats.revenueThis
                    )}
                    sub={`vs ${money(
                        stats.revenuePrev
                    )} last month`}
                />

                <StatCard
                    icon={
                        <FiShoppingCart />
                    }
                    iconType="black"
                    loading={
                        loading
                    }
                    trendValue={
                        stats.ordersChange
                    }
                    label="Orders this month"
                    value={
                        stats.ordersThis
                    }
                    sub={`${stats.awaiting} awaiting fulfillment`}
                />

                <StatCard
                    icon={
                        <FiUsers />
                    }
                    iconType="green"
                    loading={
                        loading
                    }
                    trendValue={
                        stats.usersChange
                    }
                    label="New customers"
                    value={
                        stats.newUsers
                    }
                    sub={`${users.length} total users`}
                />

                <StatCard
                    icon={
                        <FiAlertTriangle />
                    }
                    iconType="red"
                    loading={
                        loading
                    }
                    trendText={`${stats.lowStock} item${
                        stats.lowStock ===
                        1
                            ? ""
                            : "s"
                    }`}
                    trendDown
                    label="Low stock alerts"
                    value={
                        stats.lowStock
                    }
                    sub={
                        stats.lowStock >
                        0
                            ? "Reorder recommended"
                            : "Inventory looks healthy"
                    }
                />
            </div>

            {/* REVENUE + TOP PRODUCTS */}

            <div className="mb-[18px] grid grid-cols-1 gap-[18px] xl:grid-cols-[1.7fr_1fr]">
                <Panel
                    title="Revenue Overview"
                    subtitle={`Last 7 days — ${money(
                        weekTotal
                    )} total`}
                >
                    <RevenueChart
                        bars={
                            weekBars
                        }
                        loading={
                            loading
                        }
                    />

                    <div className="mt-[18px] flex gap-5 border-t border-[#0A0A0A]/[0.14] pt-[18px]">
                        <LegendDot
                            color="bg-[#0A0A0A]"
                            label="Completed orders"
                        />

                        <LegendDot
                            color="bg-[#FF8F00]"
                            label="Pending orders"
                        />
                    </div>
                </Panel>

                <Panel
                    title="Top Products"
                    subtitle="By units sold, all orders"
                >
                    {loading ? (
                        <EmptyState text="Loading..." />
                    ) : topProducts.length ===
                      0 ? (
                        <EmptyState text="No sales data yet" />
                    ) : (
                        <div className="flex flex-col gap-4">
                            {topProducts.map(
                                (
                                    product,
                                    index
                                ) => (
                                    <TopProduct
                                        key={`${product.id}-${index}`}
                                        rank={String(
                                            index +
                                                1
                                        ).padStart(
                                            2,
                                            "0"
                                        )}
                                        name={
                                            product.name
                                        }
                                        image={
                                            product.image
                                        }
                                        amount={money(
                                            product.amount
                                        )}
                                        units={`${product.units} unit${
                                            product.units ===
                                            1
                                                ? ""
                                                : "s"
                                        }`}
                                    />
                                )
                            )}
                        </div>
                    )}
                </Panel>
            </div>

            {/* ORDERS + INVENTORY */}

            <div className="grid grid-cols-1 gap-[18px] xl:grid-cols-[1.7fr_1fr]">
                <Panel
                    className="min-w-0"
                    title="Recent Orders"
                    subtitle="Latest activity across the store"
                    action={
                        <Link
                            to="/admin/orders"
                            className="flex items-center gap-1.5 text-[12px] font-semibold text-[#CC7000] transition-colors hover:text-[#FF8F00]"
                        >
                            View all
                            <RxChevronRight className="text-[13px]" />
                        </Link>
                    }
                >
                    {loading ? (
                        <EmptyState text="Loading..." />
                    ) : recentOrders.length ===
                      0 ? (
                        <EmptyState text="No orders yet" />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        {[
                                            "Order",
                                            "Customer",
                                            "Item",
                                            "Status",
                                            "Total",
                                        ].map(
                                            (
                                                heading
                                            ) => (
                                                <th
                                                    key={
                                                        heading
                                                    }
                                                    className="whitespace-nowrap border-b border-[#0A0A0A]/[0.14] px-2.5 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[#0A0A0A]/42"
                                                >
                                                    {
                                                        heading
                                                    }
                                                </th>
                                            )
                                        )}
                                    </tr>
                                </thead>

                                <tbody>
                                    {recentOrders.map(
                                        (
                                            order,
                                            index
                                        ) => {
                                            const items =
                                                getOrderItems(
                                                    order
                                                );

                                            const firstName =
                                                items[0]
                                                    ? getItemName(
                                                          items[0]
                                                      )
                                                    : null;

                                            const itemText =
                                                firstName
                                                    ? items.length >
                                                      1
                                                        ? `${firstName} +${
                                                              items.length -
                                                              1
                                                          }`
                                                        : firstName
                                                    : "-";

                                            const status =
                                                getOrderStatus(
                                                    order
                                                );

                                            const name =
                                                getCustomerName(
                                                    order
                                                );

                                            return (
                                                <OrderRow
                                                    key={`${getOrderID(
                                                        order
                                                    )}-${index}`}
                                                    order={`#${String(
                                                        getOrderID(
                                                            order
                                                        )
                                                    ).slice(
                                                        -8
                                                    )}`}
                                                    initials={initialsOf(
                                                        name
                                                    )}
                                                    name={
                                                        name
                                                    }
                                                    email={getCustomerEmail(
                                                        order
                                                    )}
                                                    item={
                                                        itemText
                                                    }
                                                    status={status}
                                                    type={statusType(
                                                        status
                                                    )}
                                                    amount={money(
                                                        getOrderTotal(
                                                            order
                                                        )
                                                    )}
                                                />
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Panel>

                <Panel
                    title="Low Stock"
                    subtitle="Restock before you sell out"
                >
                    {loading ? (
                        <EmptyState text="Loading..." />
                    ) : lowStockList.length ===
                      0 ? (
                        <EmptyState text="No low-stock products" />
                    ) : (
                        lowStockList.map(
                            (
                                product,
                                index
                            ) => {
                                const quantity =
                                    Number(
                                        product?.quantity ||
                                            0
                                    );

                                return (
                                    <StockItem
                                        key={
                                            product.productID ||
                                            product._id ||
                                            index
                                        }
                                        name={
                                            product.name ||
                                            "Unnamed Product"
                                        }
                                        series={
                                            product.series ||
                                            product.category ||
                                            "Uncategorized"
                                        }
                                        quantity={
                                            quantity <=
                                            0
                                                ? "Out of stock"
                                                : `${quantity} left`
                                        }
                                        percentage={`${Math.min(
                                            (quantity /
                                                50) *
                                                100,
                                            100
                                        )}%`}
                                        type={
                                            quantity <=
                                            5
                                                ? "crit"
                                                : "low"
                                        }
                                        last={
                                            index ===
                                            lowStockList.length -
                                                1
                                        }
                                    />
                                );
                            }
                        )
                    )}
                </Panel>
            </div>

            {/* QUICK ACTIONS */}

            <div className="mt-[18px] grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
                <QuickAction
                    to="/admin/add-product"
                    icon={
                        <RxPlus />
                    }
                    title="Add Product"
                    description="List a new casting to the shop"
                />

                <QuickAction
                    to="/admin/products"
                    icon={
                        <FiPackage />
                    }
                    title="Restock Inventory"
                    description="Update counts for low-stock items"
                />

                <QuickAction
                    to="/admin/orders"
                    icon={
                        <FiShoppingCart />
                    }
                    title="Manage Orders"
                    description="Review and fulfill customer orders"
                />

                <QuickAction
                    to="/admin/users"
                    icon={
                        <FiUsers />
                    }
                    title="View Users"
                    description="See all registered customers"
                />
            </div>
        </div>
    );
}

/* ============================================================
   PANEL
============================================================ */

function Panel({
    title,
    subtitle,
    action,
    children,
    className = "",
}) {
    return (
        <div
            className={`rounded-xl border border-[#0A0A0A]/[0.14] bg-[#F5F5DC] p-5 sm:p-6 ${className}`}
        >
            <div className="mb-[22px] flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="font-['Work_Sans'] text-[15px] font-semibold">
                        {title}
                    </h3>

                    {subtitle && (
                        <div className="mt-1 text-[12px] text-[#0A0A0A]/45">
                            {subtitle}
                        </div>
                    )}
                </div>

                {action}
            </div>

            {children}
        </div>
    );
}

function EmptyState({ text }) {
    return (
        <div className="flex min-h-[120px] items-center justify-center text-[12px] text-[#0A0A0A]/40">
            {text}
        </div>
    );
}

function LegendDot({
    color,
    label,
}) {
    return (
        <div className="flex items-center gap-2 text-[12px] text-[#0A0A0A]/60">
            <span
                className={`h-[9px] w-[9px] rounded-[2px] ${color}`}
            />

            {label}
        </div>
    );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
    icon,
    iconType,
    trendValue,
    trendText,
    trendDown = false,
    label,
    value,
    sub,
    loading,
}) {
    const iconClasses = {
        orange:
            "bg-[#FF8F00]/[0.12] text-[#CC7000]",

        black:
            "bg-[#0A0A0A]/[0.06] text-[#0A0A0A]",

        green:
            "bg-[#2F7A45]/[0.12] text-[#2F7A45]",

        red:
            "bg-[#FF3B00]/[0.10] text-[#FF3B00]",
    };

    let down = trendDown;
    let text = trendText;

    if (
        text === undefined &&
        trendValue !== undefined
    ) {
        down = trendValue < 0;

        text = `${Math.abs(
            trendValue
        ).toFixed(1)}%`;
    }

    const TrendIcon = down
        ? FiTrendingDown
        : FiTrendingUp;

    return (
        <div className="group relative overflow-hidden rounded-xl border border-[#0A0A0A]/[0.14] bg-[#F5F5DC] p-5 transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_16px_30px_rgba(10,10,10,0.08)]">
            <div className="mb-3.5 flex items-start justify-between">
                <div
                    className={`flex h-[38px] w-[38px] items-center justify-center rounded-[9px] ${iconClasses[iconType]}`}
                >
                    {icon}
                </div>

                {text !== undefined &&
                    !loading && (
                        <div
                            className={`flex items-center gap-1 rounded-full px-2 py-1 font-mono text-[10px] font-semibold ${
                                down
                                    ? "bg-[#FF3B00]/10 text-[#FF3B00]"
                                    : "bg-[#2F7A45]/10 text-[#2F7A45]"
                            }`}
                        >
                            <TrendIcon className="text-[11px]" />
                            {text}
                        </div>
                    )}
            </div>

            <div className="mb-1.5 text-[12px] text-[#0A0A0A]/50">
                {label}
            </div>

            <div className="font-mono text-[25px] font-semibold leading-none">
                {loading
                    ? "..."
                    : value}
            </div>

            <div className="mt-1.5 text-[11px] text-[#0A0A0A]/40">
                {loading
                    ? ""
                    : sub}
            </div>
        </div>
    );
}

/* ============================================================
   REVENUE CHART
============================================================ */

function RevenueChart({
    bars,
    loading,
}) {
    const max = Math.max(
        ...bars.map(
            (bar) =>
                bar.completed +
                bar.pending
        ),
        1
    );

    const CHART_H = 170;

    if (loading) {
        return (
            <EmptyState text="Loading..." />
        );
    }

    return (
        <div className="flex h-[210px] items-end gap-2.5 overflow-hidden px-1 pt-6 sm:gap-4">
            {bars.map(
                (bar) => {
                    const total =
                        bar.completed +
                        bar.pending;

                    const totalH =
                        total > 0
                            ? Math.max(
                                  (total /
                                      max) *
                                      CHART_H,
                                  4
                              )
                            : 2;

                    const completedH =
                        total > 0
                            ? (bar.completed /
                                  total) *
                              totalH
                            : 0;

                    const pendingH =
                        totalH -
                        completedH;

                    return (
                        <div
                            key={
                                bar.key
                            }
                            className="group relative flex h-full flex-1 flex-col items-center justify-end gap-2.5"
                        >
                            <div
                                className="relative flex w-full max-w-[38px] flex-col-reverse rounded-t-[5px] rounded-b-[3px] bg-[#0A0A0A]/10 transition-all duration-200 group-hover:brightness-110"
                                style={{
                                    height: `${totalH}px`,
                                }}
                            >
                                <div
                                    className="w-full rounded-b-[3px] bg-[#0A0A0A]"
                                    style={{
                                        height: `${completedH}px`,
                                    }}
                                />

                                <div
                                    className="w-full rounded-t-[5px] bg-[#FF8F00]"
                                    style={{
                                        height: `${pendingH}px`,
                                    }}
                                />

                                <div className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-[#0A0A0A]/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                    {shortMoney(
                                        total
                                    )}
                                </div>
                            </div>

                            <div className="font-mono text-[10px] text-[#0A0A0A]/50">
                                {
                                    bar.label
                                }
                            </div>
                        </div>
                    );
                }
            )}
        </div>
    );
}

/* ============================================================
   TOP PRODUCT
============================================================ */

function TopProduct({
    rank,
    name,
    image,
    amount,
    units,
}) {
    const [
        imageError,
        setImageError,
    ] = useState(false);

    const showImage =
        image && !imageError;

    return (
        <div className="flex items-center gap-3">
            <span className="w-4 shrink-0 font-mono text-[11px] text-[#0A0A0A]/35">
                {rank}
            </span>

            {/* ==================================================
                REAL PRODUCT IMAGE
            ================================================== */}

            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#0A0A0A]">
                {showImage ? (
                    <img
                        src={image}
                        alt={name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                        onError={() =>
                            setImageError(
                                true
                            )
                        }
                    />
                ) : (
                    <FiImage className="text-[20px] text-[#F5F5DC]/40" />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold">
                    {name}
                </div>

                <div className="text-[11px] text-[#0A0A0A]/45">
                    {units}
                </div>
            </div>

            <div className="shrink-0 text-right">
                <div className="font-mono text-[13px] font-semibold">
                    {amount}
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   ORDER ROW
============================================================ */

function OrderRow({
    order,
    initials,
    name,
    email,
    item,
    status,
    type,
    amount,
}) {
    const statusClasses = {
        paid:
            "bg-[#2F7A45]/10 text-[#2F7A45] before:bg-[#2F7A45]",

        pending:
            "bg-[#FF8F00]/[0.12] text-[#CC7000] before:bg-[#FF8F00]",

        shipped:
            "bg-[#0A0A0A]/[0.06] text-[#0A0A0A] before:bg-[#0A0A0A]",

        cancelled:
            "bg-[#FF3B00]/[0.08] text-[#FF3B00] before:bg-[#FF3B00]",
    };

    const cell =
        "border-b border-[#0A0A0A]/[0.07] px-2.5 py-3.5";

    return (
        <tr className="transition-colors duration-150 hover:bg-[#ECE8D6]">
            <td
                className={`${cell} whitespace-nowrap font-mono text-[12.5px] font-semibold`}
            >
                {order}
            </td>

            <td className={cell}>
                <div className="flex min-w-[150px] items-center gap-2.5">
                    <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#DFDABF] font-['Oswald'] text-[11px] font-bold">
                        {initials}
                    </div>

                    <div className="min-w-0">
                        <div className="max-w-[160px] truncate text-[12.5px] font-medium">
                            {name}
                        </div>

                        {email && (
                            <div className="max-w-[160px] truncate text-[11px] text-[#0A0A0A]/40">
                                {email}
                            </div>
                        )}
                    </div>
                </div>
            </td>

            <td
                className={`${cell} whitespace-nowrap text-[13px]`}
            >
                {item}
            </td>

            <td className={cell}>
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-[5px] font-mono text-[10px] font-semibold uppercase tracking-[0.05em] before:h-1.5 before:w-1.5 before:rounded-full ${
                        statusClasses[
                            type
                        ]
                    }`}
                >
                    {status}
                </span>
            </td>

            <td
                className={`${cell} whitespace-nowrap font-mono text-[12.5px] font-semibold`}
            >
                {amount}
            </td>
        </tr>
    );
}

/* ============================================================
   STOCK ITEM
============================================================ */

function StockItem({
    name,
    series,
    quantity,
    percentage,
    type,
    last = false,
}) {
    const fillClasses = {
        crit: "bg-[#FF3B00]",
        low: "bg-[#FF8F00]",
        ok: "bg-[#2F7A45]",
    };

    return (
        <div
            className={
                last
                    ? "mb-0"
                    : "mb-[18px]"
            }
        >
            <div className="mb-2 flex items-center justify-between gap-2.5">
                <div className="min-w-0 text-[13px] font-semibold">
                    <div className="truncate">
                        {name}
                    </div>

                    <span className="mt-0.5 block text-[10.5px] font-normal text-[#0A0A0A]/40">
                        {series}
                    </span>
                </div>

                <div className="shrink-0 font-mono text-[12px] font-semibold">
                    {quantity}
                </div>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-[#ECE8D6]">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${fillClasses[type]}`}
                    style={{
                        width: percentage,
                    }}
                />
            </div>
        </div>
    );
}

/* ============================================================
   QUICK ACTION
============================================================ */

function QuickAction({
    to,
    icon,
    title,
    description,
}) {
    const className =
        "group flex flex-col gap-3 rounded-xl border border-[#0A0A0A]/[0.14] bg-[#F5F5DC] p-5 transition-all duration-200 hover:-translate-y-[3px] hover:border-[#0A0A0A] hover:shadow-[0_14px_26px_rgba(10,10,10,0.08)]";

    const content = (
        <>
            <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#0A0A0A] text-[#FF8F00] transition-all duration-200 group-hover:bg-[#FF8F00] group-hover:text-[#0A0A0A]">
                {icon}
            </div>

            <div className="text-[13.5px] font-semibold">
                {title}
            </div>

            <div className="text-[11.5px] text-[#0A0A0A]/45">
                {description}
            </div>
        </>
    );

    return to ? (
        <Link
            to={to}
            className={
                className
            }
        >
            {content}
        </Link>
    ) : (
        <button
            type="button"
            className={`${className} text-left`}
        >
            {content}
        </button>
    );
}

/* ============================================================
   SIDEBAR
============================================================ */

function SidebarHeading({
    children,
}) {
    return (
        <div className="px-3 pb-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#F5F5DC]/50">
            {children}
        </div>
    );
}

function SidebarLink({
    to,
    label,
    icon,
    active = false,
    count,
    onClick,
}) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={`group relative mb-1 flex min-h-[44px] w-full items-center gap-3 rounded-[6px] border-l-2 px-3 py-[11px] text-[13.5px] font-medium transition-all duration-[180ms] ease-in-out ${
                active
                    ? "border-l-[#FF8F00] bg-[#FF8F00]/10 text-[#F5F5DC]"
                    : "border-l-transparent text-[#F5F5DC]/70 hover:bg-[#F5F5DC]/[0.06] hover:text-[#F5F5DC]"
            }`}
        >
            <span
                className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center transition-colors duration-200 ${
                    active
                        ? "text-[#FF8F00]"
                        : "text-[#F5F5DC]/85 group-hover:text-[#F5F5DC]"
                }`}
            >
                {icon}
            </span>

            <span className="flex-1">
                {label}
            </span>

            {count && (
                <span
                    className={`rounded-full px-[7px] py-0.5 font-mono text-[10.5px] ${
                        active
                            ? "bg-[#FF8F00] font-semibold text-[#0A0A0A]"
                            : "bg-[#F5F5DC]/10 text-[#F5F5DC]/70"
                    }`}
                >
                    {count}
                </span>
            )}
        </Link>
    );
}

function SidebarStaticItem({
    label,
    icon,
}) {
    return (
        <div className="group mb-1 flex min-h-[44px] w-full cursor-default items-center gap-3 rounded-[6px] border-l-2 border-l-transparent px-3 py-[11px] text-[13.5px] font-medium text-[#F5F5DC]/70 transition-all duration-[180ms] hover:bg-[#F5F5DC]/[0.06] hover:text-[#F5F5DC]">
            <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-[#F5F5DC]/85 transition-colors duration-200 group-hover:text-[#F5F5DC]">
                {icon}
            </span>

            <span>
                {label}
            </span>
        </div>
    );
}

/* ============================================================
   SIMPLE PAGE
============================================================ */

function SimplePage({
    title,
}) {
    return (
        <div className="flex min-h-[calc(100vh-82px)] items-start p-5 sm:p-8">
            <div className="rounded-xl border border-[#0A0A0A]/[0.14] bg-[#F5F5DC] p-6">
                <h1 className="font-['Oswald'] text-2xl font-bold uppercase">
                    {title}
                </h1>
            </div>
        </div>
    );
}