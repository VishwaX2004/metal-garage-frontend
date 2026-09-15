import { NavLink, useNavigate } from "react-router-dom";
import {
    Search,
    Heart,
    ShoppingCart,
    UserRound,
    Menu,
    Package,
    Settings,
    LogOut,
    ChevronDown,
    UserCircle,
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

        window.addEventListener("resize", handleResize);

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

                    <div className="hidden min-[981px]:flex items-center">
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

                    <div className="flex items-center gap-[17px] sm:gap-[21px]">

                        {/* SEARCH */}

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

                        {/* WISHLIST */}

                        <button
                            type="button"
                            aria-label="Wishlist"
                            onClick={() =>
                                navigate("/wishlist")
                            }
                            className="
                                hidden
                                sm:flex
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
                            <Heart
                                className="h-full w-full"
                                strokeWidth={2}
                            />
                        </button>

                        {/* ORDERS */}

                        <NavLink
                            to="/orders"
                            aria-label="My Orders"
                            className="
                                hidden
                                sm:flex
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
                            <Package
                                className="h-full w-full"
                                strokeWidth={2}
                            />
                        </NavLink>

                        {/* CART */}

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
                            LOGGED IN USER
                        ================================================== */}

                        {user ? (
                            <div
                                ref={profileRef}
                                className="relative"
                            >
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
                                        gap-2.5
                                        rounded-full
                                        border
                                        border-[#F5F5DC]/10
                                        bg-[#F5F5DC]/[0.035]
                                        py-1
                                        pl-1
                                        pr-2.5
                                        transition-all
                                        duration-200
                                        hover:border-[#FF8F00]/50
                                        hover:bg-[#FF8F00]/[0.06]
                                    "
                                >
                                    {/* Avatar */}

                                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#FF8F00]/40 bg-[#171717]">

                                        {userImage ? (
                                            <img
                                                src={userImage}
                                                alt={userName}
                                                className="h-full w-full object-cover"
                                                onError={(event) => {
                                                    event.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            <span className="text-[10px] font-bold tracking-wide text-[#FFB04D]">
                                                {getUserInitials()}
                                            </span>
                                        )}

                                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-[#0A0A0A] bg-[#38D16A]" />
                                    </div>

                                    {/* Name */}

                                    <div className="hidden max-w-[105px] lg:block">
                                        <p className="truncate text-left font-['Work_Sans',sans-serif] text-[11px] font-semibold text-[#F5F5DC]">
                                            {userName}
                                        </p>

                                        <p className="mt-[1px] text-left font-mono text-[7px] uppercase tracking-[0.13em] text-[#F5F5DC]/35">
                                            {user.role === "admin"
                                                ? "Admin"
                                                : "Collector"}
                                        </p>
                                    </div>

                                    <ChevronDown
                                        size={13}
                                        strokeWidth={2}
                                        className={`
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
                                    <div className="absolute right-0 top-[48px] w-[245px] overflow-hidden rounded-xl border border-[#F5F5DC]/10 bg-[#11110F] shadow-[0_25px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">

                                        {/* Profile Header */}

                                        <div className="border-b border-[#F5F5DC]/10 bg-gradient-to-br from-[#FF8F00]/[0.10] to-transparent px-4 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#FF8F00]/40 bg-[#1C1C19]">

                                                    {userImage ? (
                                                        <img
                                                            src={userImage}
                                                            alt={userName}
                                                            className="h-full w-full object-cover"
                                                            onError={(event) => {
                                                                event.currentTarget.style.display =
                                                                    "none";
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-xs font-bold text-[#FFB04D]">
                                                            {getUserInitials()}
                                                        </span>
                                                    )}

                                                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#11110F] bg-[#38D16A]" />
                                                </div>

                                                <div className="min-w-0 flex-1">

                                                    <p className="truncate font-['Work_Sans',sans-serif] text-[13px] font-semibold text-[#F5F5DC]">
                                                        {userName}
                                                    </p>

                                                    <p className="mt-0.5 truncate text-[10px] text-[#F5F5DC]/40">
                                                        {user.email ||
                                                            "Metal Garage Collector"}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                        {/* Dropdown */}

                                        <div className="p-1.5">

                                            {/* ACCOUNT */}

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setProfileOpen(false);
                                                    navigate("/account");
                                                }}
                                                className="
                                                    group
                                                    flex
                                                    w-full
                                                    items-center
                                                    gap-3
                                                    rounded-lg
                                                    px-3
                                                    py-2.5
                                                    text-left
                                                    transition-colors
                                                    duration-200
                                                    hover:bg-[#F5F5DC]/[0.06]
                                                "
                                            >
                                                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F5F5DC]/[0.05] text-[#F5F5DC]/55 transition-colors group-hover:bg-[#FF8F00]/10 group-hover:text-[#FF8F00]">
                                                    <UserCircle
                                                        size={16}
                                                        strokeWidth={1.8}
                                                    />
                                                </span>

                                                <span className="flex-1">
                                                    <span className="block text-[11px] font-semibold text-[#F5F5DC]">
                                                        My Account
                                                    </span>

                                                    <span className="mt-0.5 block text-[9px] text-[#F5F5DC]/35">
                                                        View your profile
                                                    </span>
                                                </span>
                                            </button>

                                            {/* SETTINGS */}

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setProfileOpen(false);
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
                                                    py-2.5
                                                    text-left
                                                    transition-colors
                                                    duration-200
                                                    hover:bg-[#F5F5DC]/[0.06]
                                                "
                                            >
                                                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F5F5DC]/[0.05] text-[#F5F5DC]/55 transition-colors group-hover:bg-[#FF8F00]/10 group-hover:text-[#FF8F00]">
                                                    <Settings
                                                        size={16}
                                                        strokeWidth={1.8}
                                                    />
                                                </span>

                                                <span className="flex-1">
                                                    <span className="block text-[11px] font-semibold text-[#F5F5DC]">
                                                        Account Settings
                                                    </span>

                                                    <span className="mt-0.5 block text-[9px] text-[#F5F5DC]/35">
                                                        Manage your account
                                                    </span>
                                                </span>
                                            </button>

                                            {/* ORDERS */}

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setProfileOpen(false);
                                                    navigate("/orders");
                                                }}
                                                className="
                                                    group
                                                    flex
                                                    w-full
                                                    items-center
                                                    gap-3
                                                    rounded-lg
                                                    px-3
                                                    py-2.5
                                                    text-left
                                                    transition-colors
                                                    duration-200
                                                    hover:bg-[#F5F5DC]/[0.06]
                                                "
                                            >
                                                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F5F5DC]/[0.05] text-[#F5F5DC]/55 transition-colors group-hover:bg-[#FF8F00]/10 group-hover:text-[#FF8F00]">
                                                    <Package
                                                        size={16}
                                                        strokeWidth={1.8}
                                                    />
                                                </span>

                                                <span className="flex-1">
                                                    <span className="block text-[11px] font-semibold text-[#F5F5DC]">
                                                        My Orders
                                                    </span>

                                                    <span className="mt-0.5 block text-[9px] text-[#F5F5DC]/35">
                                                        Track your purchases
                                                    </span>
                                                </span>
                                            </button>

                                            <div className="my-1.5 h-px bg-[#F5F5DC]/10" />

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
                                                    py-2.5
                                                    text-left
                                                    transition-colors
                                                    duration-200
                                                    hover:bg-[#FF3B00]/10
                                                "
                                            >
                                                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#FF3B00]/[0.07] text-[#FF6A3D] transition-colors group-hover:bg-[#FF3B00]/15">
                                                    <LogOut
                                                        size={16}
                                                        strokeWidth={1.8}
                                                    />
                                                </span>

                                                <span className="flex-1">
                                                    <span className="block text-[11px] font-semibold text-[#FF6A3D]">
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
                            /* NOT LOGGED IN */

                            <NavLink
                                to="/login"
                                aria-label="Account"
                                className="
                                    hidden
                                    sm:flex
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
                                <UserRound
                                    className="h-full w-full"
                                    strokeWidth={2}
                                />
                            </NavLink>
                        )}

                        {/* =================================================
                            DESKTOP LOGIN / LOGOUT
                        ================================================== */}

                        {user ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="
                                    hidden
                                    min-[981px]:block
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
                                    hover:border-[#FF3B00]
                                    hover:bg-[#FF3B00]/[0.06]
                                    hover:text-[#FF6A3D]
                                "
                            >
                                Log Out
                            </button>
                        ) : (
                            <NavLink
                                to="/login"
                                className="
                                    hidden
                                    min-[981px]:block
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

                      

                    </div>
                </nav>
            </header>

            {/* Header spacer */}

            <div className="h-[78px]" />
        </>
    );
}
