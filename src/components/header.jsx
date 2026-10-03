import { NavLink, useNavigate } from "react-router-dom";
import {
    Search,
    ShoppingCart,
    Package,
    Settings,
    LogOut,
    ChevronDown,
    UserCircle,
    LayoutDashboard,
    Menu,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Header() {
    const navigate = useNavigate();

    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const profileRef = useRef(null);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Shop", path: "/products" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
        { name: "Orders", path: "/orders" },
        { name: "Cart", path: "/cart" },
    ];

    // =========================================================
    // CART COUNT
    // =========================================================

    const updateCartCount = () => {
        try {
            const storedCart = localStorage.getItem("cart");

            if (!storedCart) {
                setCartCount(0);
                return;
            }

            const cart = JSON.parse(storedCart);

            if (!Array.isArray(cart)) {
                setCartCount(0);
                return;
            }

            const total = cart.reduce((sum, item) => {
                const quantity =
                    Number(
                        item?.cartQuantity ??
                            item?.quantity ??
                            1
                    ) || 1;

                return sum + quantity;
            }, 0);

            setCartCount(total);
        } catch (error) {
            console.error("Unable to read cart:", error);
            setCartCount(0);
        }
    };

    // =========================================================
    // GET STORED USER
    // =========================================================

    const getStoredUser = () => {
        try {
            const storedUser = localStorage.getItem("user");

            if (!storedUser) {
                setUser(null);
                return;
            }

            const parsedUser = JSON.parse(storedUser);

            if (
                parsedUser &&
                typeof parsedUser === "object"
            ) {
                setUser(parsedUser);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Unable to read stored user:", error);
            setUser(null);
        }
    };

    // =========================================================
    // USER NAME
    // =========================================================

    const getUserName = () => {
        if (!user) {
            return "Account";
        }

        const firstName =
            typeof user.firstName === "string"
                ? user.firstName.trim()
                : "";

        const lastName =
            typeof user.lastName === "string"
                ? user.lastName.trim()
                : "";

        const fullName =
            `${firstName} ${lastName}`.trim();

        if (fullName) {
            return fullName;
        }

        if (
            typeof user.name === "string" &&
            user.name.trim()
        ) {
            return user.name.trim();
        }

        if (
            typeof user.username === "string" &&
            user.username.trim()
        ) {
            return user.username.trim();
        }

        if (
            typeof user.email === "string" &&
            user.email.trim()
        ) {
            return user.email.split("@")[0];
        }

        return "Collector";
    };

    // =========================================================
    // USER INITIALS
    // =========================================================

    const getUserInitials = () => {
        const name = getUserName();

        if (!name || name === "Account") {
            return "MG";
        }

        const parts = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (parts.length >= 2) {
            return (
                parts[0].charAt(0) +
                parts[parts.length - 1].charAt(0)
            ).toUpperCase();
        }

        return name
            .substring(0, 2)
            .toUpperCase();
    };

    // =========================================================
    // USER IMAGE
    // =========================================================

    const getUserImage = () => {
        if (!user) {
            return null;
        }

        return (
            user.profileImage ||
            user.profilePicture ||
            user.avatar ||
            user.image ||
            user.photoURL ||
            user.picture ||
            null
        );
    };

    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("currentUser");

        setUser(null);
        setProfileOpen(false);
        setMobileMenuOpen(false);

        window.dispatchEvent(
            new CustomEvent("authUpdated", {
                detail: null,
            })
        );

        navigate("/", {
            replace: true,
        });
    };

    // =========================================================
    // AUTH EVENT
    // =========================================================

    useEffect(() => {
        getStoredUser();

        const handleAuthUpdate = (event) => {
            if (event?.detail) {
                setUser(event.detail);
            } else {
                getStoredUser();
            }

            setProfileOpen(false);
        };

        window.addEventListener(
            "authUpdated",
            handleAuthUpdate
        );

        return () => {
            window.removeEventListener(
                "authUpdated",
                handleAuthUpdate
            );
        };
    }, []);

    // =========================================================
    // CART EVENTS
    // =========================================================

    useEffect(() => {
        updateCartCount();

        const handleCartUpdate = () => {
            updateCartCount();
        };

        window.addEventListener(
            "cartUpdated",
            handleCartUpdate
        );

        window.addEventListener(
            "storage",
            handleCartUpdate
        );

        return () => {
            window.removeEventListener(
                "cartUpdated",
                handleCartUpdate
            );

            window.removeEventListener(
                "storage",
                handleCartUpdate
            );
        };
    }, []);

    // =========================================================
    // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
    // =========================================================

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(
                    event.target
                )
            ) {
                setProfileOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    // =========================================================
    // CLOSE MOBILE MENU ON ROUTE / RESIZE
    // =========================================================

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 981) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener(
            "resize",
            handleResize
        );

        return () => {
            window.removeEventListener(
                "resize",
                handleResize
            );
        };
    }, []);

    const userImage = getUserImage();
    const userName = getUserName();

    return (
        <>
            <header className="fixed left-0 right-0 top-0 z-[1000] w-full border-b border-[rgba(245,245,220,0.14)] bg-[#0A0A0A]">

                <nav className="mx-auto flex h-[78px] w-full max-w-[1320px] items-center justify-between px-5 sm:px-10">

                    {/* =================================================
                        LOGO
                    ================================================== */}

                    <NavLink
                        to="/"
                        onClick={() => {
                            setMobileMenuOpen(false);
                            setProfileOpen(false);
                        }}
                        className="flex shrink-0 items-center"
                    >
                        <img
                            src="/logo.png"
                            alt="Metal Garage"
                            className="block h-[36px] w-auto sm:h-[46px]"
                        />
                    </NavLink>

                    {/* =================================================
                        DESKTOP NAVIGATION
                    ================================================== */}

                    <div className="hidden lg:flex items-center">
                        <ul className="m-0 flex list-none items-center gap-[30px] p-0">

                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <NavLink
                                        to={link.path}
                                        className="group relative block px-0 py-[6px]"
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <span
                                                    className={`
                                                        font-['Work_Sans',sans-serif]
                                                        text-[13px]
                                                        font-medium
                                                        uppercase
                                                        tracking-[0.09em]
                                                        transition-colors
                                                        duration-200
                                                        ${
                                                            isActive
                                                                ? "text-[#F5F5DC]"
                                                                : "text-[rgba(245,245,220,0.7)] group-hover:text-[#F5F5DC]"
                                                        }
                                                    `}
                                                >
                                                    {link.name}
                                                </span>

                                                <span
                                                    className={`
                                                        absolute
                                                        bottom-0
                                                        left-0
                                                        h-[2px]
                                                        bg-[#FF8F00]
                                                        transition-all
                                                        duration-300
                                                        ease-out
                                                        ${
                                                            isActive
                                                                ? "w-full"
                                                                : "w-0 group-hover:w-full"
                                                        }
                                                    `}
                                                />
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            ))}

                        </ul>
                    </div>

                    {/* =================================================
                        RIGHT SIDE
                    ================================================== */}

                    <div className="flex shrink-0 items-center gap-[17px] sm:gap-[21px]">

                        {/* =================================================
                            SEARCH
                        ================================================== */}

                        <button
                            type="button"
                            aria-label="Search"
                            onClick={() =>
                                navigate("/products")
                            }
                            className="
                                flex
                                h-5
                                w-5
                                items-center
                                justify-center
                                text-[#F5F5DC]
                                opacity-90
                                transition-all
                                duration-200
                                hover:-translate-y-[1px]
                                hover:text-[#FF8F00]
                                hover:opacity-100
                            "
                        >
                            <Search
                                className="h-full w-full"
                                strokeWidth={2}
                            />
                        </button>

                        {/* =================================================
                            CART
                        ================================================== */}

                        <NavLink
                            to="/cart"
                            aria-label="Shopping Cart"
                            className="
                                relative
                                flex
                                h-5
                                w-5
                                items-center
                                justify-center
                                text-[#F5F5DC]
                                opacity-90
                                transition-all
                                duration-200
                                hover:-translate-y-[1px]
                                hover:text-[#FF8F00]
                                hover:opacity-100
                            "
                        >
                            <ShoppingCart
                                className="h-full w-full"
                                strokeWidth={2}
                            />

                            {cartCount > 0 && (
                                <span
                                    className="
                                        absolute
                                        -right-[11px]
                                        -top-[9px]
                                        flex
                                        min-h-4
                                        min-w-4
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#FF8F00]
                                        px-[3px]
                                        text-[10px]
                                        font-bold
                                        leading-none
                                        text-[#0A0A0A]
                                        font-['JetBrains_Mono',monospace]
                                    "
                                >
                                    {cartCount > 99
                                        ? "99+"
                                        : cartCount}
                                </span>
                            )}
                        </NavLink>

                        {/* =================================================
                            USER / LOGIN
                        ================================================== */}

                        {user ? (
                            <div
                                ref={profileRef}
                                className="relative"
                            >

                                {/* =================================================
                                    LOGGED-IN USER CARD
                                ================================================== */}

                                <button
                                    type="button"
                                    aria-label="Open user profile"
                                    aria-expanded={
                                        profileOpen
                                    }
                                    onClick={() =>
                                        setProfileOpen(
                                            (previous) =>
                                                !previous
                                        )
                                    }
                                    className="
                                        group
                                        hidden
                                        sm:flex
                                        items-center
                                        gap-3
                                        rounded-full
                                        border
                                        border-[#F5F5DC]/10
                                        bg-[#F5F5DC]/[0.035]
                                        py-1.5
                                        pl-1.5
                                        pr-3
                                        transition-all
                                        duration-200
                                        hover:border-[#FF8F00]/50
                                        hover:bg-[#FF8F00]/[0.06]
                                        hover:shadow-[0_0_20px_rgba(255,143,0,0.08)]
                                    "
                                >

                                    {/* =================================================
                                        BIGGER USER AVATAR
                                    ================================================== */}

                                    <div
                                        className="
                                            relative
                                            flex
                                            h-10
                                            w-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            overflow-hidden
                                            rounded-full
                                            border
                                            border-[#FF8F00]/50
                                            bg-[#171717]
                                            shadow-[0_0_0_2px_rgba(255,143,0,0.05)]
                                        "
                                    >
                                        {userImage ? (
                                            <img
                                                src={userImage}
                                                alt={userName}
                                                className="
                                                    block
                                                    h-full
                                                    w-full
                                                    object-cover
                                                "
                                                onError={(
                                                    event
                                                ) => {
                                                    event.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            <span className="text-[12px] font-bold tracking-wide text-[#FFB04D]">
                                                {getUserInitials()}
                                            </span>
                                        )}

                                        <span
                                            className="
                                                absolute
                                                bottom-[1px]
                                                right-[1px]
                                                h-[9px]
                                                w-[9px]
                                                rounded-full
                                                border-2
                                                border-[#0A0A0A]
                                                bg-[#38D16A]
                                            "
                                        />
                                    </div>

                                    {/* =================================================
                                        USER NAME
                                    ================================================== */}

                                    <div className="hidden min-w-[105px] max-w-[145px] lg:block">
                                        <p
                                            className="
                                                truncate
                                                text-left
                                                font-['Work_Sans',sans-serif]
                                                text-[12px]
                                                font-semibold
                                                text-[#F5F5DC]
                                            "
                                        >
                                            {userName}
                                        </p>

                                        <p
                                            className="
                                                mt-[2px]
                                                text-left
                                                font-mono
                                                text-[8px]
                                                uppercase
                                                tracking-[0.13em]
                                                text-[#F5F5DC]/40
                                            "
                                        >
                                            {user.role === "admin"
                                                ? "Admin"
                                                : "Collector"}
                                        </p>
                                    </div>

                                    {/* =================================================
                                        DROPDOWN ARROW
                                    ================================================== */}

                                    <ChevronDown
                                        size={14}
                                        strokeWidth={2}
                                        className={`
                                            shrink-0
                                            text-[#F5F5DC]/50
                                            transition-transform
                                            duration-200
                                            ${
                                                profileOpen
                                                    ? "rotate-180 text-[#FF8F00]"
                                                    : ""
                                            }
                                        `}
                                    />
                                </button>

                                {/* =================================================
                                    PROFILE DROPDOWN
                                ================================================== */}

                                {profileOpen && (
                                    <div
                                        className="
                                            absolute
                                            right-0
                                            top-[54px]
                                            w-[285px]
                                            overflow-hidden
                                            rounded-xl
                                            border
                                            border-[#F5F5DC]/10
                                            bg-[#11110F]
                                            shadow-[0_25px_60px_rgba(0,0,0,0.55)]
                                            backdrop-blur-xl
                                        "
                                    >

                                        {/* =================================================
                                            PROFILE HEADER
                                        ================================================== */}

                                        <div
                                            className="
                                                border-b
                                                border-[#F5F5DC]/10
                                                bg-gradient-to-br
                                                from-[#FF8F00]/[0.10]
                                                to-transparent
                                                px-5
                                                py-5
                                            "
                                        >
                                            <div className="flex items-center gap-3.5">

                                                {/* Bigger Dropdown Image */}

                                                <div
                                                    className="
                                                        relative
                                                        flex
                                                        h-14
                                                        w-14
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        overflow-hidden
                                                        rounded-full
                                                        border
                                                        border-[#FF8F00]/50
                                                        bg-[#1C1C19]
                                                        shadow-[0_0_20px_rgba(255,143,0,0.08)]
                                                    "
                                                >
                                                    {userImage ? (
                                                        <img
                                                            src={userImage}
                                                            alt={userName}
                                                            className="
                                                                block
                                                                h-full
                                                                w-full
                                                                object-cover
                                                            "
                                                            onError={(
                                                                event
                                                            ) => {
                                                                event.currentTarget.style.display =
                                                                    "none";
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-bold text-[#FFB04D]">
                                                            {getUserInitials()}
                                                        </span>
                                                    )}

                                                    <span
                                                        className="
                                                            absolute
                                                            bottom-0
                                                            right-0
                                                            h-3
                                                            w-3
                                                            rounded-full
                                                            border-2
                                                            border-[#11110F]
                                                            bg-[#38D16A]
                                                        "
                                                    />
                                                </div>

                                                {/* User Information */}

                                                <div className="min-w-0 flex-1">

                                                    <p
                                                        className="
                                                            truncate
                                                            font-['Work_Sans',sans-serif]
                                                            text-[14px]
                                                            font-semibold
                                                            text-[#F5F5DC]
                                                        "
                                                    >
                                                        {userName}
                                                    </p>

                                                    <p
                                                        className="
                                                            mt-1
                                                            truncate
                                                            text-[10px]
                                                            text-[#F5F5DC]/40
                                                        "
                                                    >
                                                        {user.email ||
                                                            "Metal Garage Collector"}
                                                    </p>

                                                    <div className="mt-2 flex items-center gap-1.5">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#38D16A]" />

                                                        <span
                                                            className="
                                                                text-[8px]
                                                                font-medium
                                                                uppercase
                                                                tracking-[0.12em]
                                                                text-[#38D16A]/80
                                                            "
                                                        >
                                                            Online
                                                        </span>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>

                                        {/* =================================================
                                            DROPDOWN MENU
                                        ================================================== */}

                                        <div className="p-2">

                                            {/* ACCOUNT */}

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setProfileOpen(
                                                        false
                                                    );
                                                    navigate(
                                                        "/account"
                                                    );
                                                }}
                                                className="
                                                    group
                                                    flex
                                                    w-full
                                                    items-center
                                                    gap-3
                                                    rounded-lg
                                                    px-3
                                                    py-3
                                                    text-left
                                                    transition-all
                                                    duration-200
                                                    hover:bg-[#F5F5DC]/[0.06]
                                                "
                                            >
                                                <span
                                                    className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        bg-[#F5F5DC]/[0.05]
                                                        text-[#F5F5DC]/55
                                                        transition-colors
                                                        group-hover:bg-[#FF8F00]/10
                                                        group-hover:text-[#FF8F00]
                                                    "
                                                >
                                                    <UserCircle
                                                        size={17}
                                                        strokeWidth={1.8}
                                                    />
                                                </span>

                                                <span className="flex-1">
                                                    <span className="block text-[12px] font-semibold text-[#F5F5DC]">
                                                        My Account
                                                    </span>

                                                    <span className="mt-0.5 block text-[9px] text-[#F5F5DC]/35">
                                                        View your profile
                                                    </span>
                                                </span>

                                                <span className="text-[14px] text-[#F5F5DC]/20 transition-colors group-hover:text-[#FF8F00]/70">
                                                    →
                                                </span>
                                            </button>

                                            {/* SETTINGS */}

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setProfileOpen(
                                                        false
                                                    );
                                                    navigate(
                                                        "/account/settings"
                                                    );
                                                }}
                                                className="
                                                    group
                                                    flex
                                                    w-full
                                                    items-center
                                                    gap-3
                                                    rounded-lg
                                                    px-3
                                                    py-3
                                                    text-left
                                                    transition-all
                                                    duration-200
                                                    hover:bg-[#F5F5DC]/[0.06]
                                                "
                                            >
                                                <span
                                                    className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        bg-[#F5F5DC]/[0.05]
                                                        text-[#F5F5DC]/55
                                                        transition-colors
                                                        group-hover:bg-[#FF8F00]/10
                                                        group-hover:text-[#FF8F00]
                                                    "
                                                >
                                                    <Settings
                                                        size={17}
                                                        strokeWidth={1.8}
                                                    />
                                                </span>

                                                <span className="flex-1">
                                                    <span className="block text-[12px] font-semibold text-[#F5F5DC]">
                                                        Account Settings
                                                    </span>

                                                    <span className="mt-0.5 block text-[9px] text-[#F5F5DC]/35">
                                                        Manage your account
                                                    </span>
                                                </span>

                                                <span className="text-[14px] text-[#F5F5DC]/20 transition-colors group-hover:text-[#FF8F00]/70">
                                                    →
                                                </span>
                                            </button>

                                            {/* ORDERS */}

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setProfileOpen(
                                                        false
                                                    );
                                                    navigate(
                                                        "/orders"
                                                    );
                                                }}
                                                className="
                                                    group
                                                    flex
                                                    w-full
                                                    items-center
                                                    gap-3
                                                    rounded-lg
                                                    px-3
                                                    py-3
                                                    text-left
                                                    transition-all
                                                    duration-200
                                                    hover:bg-[#F5F5DC]/[0.06]
                                                "
                                            >
                                                <span
                                                    className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        bg-[#F5F5DC]/[0.05]
                                                        text-[#F5F5DC]/55
                                                        transition-colors
                                                        group-hover:bg-[#FF8F00]/10
                                                        group-hover:text-[#FF8F00]
                                                    "
                                                >
                                                    <Package
                                                        size={17}
                                                        strokeWidth={1.8}
                                                    />
                                                </span>

                                                <span className="flex-1">
                                                    <span className="block text-[12px] font-semibold text-[#F5F5DC]">
                                                        My Orders
                                                    </span>

                                                    <span className="mt-0.5 block text-[9px] text-[#F5F5DC]/35">
                                                        Track your purchases
                                                    </span>
                                                </span>

                                                <span className="text-[14px] text-[#F5F5DC]/20 transition-colors group-hover:text-[#FF8F00]/70">
                                                    →
                                                </span>
                                            </button>

                                            {/* =================================================
                                                ADMIN DASHBOARD
                                                ONLY VISIBLE TO ADMIN USERS
                                            ================================================== */}

                                            {user?.role === "admin" && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setProfileOpen(
                                                            false
                                                        );
                                                        navigate(
                                                            "/admin"
                                                        );
                                                    }}
                                                    className="
                                                        group
                                                        flex
                                                        w-full
                                                        items-center
                                                        gap-3
                                                        rounded-lg
                                                        px-3
                                                        py-3
                                                        text-left
                                                        transition-all
                                                        duration-200
                                                        hover:bg-[#F5F5DC]/[0.06]
                                                    "
                                                >
                                                    <span
                                                        className="
                                                            flex
                                                            h-9
                                                            w-9
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            bg-[#F5F5DC]/[0.05]
                                                            text-[#F5F5DC]/55
                                                            transition-colors
                                                            group-hover:bg-[#FF8F00]/10
                                                            group-hover:text-[#FF8F00]
                                                        "
                                                    >
                                                        <LayoutDashboard
                                                            size={17}
                                                            strokeWidth={1.8}
                                                        />
                                                    </span>

                                                    <span className="flex-1">
                                                        <span className="block text-[12px] font-semibold text-[#F5F5DC]">
                                                            Admin Dashboard
                                                        </span>

                                                        <span className="mt-0.5 block text-[9px] text-[#F5F5DC]/35">
                                                            Manage Metal Garage
                                                        </span>
                                                    </span>

                                                    <span className="text-[14px] text-[#F5F5DC]/20 transition-colors group-hover:text-[#FF8F00]/70">
                                                        →
                                                    </span>
                                                </button>
                                            )}

                                            <div className="my-2 h-px bg-[#F5F5DC]/10" />

                                            {/* LOGOUT */}

                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="
                                                    group
                                                    flex
                                                    w-full
                                                    items-center
                                                    gap-3
                                                    rounded-lg
                                                    px-3
                                                    py-3
                                                    text-left
                                                    transition-all
                                                    duration-200
                                                    hover:bg-[#FF3B00]/10
                                                "
                                            >
                                                <span
                                                    className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        bg-[#FF3B00]/[0.07]
                                                        text-[#FF6A3D]
                                                        transition-colors
                                                        group-hover:bg-[#FF3B00]/15
                                                    "
                                                >
                                                    <LogOut
                                                        size={17}
                                                        strokeWidth={1.8}
                                                    />
                                                </span>

                                                <span className="flex-1">
                                                    <span className="block text-[12px] font-semibold text-[#FF6A3D]">
                                                        Log Out
                                                    </span>

                                                    <span className="mt-0.5 block text-[9px] text-[#FF6A3D]/45">
                                                        Sign out of your account
                                                    </span>
                                                </span>
                                            </button>

                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <NavLink
                                to="/login"
                                className="
                                    hidden
                                    lg:block
                                    rounded-[2px]
                                    border
                                    border-[rgba(245,245,220,0.14)]
                                    px-[18px]
                                    py-[9px]
                                    text-[12px]
                                    font-['Work_Sans',sans-serif]
                                    font-medium
                                    uppercase
                                    tracking-[0.09em]
                                    text-[#F5F5DC]
                                    transition-all
                                    duration-200
                                    hover:border-[#FF8F00]
                                    hover:text-[#FF8F00]
                                "
                            >
                                Sign In
                            </NavLink>
                        )}

                        <button
                            type="button"
                            aria-label={
                                mobileMenuOpen
                                    ? "Close navigation menu"
                                    : "Open navigation menu"
                            }
                            aria-expanded={mobileMenuOpen}
                            onClick={() => {
                                setMobileMenuOpen(
                                    (previous) => !previous
                                );
                                setProfileOpen(false);
                            }}
                            className="
                                flex
                                h-6
                                w-6
                                items-center
                                justify-center
                                text-[#F5F5DC]
                                transition-colors
                                hover:text-[#FF8F00]
                                lg:hidden
                            "
                        >
                            {mobileMenuOpen ? (
                                <X size={21} strokeWidth={2} />
                            ) : (
                                <Menu size={21} strokeWidth={2} />
                            )}
                        </button>

                    </div>
                </nav>

                {mobileMenuOpen && (
                    <div className="border-t border-[rgba(245,245,220,0.1)] bg-[#0A0A0A] px-5 pb-5 pt-3 lg:hidden">
                        <ul className="m-0 flex list-none flex-col gap-1 p-0">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <NavLink
                                        to={link.path}
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }
                                        className={({ isActive }) => `
                                            block border-l-2 px-4 py-3
                                            font-['Work_Sans',sans-serif]
                                            text-[13px] font-medium uppercase tracking-[0.09em]
                                            transition-colors duration-200
                                            ${
                                                isActive
                                                    ? "border-[#FF8F00] text-[#F5F5DC]"
                                                    : "border-transparent text-[rgba(245,245,220,0.7)] hover:border-[#FF8F00] hover:text-[#F5F5DC]"
                                            }
                                        `}
                                    >
                                        {link.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </header>
        </>
    );
}