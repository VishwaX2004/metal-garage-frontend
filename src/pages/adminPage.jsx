import {
    Link,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";

import AdminProductPage from "./admin/adminProducts";

import {
    RxDashboard,
    RxCube,
    RxPerson,
    RxReader,
    RxChevronRight,
} from "react-icons/rx";
import AdminAddProduct from "./admin/adminAddProduct";

export default function AdminPage() {
    const location = useLocation();

    return (
        <div className="w-full h-screen flex overflow-hidden">

            {/* ================= SIDEBAR ================= */}
            <aside className="h-full w-[250px] shrink-0 bg-primary overflow-hidden">
                <div className="px-5 pt-5 flex flex-col gap-1">

                    {/* Logo / Title */}
                    <h1 className="text-2xl font-bold text-secondary mb-6">
                        Admin Panel
                    </h1>

                    {/* Dashboard */}
                    <SidebarLink
                        to="/admin"
                        label="Dashboard"
                        icon={<RxDashboard />}
                        active={
                            location.pathname === "/admin" ||
                            location.pathname === "/admin/"
                        }
                    />

                    {/* Orders */}
                    <SidebarLink
                        to="/admin/orders"
                        label="Orders"
                        icon={<RxReader />}
                        active={location.pathname.startsWith(
                            "/admin/orders"
                        )}
                    />

                    {/* Products */}
                    <SidebarLink
                        to="/admin/products"
                        label="Products"
                        icon={<RxCube />}
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
                    />

                    {/* Users */}
                    <SidebarLink
                        to="/admin/users"
                        label="Users"
                        icon={<RxPerson />}
                        active={location.pathname.startsWith(
                            "/admin/users"
                        )}
                    />

                </div>
            </aside>

            {/* ================= MAIN CONTENT ================= */}
            <main className="w-[calc(100%-250px)] h-full bg-primary rounded-[20px] border-3 border-accent overflow-hidden">

                <div className="h-full w-full overflow-y-auto">

                    <Routes>

                        {/* Dashboard */}
                        <Route
                            path="/"
                            element={
                                <h1 className="text-2xl font-bold p-5">
                                    Dashboard
                                </h1>
                            }
                        />

                        {/* Users */}
                        <Route
                            path="users"
                            element={
                                <h1 className="text-2xl font-bold p-5">
                                    Users
                                </h1>
                            }
                        />

                        {/* Products */}
                        <Route
                            path="products"
                            element={<AdminProductPage />}
                        />

                        {/* Orders */}
                        <Route
                            path="orders"
                            element={
                                <h1 className="text-2xl font-bold p-5">
                                    Orders
                                </h1>
                            }
                        />

                        {/* Add Product */}
                        <Route
                            path="add-product"
                            element={
                                <AdminAddProduct />
                            }
                        />

                        {/* Update Product */}
                        <Route
                            path="update-product"
                            element={
                                <h1 className="text-2xl font-bold p-5">
                                    Update Product
                                </h1>
                            }
                        />



                        {/* 404 */}
                        <Route
                            path="*"
                            element={
                                <h1 className="text-2xl font-bold p-5">
                                    404 Not Found
                                </h1>
                            }
                        />

                    </Routes>

                </div>

            </main>
        </div>
    );
}


/* =========================================================
   SIDEBAR LINK COMPONENT
========================================================= */

function SidebarLink({
    to,
    label,
    icon,
    active = false,
}) {
    return (
        <Link
            to={to}
            className={`
                group
                relative
                mb-2
                flex
                h-[52px]
                w-full
                items-center
                rounded-[14px]
                px-3
                transition-all
                duration-200

                ${
                    active
                        ? `
                            bg-accent
                            text-primary
                            shadow-[0_6px_18px_rgba(8,6,22,0.16)]
                        `
                        : `
                            bg-transparent
                            text-accent
                            hover:bg-accent/5
                            hover:text-accent
                        `
                }
            `}
        >

            {/* Active indicator */}
            {active && (
                <span
                    className="
                        absolute
                        -left-[1px]
                        top-1/2
                        h-6
                        w-[3px]
                        -translate-y-1/2
                        rounded-r-full
                        bg-primary
                    "
                />
            )}

            {/* Icon */}
            <span
                className={`
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    text-[18px]
                    transition-all
                    duration-200

                    ${
                        active
                            ? `
                                bg-primary
                                text-accent
                            `
                            : `
                                bg-accent/5
                                text-accent
                                group-hover:bg-accent/10
                                group-hover:text-accent
                            `
                    }
                `}
            >
                {icon}
            </span>

            {/* Label */}
            <span
                className={`
                    ml-3
                    flex-1
                    text-[11px]
                    font-semibold
                    tracking-wide

                    ${
                        active
                            ? "text-primary"
                            : "text-accent group-hover:text-accent"
                    }
                `}
            >
                {label}
            </span>

            {/* Arrow */}
            <RxChevronRight
                className={`
                    text-[14px]
                    transition-all
                    duration-200

                    ${
                        active
                            ? `
                                translate-x-0
                                text-primary/45
                            `
                            : `
                                -translate-x-1
                                text-accent
                                group-hover:translate-x-0
                                group-hover:text-accent
                            `
                    }
                `}
            />

        </Link>
    );
}
