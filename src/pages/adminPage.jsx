import {
    Link,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";

import { useState } from "react";

import AdminProductPage from "./admin/adminProducts";
import AdminAddProduct from "./admin/adminAddProduct";

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
    RxArrowTopRight,
    RxDotsHorizontal,
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
    FiChevronDown,
    FiChevronRight,
} from "react-icons/fi";
import AdminUpdateProductPage from "./admin/adminUpdateProduct";


export default function AdminPage() {
    const location = useLocation();

    // Only for responsive sidebar UI.
    // Existing routing logic remains unchanged.
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen w-full bg-[#ECE8D6] text-[#0A0A0A]">

            {/* =====================================================
                MOBILE OVERLAY
            ===================================================== */}
            <div
                onClick={() => setSidebarOpen(false)}
                className={`
                    fixed inset-0 z-[850]
                    bg-black/50
                    transition-all duration-300
                    lg:hidden
                    ${sidebarOpen ? "visible opacity-100" : "invisible opacity-0"}
                `}
            />

            {/* =====================================================
                SIDEBAR
            ===================================================== */}
            <aside
                className={`
                    fixed
                    left-0
                    top-0
                    bottom-0
                    z-[900]
                    flex
                    w-[258px]
                    flex-col
                    border-r
                    border-[#F5F5DC]/15
                    bg-[#0A0A0A]
                    text-[#F5F5DC]
                    shadow-[20px_0_40px_rgba(0,0,0,0.25)]
                    transition-transform
                    duration-300
                    ease-in-out
                    lg:translate-x-0
                    ${
                        sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                {/* ================= BRAND ================= */}
                <div className="flex h-[82px] shrink-0 items-center border-b border-[#F5F5DC]/15 px-6">

                    <div className="flex items-center gap-3">

                        <div className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#FF8F00]
                            font-['Oswald']
                            text-lg
                            font-bold
                            text-[#0A0A0A]
                            shadow-[0_0_25px_rgba(255,143,0,0.18)]
                        ">
                            MG
                        </div>

                        <div>
                            <div className="
                                font-['Oswald']
                                text-[17px]
                                font-bold
                                uppercase
                                tracking-wide
                            ">
                                Metal Garage
                            </div>

                            <div className="
                                mt-0.5
                                font-mono
                                text-[9px]
                                uppercase
                                tracking-[0.14em]
                                text-[#FF8F00]
                            ">
                                Admin Console
                            </div>
                        </div>

                    </div>

                </div>


                {/* ================= SIDEBAR NAV ================= */}
                <nav className="flex-1 overflow-y-auto px-[14px] py-[18px]">

                    {/* OVERVIEW */}
                    <div className="mb-[22px]">

                        <div className="
                            px-3
                            pb-2.5
                            font-mono
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-[0.14em]
                            text-[#F5F5DC]/50
                        ">
                            Overview
                        </div>

                        <SidebarLink
                            to="/admin"
                            label="Dashboard"
                            icon={<RxDashboard />}
                            active={
                                location.pathname === "/admin" ||
                                location.pathname === "/admin/"
                            }
                            onClick={() => setSidebarOpen(false)}
                        />

                        <SidebarLink
                            to="/admin/orders"
                            label="Orders"
                            count="18"
                            icon={<RxReader />}
                            active={location.pathname.startsWith(
                                "/admin/orders"
                            )}
                            onClick={() => setSidebarOpen(false)}
                        />

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
                            onClick={() => setSidebarOpen(false)}
                        />

                    </div>


                    {/* PEOPLE */}
                    <div className="mb-[22px]">

                        <div className="
                            px-3
                            pb-2.5
                            font-mono
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-[0.14em]
                            text-[#F5F5DC]/50
                        ">
                            People
                        </div>

                        <SidebarLink
                            to="/admin/users"
                            label="Users"
                            icon={<RxPerson />}
                            active={location.pathname.startsWith(
                                "/admin/users"
                            )}
                            onClick={() => setSidebarOpen(false)}
                        />

                    </div>


                    {/* INSIGHTS */}
                    <div className="mb-[22px]">

                        <div className="
                            px-3
                            pb-2.5
                            font-mono
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-[0.14em]
                            text-[#F5F5DC]/50
                        ">
                            Insights
                        </div>

                        <SidebarStaticItem
                            label="Analytics"
                            icon={<FiBarChart2 />}
                        />

                        <SidebarStaticItem
                            label="Marketing"
                            icon={<FiTag />}
                        />

                    </div>


                    {/* SYSTEM */}
                    <div>

                        <div className="
                            px-3
                            pb-2.5
                            font-mono
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-[0.14em]
                            text-[#F5F5DC]/50
                        ">
                            System
                        </div>

                        <SidebarStaticItem
                            label="Settings"
                            icon={<FiPackage />}
                        />

                    </div>

                </nav>


                {/* ================= SIDEBAR USER ================= */}
                <div className="
                    shrink-0
                    border-t
                    border-[#F5F5DC]/15
                    p-4
                ">

                    <div className="
                        group
                        flex
                        cursor-pointer
                        items-center
                        gap-[11px]
                        rounded-lg
                        p-2
                        transition-all
                        duration-200
                        hover:bg-[#F5F5DC]/[0.06]
                    ">

                        <div className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-gradient-to-br
                            from-[#FF8F00]
                            to-[#CC7000]
                            font-['Oswald']
                            text-[13px]
                            font-bold
                            text-[#0A0A0A]
                        ">
                            RT
                        </div>

                        <div className="min-w-0 flex-1">

                            <div className="
                                truncate
                                text-[13px]
                                font-semibold
                                text-[#F5F5DC]
                            ">
                                Rae Torres
                            </div>

                            <div className="
                                text-[11px]
                                text-[#F5F5DC]/50
                            ">
                                Store Admin
                            </div>

                        </div>

                        <RxChevronRight className="
                            h-4
                            w-4
                            text-[#F5F5DC]/50
                            transition-transform
                            duration-200
                            group-hover:translate-x-1
                        " />

                    </div>

                </div>

            </aside>


            {/* =====================================================
                MAIN
            ===================================================== */}
            <div className="min-h-screen lg:ml-[258px]">

                {/* ================= TOPBAR ================= */}
                <header className="
                    sticky
                    top-0
                    z-[800]
                    flex
                    min-h-[82px]
                    items-center
                    justify-between
                    gap-6
                    border-b
                    border-[#0A0A0A]/[0.14]
                    bg-[#F5F5DC]
                    px-4
                    py-[18px]
                    sm:px-6
                    lg:px-8
                ">

                    {/* LEFT */}
                    <div className="flex items-center gap-4">

                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="
                                flex
                                h-[38px]
                                w-[38px]
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-[#0A0A0A]/[0.14]
                                text-[#0A0A0A]
                                transition-all
                                duration-200
                                hover:border-[#0A0A0A]
                                hover:bg-[#ECE8D6]
                                lg:hidden
                            "
                        >
                            <RxHamburgerMenu className="text-[18px]" />
                        </button>

                        <div>

                            <div className="
                                mb-1
                                font-mono
                                text-[10px]
                                uppercase
                                tracking-[0.08em]
                                text-[#0A0A0A]/45
                            ">
                                Garage / Overview
                            </div>

                            <h1 className="
                                font-['Oswald']
                                text-[22px]
                                font-bold
                                uppercase
                                leading-none
                                tracking-[0.01em]
                            ">
                                Dashboard
                            </h1>

                        </div>

                    </div>


                    {/* SEARCH */}
                    <div className="
                        hidden
                        w-[320px]
                        max-w-full
                        items-center
                        gap-2.5
                        rounded-lg
                        border
                        border-[#0A0A0A]/[0.14]
                        bg-[#ECE8D6]
                        px-3.5
                        py-2.5
                        xl:flex
                    ">

                        <RxMagnifyingGlass className="
                            shrink-0
                            text-[16px]
                            text-[#0A0A0A]/40
                        " />

                        <input
                            type="text"
                            placeholder="Search orders, products, customers..."
                            className="
                                w-full
                                bg-transparent
                                text-[13px]
                                text-[#0A0A0A]
                                outline-none
                                placeholder:text-[#0A0A0A]/40
                            "
                        />

                        <span className="
                            rounded
                            border
                            border-[#0A0A0A]/[0.14]
                            px-1.5
                            py-0.5
                            font-mono
                            text-[10px]
                            text-[#0A0A0A]/35
                        ">
                            ⌘K
                        </span>

                    </div>


                    {/* RIGHT */}
                    <div className="flex items-center gap-3.5">

                        <button
                            type="button"
                            aria-label="Notifications"
                            className="
                                relative
                                flex
                                h-[38px]
                                w-[38px]
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-[#0A0A0A]/[0.14]
                                text-[#0A0A0A]
                                transition-all
                                duration-200
                                hover:border-[#0A0A0A]
                                hover:bg-[#ECE8D6]
                            "
                        >
                            <RxBell className="text-[17px]" />

                            <span className="
                                absolute
                                right-[7px]
                                top-[7px]
                                h-[7px]
                                w-[7px]
                                rounded-full
                                border-[1.5px]
                                border-[#F5F5DC]
                                bg-[#FF3B00]
                            " />

                        </button>


                        <button
                            type="button"
                            aria-label="Help"
                            className="
                                hidden
                                h-[38px]
                                w-[38px]
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-[#0A0A0A]/[0.14]
                                text-[#0A0A0A]
                                transition-all
                                duration-200
                                hover:border-[#0A0A0A]
                                hover:bg-[#ECE8D6]
                                sm:flex
                            "
                        >
                            <RxQuestionMarkCircled className="text-[17px]" />
                        </button>


                        <div className="
                            flex
                            items-center
                            gap-2.5
                            border-l
                            border-[#0A0A0A]/[0.14]
                            pl-3.5
                        ">

                            <div className="
                                flex
                                h-[34px]
                                w-[34px]
                                items-center
                                justify-center
                                rounded-full
                                bg-gradient-to-br
                                from-[#FF8F00]
                                to-[#CC7000]
                                font-['Oswald']
                                text-[12px]
                                font-bold
                                text-[#0A0A0A]
                            ">
                                RT
                            </div>

                            <FiChevronDown className="
                                hidden
                                text-[14px]
                                text-[#0A0A0A]/40
                                sm:block
                            " />

                        </div>

                    </div>

                </header>


                {/* =================================================
                    ROUTER CONTENT
                ================================================= */}
                <div className="min-h-[calc(100vh-82px)] bg-[#ECE8D6]">

                    <Routes>

                        {/* =================================================
                            DASHBOARD
                        ================================================= */}
                        <Route
                            path="/"
                            element={
                                <DashboardContent />
                            }
                        />


                        {/* =================================================
                            USERS
                        ================================================= */}
                        <Route
                            path="users"
                            element={
                                <SimplePage title="Users" />
                            }
                        />


                        {/* =================================================
                            PRODUCTS
                        ================================================= */}
                        <Route
                            path="products"
                            element={
                                <AdminProductPage />
                            }
                        />


                        {/* =================================================
                            ORDERS
                        ================================================= */}
                        <Route
                            path="orders"
                            element={
                                <SimplePage title="Orders" />
                            }
                        />


                        {/* =================================================
                            ADD PRODUCT
                        ================================================= */}
                        <Route
                            path="add-product"
                            element={
                                <AdminAddProduct />
                            }
                        />


                        {/* =================================================
                            UPDATE PRODUCT
                        ================================================= */}
                        <Route
                            path="update-product"
                            element={
                                <AdminUpdateProductPage />
                            }
                        />


                        {/* =================================================
                            404
                        ================================================= */}
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

function DashboardContent() {

    return (
        <div className="
            px-4
            pb-[60px]
            pt-5
            sm:px-6
            sm:pt-7
            lg:px-8
        ">

            {/* =================================================
                CONTENT HEADER
            ================================================= */}
            <div className="
                mb-[26px]
                flex
                flex-wrap
                items-center
                justify-between
                gap-3.5
            ">

                <div className="
                    text-[13px]
                    text-[#0A0A0A]/50
                ">
                    Welcome back — here's what's happening across
                    the garage today,{" "}
                    <span className="
                        font-mono
                        text-[#0A0A0A]
                    ">
                        Aug 19
                    </span>
                    .
                </div>


                <div className="flex gap-2.5">

                    <button
                        type="button"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-[7px]
                            border
                            border-[#0A0A0A]/[0.14]
                            px-4
                            py-2.5
                            text-[12px]
                            font-semibold
                            uppercase
                            tracking-[0.06em]
                            transition-all
                            duration-200
                            hover:border-[#0A0A0A]
                            hover:bg-[#ECE8D6]
                        "
                    >
                        <RxDownload className="text-[14px]" />
                        Export
                    </button>


                    <Link
                        to="/admin/add-product"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-[7px]
                            bg-[#0A0A0A]
                            px-4
                            py-2.5
                            text-[12px]
                            font-semibold
                            uppercase
                            tracking-[0.06em]
                            text-[#F5F5DC]
                            transition-all
                            duration-200
                            hover:bg-[#FF8F00]
                            hover:text-[#0A0A0A]
                        "
                    >
                        <RxPlus className="text-[14px]" />
                        Add Product
                    </Link>

                </div>

            </div>


            {/* =================================================
                STAT CARDS
            ================================================= */}
            <div className="
                mb-[26px]
                grid
                grid-cols-1
                gap-[18px]
                sm:grid-cols-2
                xl:grid-cols-4
            ">

                <StatCard
                    icon={<FiDollarSign />}
                    iconType="orange"
                    trend="12.4%"
                    label="Revenue this month"
                    value="$48,260"
                    sub="vs $42,930 last month"
                />

                <StatCard
                    icon={<FiShoppingCart />}
                    iconType="black"
                    trend="8.1%"
                    label="Orders"
                    value="312"
                    sub="18 awaiting fulfillment"
                />

                <StatCard
                    icon={<FiUsers />}
                    iconType="green"
                    trend="4.6%"
                    label="New customers"
                    value="86"
                    sub="1,204 total collectors"
                />

                <StatCard
                    icon={<FiAlertTriangle />}
                    iconType="red"
                    trend="3 items"
                    trendDown
                    label="Low stock alerts"
                    value="6"
                    sub="Reorder recommended"
                />

            </div>


            {/* =================================================
                REVENUE + TOP PRODUCTS
            ================================================= */}
            <div className="
                mb-[18px]
                grid
                grid-cols-1
                gap-[18px]
                xl:grid-cols-[1.7fr_1fr]
            ">

                {/* REVENUE PANEL */}
                <div className="
                    rounded-xl
                    border
                    border-[#0A0A0A]/[0.14]
                    bg-[#F5F5DC]
                    p-5
                    sm:p-6
                ">

                    <div className="
                        mb-[22px]
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-3
                    ">

                        <div>

                            <h3 className="
                                font-['Work_Sans']
                                text-[15px]
                                font-semibold
                            ">
                                Revenue Overview
                            </h3>

                            <div className="
                                mt-1
                                text-[12px]
                                text-[#0A0A0A]/45
                            ">
                                Online store vs in-person pickup, last 7 days
                            </div>

                        </div>


                        <div className="
                            flex
                            gap-1
                            rounded-[7px]
                            bg-[#ECE8D6]
                            p-[3px]
                        ">

                            <button
                                type="button"
                                className="
                                    rounded-[5px]
                                    bg-[#0A0A0A]
                                    px-3
                                    py-1.5
                                    font-mono
                                    text-[11px]
                                    text-[#F5F5DC]
                                "
                            >
                                Month
                            </button>

                            <button
                                type="button"
                                className="
                                    rounded-[5px]
                                    px-3
                                    py-1.5
                                    font-mono
                                    text-[11px]
                                    text-[#0A0A0A]/50
                                    transition-colors
                                    hover:bg-[#F5F5DC]
                                "
                            >
                                Week
                            </button>

                            <button
                                type="button"
                                className="
                                    rounded-[5px]
                                    px-3
                                    py-1.5
                                    font-mono
                                    text-[11px]
                                    text-[#0A0A0A]/50
                                    transition-colors
                                    hover:bg-[#F5F5DC]
                                "
                            >
                                Day
                            </button>

                        </div>

                    </div>


                    {/* BAR CHART */}
                    <RevenueChart />


                    {/* LEGEND */}
                    <div className="
                        mt-[18px]
                        flex
                        gap-5
                        border-t
                        border-[#0A0A0A]/[0.14]
                        pt-[18px]
                    ">

                        <div className="
                            flex
                            items-center
                            gap-2
                            text-[12px]
                            text-[#0A0A0A]/60
                        ">
                            <span className="
                                h-[9px]
                                w-[9px]
                                rounded-[2px]
                                bg-[#0A0A0A]
                            " />
                            Online store
                        </div>

                        <div className="
                            flex
                            items-center
                            gap-2
                            text-[12px]
                            text-[#0A0A0A]/60
                        ">
                            <span className="
                                h-[9px]
                                w-[9px]
                                rounded-[2px]
                                bg-[#FF8F00]
                            " />
                            In-person pickup
                        </div>

                    </div>

                </div>


                {/* TOP PRODUCTS */}
                <div className="
                    rounded-xl
                    border
                    border-[#0A0A0A]/[0.14]
                    bg-[#F5F5DC]
                    p-5
                    sm:p-6
                ">

                    <div className="mb-[22px]">

                        <h3 className="
                            font-['Work_Sans']
                            text-[15px]
                            font-semibold
                        ">
                            Top Products
                        </h3>

                        <div className="
                            mt-1
                            text-[12px]
                            text-[#0A0A0A]/45
                        ">
                            By units sold, this week
                        </div>

                    </div>


                    <div className="flex flex-col gap-4">

                        <TopProduct
                            rank="01"
                            name="Nissan Skyline GT-R R34"
                            series="JDM Legends"
                            amount="$2,048"
                            units="32 units"
                            variant="c"
                        />

                        <TopProduct
                            rank="02"
                            name="Porsche 911 GT3 RS"
                            series="Supercar Series"
                            amount="$1,612"
                            units="31 units"
                            variant="e"
                        />

                        <TopProduct
                            rank="03"
                            name="Toyota Supra MK4"
                            series="Street Series"
                            amount="$988"
                            units="26 units"
                            variant="a"
                        />

                        <TopProduct
                            rank="04"
                            name="Lamborghini Countach"
                            series="Heritage Series"
                            amount="$864"
                            units="9 units"
                            variant="f"
                        />

                        <TopProduct
                            rank="05"
                            name="Ford Mustang Boss 429"
                            series="Classic Series"
                            amount="$697"
                            units="17 units"
                            variant="b"
                        />

                    </div>

                </div>

            </div>


            {/* =================================================
                ORDERS + INVENTORY
            ================================================= */}
            <div className="
                grid
                grid-cols-1
                gap-[18px]
                xl:grid-cols-[1.7fr_1fr]
            ">

                {/* RECENT ORDERS */}
                <div className="
                    min-w-0
                    rounded-xl
                    border
                    border-[#0A0A0A]/[0.14]
                    bg-[#F5F5DC]
                    p-5
                    sm:p-6
                ">

                    <div className="
                        mb-[22px]
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-3
                    ">

                        <div>

                            <h3 className="
                                font-['Work_Sans']
                                text-[15px]
                                font-semibold
                            ">
                                Recent Orders
                            </h3>

                            <div className="
                                mt-1
                                text-[12px]
                                text-[#0A0A0A]/45
                            ">
                                Latest activity across the store
                            </div>

                        </div>

                        <button
                            type="button"
                            className="
                                flex
                                items-center
                                gap-1.5
                                text-[12px]
                                font-semibold
                                text-[#CC7000]
                                transition-colors
                                hover:text-[#FF8F00]
                            "
                        >
                            View all
                            <RxChevronRight className="text-[13px]" />
                        </button>

                    </div>


                    {/* RESPONSIVE TABLE */}
                    <div className="overflow-x-auto">

                        <table className="w-full border-collapse">

                            <thead>

                                <tr>

                                    <th className="table-head">
                                        Order
                                    </th>

                                    <th className="table-head">
                                        Customer
                                    </th>

                                    <th className="table-head">
                                        Item
                                    </th>

                                    <th className="table-head">
                                        Status
                                    </th>

                                    <th className="table-head">
                                        Total
                                    </th>

                                    <th className="table-head" />

                                </tr>

                            </thead>


                            <tbody>

                                <OrderRow
                                    order="#MG-3021"
                                    initials="JB"
                                    name="Jared Blake"
                                    email="jared.b@mail.com"
                                    item="Skyline GT-R R34"
                                    status="Paid"
                                    type="paid"
                                    amount="$64.00"
                                />

                                <OrderRow
                                    order="#MG-3020"
                                    initials="SM"
                                    name="Sofia Martin"
                                    email="sofia.m@mail.com"
                                    item="Porsche 911 GT3 RS"
                                    status="Pending"
                                    type="pending"
                                    amount="$52.00"
                                />

                                <OrderRow
                                    order="#MG-3019"
                                    initials="TK"
                                    name="Theo Kim"
                                    email="theo.kim@mail.com"
                                    item="Lamborghini Countach"
                                    status="Shipped"
                                    type="shipped"
                                    amount="$96.00"
                                />

                                <OrderRow
                                    order="#MG-3018"
                                    initials="AN"
                                    name="Amara Ngo"
                                    email="amara.n@mail.com"
                                    item="Ford Mustang Boss 429"
                                    status="Cancelled"
                                    type="cancelled"
                                    amount="$41.00"
                                />

                                <OrderRow
                                    order="#MG-3017"
                                    initials="DP"
                                    name="Diego Prieto"
                                    email="diego.p@mail.com"
                                    item="Mazda RX-7 FD"
                                    status="Paid"
                                    type="paid"
                                    amount="$56.00"
                                />

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* LOW STOCK */}
                <div className="
                    rounded-xl
                    border
                    border-[#0A0A0A]/[0.14]
                    bg-[#F5F5DC]
                    p-5
                    sm:p-6
                ">

                    <div className="mb-[22px]">

                        <h3 className="
                            font-['Work_Sans']
                            text-[15px]
                            font-semibold
                        ">
                            Low Stock
                        </h3>

                        <div className="
                            mt-1
                            text-[12px]
                            text-[#0A0A0A]/45
                        ">
                            Restock before you sell out
                        </div>

                    </div>


                    <StockItem
                        name="Ferrari 288 GTO"
                        series="Heritage Series — Ltd. 75"
                        quantity="3 left"
                        percentage="8%"
                        type="crit"
                    />

                    <StockItem
                        name="Lamborghini Countach"
                        series="Heritage Series — Ltd. 120"
                        quantity="9 left"
                        percentage="15%"
                        type="crit"
                    />

                    <StockItem
                        name="Skyline GT-R R34"
                        series="JDM Legends — Ltd. 500"
                        quantity="42 left"
                        percentage="42%"
                        type="low"
                    />

                    <StockItem
                        name="Mazda RX-7 FD"
                        series="JDM Legends — Ltd. 240"
                        quantity="58 left"
                        percentage="58%"
                        type="low"
                    />

                    <StockItem
                        name="Toyota Supra MK4"
                        series="Street Series — Std."
                        quantity="146 left"
                        percentage="82%"
                        type="ok"
                        last
                    />

                </div>

            </div>


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}
            <div className="
                mt-[18px]
                grid
                grid-cols-1
                gap-3.5
                sm:grid-cols-2
                xl:grid-cols-4
            ">

                <QuickAction
                    to="/admin/add-product"
                    icon={<RxPlus />}
                    title="Add Product"
                    description="List a new casting to the shop"
                />

                <QuickAction
                    icon={<FiPackage />}
                    title="Restock Inventory"
                    description="Update counts for low-stock items"
                />

                <QuickAction
                    icon={<FiTag />}
                    title="Create Promotion"
                    description="Launch a discount or bundle"
                />

                <QuickAction
                    icon={<FiBarChart2 />}
                    title="View Reports"
                    description="Full sales & traffic analytics"
                />

            </div>

        </div>
    );
}


/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
    icon,
    iconType,
    trend,
    trendDown = false,
    label,
    value,
    sub,
}) {

    const iconClasses = {
        orange: "bg-[#FF8F00]/[0.12] text-[#CC7000]",
        black: "bg-[#0A0A0A]/[0.06] text-[#0A0A0A]",
        green: "bg-[#2F7A45]/[0.12] text-[#2F7A45]",
        red: "bg-[#FF3B00]/[0.10] text-[#FF3B00]",
    };

    return (
        <div className="
            group
            relative
            overflow-hidden
            rounded-xl
            border
            border-[#0A0A0A]/[0.14]
            bg-[#F5F5DC]
            p-5
            transition-all
            duration-200
            hover:-translate-y-[3px]
            hover:shadow-[0_16px_30px_rgba(10,10,10,0.08)]
        ">

            <div className="
                mb-3.5
                flex
                items-start
                justify-between
            ">

                <div className={`
                    flex
                    h-[38px]
                    w-[38px]
                    items-center
                    justify-center
                    rounded-[9px]
                    ${iconClasses[iconType]}
                `}>
                    {icon}
                </div>


                <div className={`
                    flex
                    items-center
                    gap-1
                    rounded-full
                    px-2
                    py-1
                    font-mono
                    text-[10px]
                    font-semibold
                    ${
                        trendDown
                            ? "bg-[#FF3B00]/10 text-[#FF3B00]"
                            : "bg-[#2F7A45]/10 text-[#2F7A45]"
                    }
                `}>

                    {!trendDown && (
                        <FiTrendingUp className="text-[11px]" />
                    )}

                    {trend}

                </div>

            </div>


            <div className="
                mb-1.5
                text-[12px]
                text-[#0A0A0A]/50
            ">
                {label}
            </div>

            <div className="
                font-mono
                text-[25px]
                font-semibold
                leading-none
            ">
                {value}
            </div>

            <div className="
                mt-1.5
                text-[11px]
                text-[#0A0A0A]/40
            ">
                {sub}
            </div>

        </div>
    );
}


/* ============================================================
   REVENUE CHART
============================================================ */

function RevenueChart() {

    const bars = [
        {
            day: "MON",
            total: 118,
            black: 84,
            orange: 34,
            value: "$4.1k",
        },
        {
            day: "TUE",
            total: 96,
            black: 74,
            orange: 22,
            value: "$3.3k",
        },
        {
            day: "WED",
            total: 150,
            black: 106,
            orange: 44,
            value: "$5.2k",
        },
        {
            day: "THU",
            total: 130,
            black: 100,
            orange: 30,
            value: "$4.6k",
        },
        {
            day: "FRI",
            total: 178,
            black: 120,
            orange: 58,
            value: "$6.4k",
        },
        {
            day: "SAT",
            total: 200,
            black: 130,
            orange: 70,
            value: "$7.1k",
        },
        {
            day: "SUN",
            total: 142,
            black: 102,
            orange: 40,
            value: "$5.0k",
        },
    ];

    return (
        <div className="
            flex
            h-[200px]
            items-end
            gap-2.5
            overflow-hidden
            px-1
            pt-2.5
            sm:gap-4
        ">

            {bars.map((bar) => (

                <div
                    key={bar.day}
                    className="
                        group
                        relative
                        flex
                        h-full
                        flex-1
                        flex-col
                        items-center
                        justify-end
                        gap-2.5
                    "
                >

                    <div
                        className="
                            relative
                            flex
                            w-full
                            max-w-[38px]
                            flex-col-reverse
                            overflow-hidden
                            rounded-t-[5px]
                            rounded-b-[3px]
                            transition-all
                            duration-200
                            group-hover:brightness-110
                        "
                        style={{
                            height: `${bar.total}px`,
                        }}
                    >

                        <div
                            className="w-full bg-[#0A0A0A]"
                            style={{
                                height: `${bar.black}px`,
                            }}
                        />

                        <div
                            className="w-full bg-[#FF8F00]"
                            style={{
                                height: `${bar.orange}px`,
                            }}
                        />

                        <div className="
                            pointer-events-none
                            absolute
                            -top-5
                            left-1/2
                            -translate-x-1/2
                            whitespace-nowrap
                            font-mono
                            text-[10px]
                            text-[#0A0A0A]/40
                            opacity-0
                            transition-opacity
                            duration-200
                            group-hover:opacity-100
                        ">
                            {bar.value}
                        </div>

                    </div>


                    <div className="
                        font-mono
                        text-[10px]
                        text-[#0A0A0A]/50
                    ">
                        {bar.day}
                    </div>

                </div>

            ))}

        </div>
    );
}


/* ============================================================
   TOP PRODUCT
============================================================ */

function TopProduct({
    rank,
    name,
    series,
    amount,
    units,
    variant,
}) {

    const variantClasses = {
        a: "bg-[#0A0A0A]",
        b: "bg-[#161412]",
        c: "bg-[#0A0A0A]",
        e: "bg-[#161412]",
        f: "bg-[#0A0A0A]",
    };

    return (
        <div className="
            flex
            items-center
            gap-3
        ">

            <span className="
                w-4
                shrink-0
                font-mono
                text-[11px]
                text-[#0A0A0A]/35
            ">
                {rank}
            </span>


            <div className={`
                relative
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-lg
                ${variantClasses[variant]}
            `}>

                <div className="
                    relative
                    h-[14px]
                    w-[38px]
                    rounded-[8px]
                    border
                    border-[#F5F5DC]/70
                ">

                    <span className="
                        absolute
                        -bottom-[4px]
                        left-[4px]
                        h-2
                        w-2
                        rounded-full
                        bg-[#FF8F00]
                    " />

                    <span className="
                        absolute
                        -bottom-[4px]
                        right-[4px]
                        h-2
                        w-2
                        rounded-full
                        bg-[#FF8F00]
                    " />

                </div>

            </div>


            <div className="min-w-0 flex-1">

                <div className="
                    truncate
                    text-[13px]
                    font-semibold
                ">
                    {name}
                </div>

                <div className="
                    text-[11px]
                    text-[#0A0A0A]/45
                ">
                    {series}
                </div>

            </div>


            <div className="
                shrink-0
                text-right
            ">

                <div className="
                    font-mono
                    text-[13px]
                    font-semibold
                ">
                    {amount}
                </div>

                <div className="
                    text-[10.5px]
                    text-[#0A0A0A]/40
                ">
                    {units}
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
        paid: "bg-[#2F7A45]/10 text-[#2F7A45] before:bg-[#2F7A45]",
        pending: "bg-[#FF8F00]/[0.12] text-[#CC7000] before:bg-[#FF8F00]",
        shipped: "bg-[#0A0A0A]/[0.06] text-[#0A0A0A] before:bg-[#0A0A0A]",
        cancelled: "bg-[#FF3B00]/[0.08] text-[#FF3B00] before:bg-[#FF3B00]",
    };

    return (
        <tr className="
            group
            transition-colors
            duration-150
            hover:bg-[#ECE8D6]
        ">

            <td className="
                whitespace-nowrap
                border-b
                border-[#0A0A0A]/[0.07]
                px-2.5
                py-3.5
                font-mono
                text-[12.5px]
                font-semibold
            ">
                {order}
            </td>


            <td className="
                border-b
                border-[#0A0A0A]/[0.07]
                px-2.5
                py-3.5
            ">

                <div className="
                    flex
                    min-w-[150px]
                    items-center
                    gap-2.5
                ">

                    <div className="
                        flex
                        h-[30px]
                        w-[30px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#DFDABF]
                        font-['Oswald']
                        text-[11px]
                        font-bold
                    ">
                        {initials}
                    </div>

                    <div className="min-w-0">

                        <div className="
                            truncate
                            text-[12.5px]
                            font-medium
                        ">
                            {name}
                        </div>

                        <div className="
                            truncate
                            text-[11px]
                            text-[#0A0A0A]/40
                        ">
                            {email}
                        </div>

                    </div>

                </div>

            </td>


            <td className="
                whitespace-nowrap
                border-b
                border-[#0A0A0A]/[0.07]
                px-2.5
                py-3.5
                text-[13px]
            ">
                {item}
            </td>


            <td className="
                border-b
                border-[#0A0A0A]/[0.07]
                px-2.5
                py-3.5
            ">

                <span className={`
                    relative
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    px-2.5
                    py-[5px]
                    font-mono
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.05em]
                    before:h-1.5
                    before:w-1.5
                    before:rounded-full
                    ${statusClasses[type]}
                `}>
                    {status}
                </span>

            </td>


            <td className="
                whitespace-nowrap
                border-b
                border-[#0A0A0A]/[0.07]
                px-2.5
                py-3.5
                font-mono
                font-semibold
            ">
                {amount}
            </td>


            <td className="
                border-b
                border-[#0A0A0A]/[0.07]
                px-2.5
                py-3.5
            ">

                <button
                    type="button"
                    className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-md
                        text-[#0A0A0A]/40
                        transition-all
                        duration-150
                        hover:bg-[#DFDABF]
                        hover:text-[#0A0A0A]
                    "
                >
                    <RxDotsHorizontal className="text-[15px]" />
                </button>

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
        <div className={`
            ${last ? "mb-0" : "mb-[18px]"}
        `}>

            <div className="
                mb-2
                flex
                items-center
                justify-between
                gap-2.5
            ">

                <div className="
                    min-w-0
                    text-[13px]
                    font-semibold
                ">

                    <div className="truncate">
                        {name}
                    </div>

                    <span className="
                        mt-0.5
                        block
                        text-[10.5px]
                        font-normal
                        text-[#0A0A0A]/40
                    ">
                        {series}
                    </span>

                </div>


                <div className="
                    shrink-0
                    font-mono
                    text-[12px]
                    font-semibold
                ">
                    {quantity}
                </div>

            </div>


            <div className="
                h-1.5
                overflow-hidden
                rounded-full
                bg-[#ECE8D6]
            ">

                <div
                    className={`
                        h-full
                        rounded-full
                        transition-all
                        duration-500
                        ${fillClasses[type]}
                    `}
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

    const content = (
        <>
            <div className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-[9px]
                bg-[#0A0A0A]
                text-[#FF8F00]
                transition-all
                duration-200
                group-hover:bg-[#FF8F00]
                group-hover:text-[#0A0A0A]
            ">
                {icon}
            </div>

            <div className="
                text-[13.5px]
                font-semibold
            ">
                {title}
            </div>

            <div className="
                text-[11.5px]
                text-[#0A0A0A]/45
            ">
                {description}
            </div>
        </>
    );

    const className = `
        group
        flex
        flex-col
        gap-3
        rounded-xl
        border
        border-[#0A0A0A]/[0.14]
        bg-[#F5F5DC]
        p-5
        transition-all
        duration-200
        hover:-translate-y-[3px]
        hover:border-[#0A0A0A]
        hover:shadow-[0_14px_26px_rgba(10,10,10,0.08)]
    `;

    if (to) {
        return (
            <Link
                to={to}
                className={className}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            type="button"
            className={`${className} text-left`}
        >
            {content}
        </button>
    );
}


/* ============================================================
   SIDEBAR LINK
============================================================ */

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
            className={`
                group
                relative
                mb-1
                flex
                min-h-[44px]
                w-full
                items-center
                gap-3
                rounded-[6px]
                border-l-2
                px-3
                py-[11px]
                text-[13.5px]
                font-medium
                transition-all
                duration-[180ms]
                ease-in-out

                ${
                    active
                        ? `
                            border-l-[#FF8F00]
                            bg-[#FF8F00]/10
                            text-[#F5F5DC]
                        `
                        : `
                            border-l-transparent
                            text-[#F5F5DC]/70
                            hover:bg-[#F5F5DC]/[0.06]
                            hover:text-[#F5F5DC]
                        `
                }
            `}
        >

            <span className={`
                flex
                h-[18px]
                w-[18px]
                shrink-0
                items-center
                justify-center
                transition-colors
                duration-200
                ${
                    active
                        ? "text-[#FF8F00]"
                        : "text-[#F5F5DC]/85 group-hover:text-[#F5F5DC]"
                }
            `}>
                {icon}
            </span>


            <span className="flex-1">
                {label}
            </span>


            {count && (
                <span className={`
                    rounded-full
                    px-[7px]
                    py-0.5
                    font-mono
                    text-[10.5px]
                    ${
                        active
                            ? "bg-[#FF8F00] font-semibold text-[#0A0A0A]"
                            : "bg-[#F5F5DC]/10 text-[#F5F5DC]/70"
                    }
                `}>
                    {count}
                </span>
            )}

        </Link>
    );
}


/* ============================================================
   SIDEBAR STATIC ITEM
============================================================ */

function SidebarStaticItem({
    label,
    icon,
}) {

    return (
        <div className="
            group
            mb-1
            flex
            min-h-[44px]
            w-full
            cursor-default
            items-center
            gap-3
            rounded-[6px]
            border-l-2
            border-l-transparent
            px-3
            py-[11px]
            text-[13.5px]
            font-medium
            text-[#F5F5DC]/70
            transition-all
            duration-[180ms]
            hover:bg-[#F5F5DC]/[0.06]
            hover:text-[#F5F5DC]
        ">

            <span className="
                flex
                h-[18px]
                w-[18px]
                shrink-0
                items-center
                justify-center
                text-[#F5F5DC]/85
                transition-colors
                duration-200
                group-hover:text-[#F5F5DC]
            ">
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
        <div className="
            flex
            min-h-[calc(100vh-82px)]
            items-start
            p-5
            sm:p-8
        ">

            <div className="
                rounded-xl
                border
                border-[#0A0A0A]/[0.14]
                bg-[#F5F5DC]
                p-6
            ">

                <h1 className="
                    font-['Oswald']
                    text-2xl
                    font-bold
                    uppercase
                ">
                    {title}
                </h1>

            </div>

        </div>
    );
}