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
import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";

const NAV_LINKS = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Cart", path: "/cart" },
    { name: "Orders", path: "/orders" },
];

function Header() {
    const navigate = useNavigate();

    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [searchProducts, setSearchProducts] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState("");
    const [searchDismissed, setSearchDismissed] = useState(false);

    const profileRef = useRef(null);
    const searchRef = useRef(null);
    const searchDebounceRef = useRef(null);

    // =========================================================
    // CART COUNT
    // =========================================================

    const updateCartCount = useCallback(() => {
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
    }, []);

    // =========================================================
    // GET STORED USER
    // =========================================================

    const getStoredUser = useCallback(() => {
        try {
            // Support both storage keys used by the existing authentication flows.
            const storedUser =
                localStorage.getItem("user") ||
                localStorage.getItem("currentUser");

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
    }, []);

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

            if (
                window.innerWidth >= 1024 &&
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setSearchOpen(false);
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
    // PRODUCT SEARCH
    // =========================================================

    useEffect(() => {
        if (!searchOpen || searchProducts.length > 0) {
            return undefined;
        }

        const apiUrl = import.meta.env.VITE_API_URL;

        if (!apiUrl) {
            return undefined;
        }

        const controller = new AbortController();

        fetch(`${apiUrl}/api/products`, {
            signal: controller.signal,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Unable to load products.");
                }

                return response.json();
            })
            .then((data) => {
                const products = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.products)
                        ? data.products
                        : [];

                setSearchProducts(products);
            })
            .catch((error) => {
                if (error.name !== "AbortError") {
                    console.error("Unable to load search products:", error);
                    setSearchError("Search is temporarily unavailable.");
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setSearchLoading(false);
                }
            });

        return () => controller.abort();
    }, [searchOpen, searchProducts.length]);

    const normalizedSearchQuery = debouncedQuery.trim().toLowerCase();

    const searchResults = useMemo(() => {
        if (!normalizedSearchQuery || searchDismissed) {
            return [];
        }

        return searchProducts
            .filter((product) => {
                const searchableText = [
                    product?.name,
                    product?.category,
                    product?.series,
                    product?.model,
                    product?.manufacturer,
                    product?.casting,
                    product?.sku,
                    product?.productID,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(normalizedSearchQuery);
            })
            .slice(0, 6);
    }, [normalizedSearchQuery, searchDismissed, searchProducts]);

    const getProductId = (product) =>
        product?.productID ||
        product?._id ||
        product?.id ||
        product?.sku ||
        product?.name;

    const handleSearchResultClick = (product) => {
        const productId = getProductId(product);

        if (!productId) {
            return;
        }

        setSearchQuery(product?.name || "");
        setSearchDismissed(true);
        navigate(`/overview/${encodeURIComponent(productId)}`);
    };

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

    // =========================================================
    // MEMOIZED USER DATA
    // =========================================================

    const userName = useMemo(() => {
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
    }, [user]);

    const userInitials = useMemo(() => {
        const name = userName;

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
    }, [userName]);

    const userImage = useMemo(() => {
        if (!user) {
            return null;
        }

        // Google sign-in libraries and backend APIs use different names
        // for the same Google account profile-photo URL. Check common names
        // at the top level and in nested Google/profile objects.
        const candidates = [
            user.profileImage,
            user.profilePicture,
            user.profilePic,
            user.avatarUrl,
            user.avatarURL,
            user.avatar,
            user.imageUrl,
            user.imageURL,
            user.image,
            user.photoURL,
            user.photoUrl,
            user.picture,
            user.googlePicture,
            user.googleImage,
            user.google?.picture,
            user.google?.photoURL,
            user.google?.image,
            user.profile?.picture,
            user.profile?.photoURL,
            user.profile?.image,
        ];

        return candidates.find(
            (value) => typeof value === "string" && value.trim().length > 0
        ) || null;
    }, [user]);

    // =========================================================
    // SEARCH DEBOUNCE
    // =========================================================

    const handleSearchInputChange = useCallback((event) => {
        const value = event.target.value;
        setSearchQuery(value);
        setSearchDismissed(false);

        clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => {
            setDebouncedQuery(value);
        }, 300);
    }, []);

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
            }
        };
    }, []);

    return (
        <>
            <header className="fixed left-0 right-0 top-0 z-[1000] w-full border-b border-[rgba(245,245,220,0.14)] bg-[#0A0A0A]">

                <nav className="mx-auto flex h-[68px] sm:h-[78px] w-full max-w-[1320px] items-center justify-between px-3 sm:px-10">

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
                            className="block h-[30px] w-auto sm:h-[46px]"
                        />
                    </NavLink>

                    {/* =================================================
                        DESKTOP NAVIGATION
                    ================================================== */}

                    <div className="hidden lg:flex items-center">
                        <ul className="m-0 flex list-none items-center gap-[30px] p-0">

                            {NAV_LINKS.map((link) => (
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

                    <div className="flex shrink-0 items-center gap-2.5 sm:gap-[21px]">

                        {/* =================================================
                            SEARCH
                        ================================================== */}

                        <div
                            ref={searchRef}
                            className="relative hidden lg:block"
                        >
                            <button
                                type="button"
                                aria-label="Search"
                                aria-expanded={searchOpen}
                                onClick={() => {
                                    setSearchOpen((previous) => {
                                        const nextOpen = !previous;

                                        if (
                                            nextOpen &&
                                            searchProducts.length === 0 &&
                                            import.meta.env.VITE_API_URL
                                        ) {
                                            setSearchLoading(true);
                                            setSearchError("");
                                        }

                                        return nextOpen;
                                    });
                                    setProfileOpen(false);
                                }}
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

                            {searchOpen && (
                                <div className="absolute right-0 top-[calc(100%+18px)] z-[1100] w-[min(420px,calc(100vw-32px))] overflow-hidden rounded-xl border border-[#F5F5DC]/15 bg-[#11110F] shadow-[0_18px_55px_rgba(0,0,0,0.45)]">
                                    <div className="flex items-center gap-3 border-b border-[#F5F5DC]/10 px-4 py-3">
                                        <Search
                                            className="h-4 w-4 shrink-0 text-[#FF8F00]"
                                            strokeWidth={2}
                                        />
                                        <input
                                            autoFocus
                                            type="search"
                                            value={searchQuery}
                                            onChange={handleSearchInputChange}
                                            placeholder="Search die-cast, series, or model..."
                                            aria-label="Search products"
                                            className="min-w-0 flex-1 bg-transparent font-['Work_Sans',sans-serif] text-sm text-[#F5F5DC] outline-none placeholder:text-[#F5F5DC]/35"
                                        />
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                aria-label="Clear search"
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setSearchDismissed(false);
                                                }}
                                                className="text-[#F5F5DC]/45 transition-colors hover:text-[#FF8F00]"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>

                                    {searchQuery && (
                                        <div className="max-h-[min(390px,55vh)] overflow-y-auto p-2">
                                            {searchLoading && (
                                                <p className="px-3 py-5 text-center text-xs text-[#F5F5DC]/50">
                                                    Finding products...
                                                </p>
                                            )}

                                            {!searchLoading &&
                                                (searchError ||
                                                    !import.meta.env.VITE_API_URL) && (
                                                <p className="px-3 py-5 text-center text-xs text-[#FF8F00]">
                                                    {searchError ||
                                                        "Search is temporarily unavailable."}
                                                </p>
                                            )}

                                            {!searchLoading &&
                                                !searchError &&
                                                import.meta.env.VITE_API_URL &&
                                                searchResults.length === 0 && (
                                                    <p className="px-3 py-5 text-center text-xs text-[#F5F5DC]/50">
                                                        No matching products found.
                                                    </p>
                                                )}

                                            {!searchLoading &&
                                                searchResults.map((product) => {
                                                    const productId = getProductId(product);
                                                    const image = Array.isArray(product?.images)
                                                        ? product.images[0]
                                                        : null;

                                                    return (
                                                        <button
                                                            type="button"
                                                            key={productId}
                                                            onClick={() =>
                                                                handleSearchResultClick(product)
                                                            }
                                                            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[#F5F5DC]/[0.07]"
                                                        >
                                                            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#F5F5DC]/10 bg-[#F5F5DC]/[0.05]">
                                                                {image ? (
                                                                    <img
                                                                        src={image}
                                                                        alt=""
                                                                        crossOrigin="anonymous"
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <Package
                                                                        size={17}
                                                                        className="text-[#FF8F00]"
                                                                    />
                                                                )}
                                                            </span>
                                                            <span className="min-w-0 flex-1">
                                                                <span className="block truncate text-sm font-medium text-[#F5F5DC] group-hover:text-[#FF8F00]">
                                                                    {product?.name || "Unnamed product"}
                                                                </span>
                                                                <span className="mt-1 block truncate text-[10px] uppercase tracking-[0.08em] text-[#F5F5DC]/40">
                                                                    {product?.series || product?.category || "Die-cast collectible"}
                                                                </span>
                                                            </span>
                                                            <span className="text-lg text-[#F5F5DC]/25 transition-colors group-hover:text-[#FF8F00]">
                                                                →
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* =================================================
                            CART
                        ================================================== */}

                        <NavLink
                            to="/cart"
                            aria-label="Shopping Cart"
                            className="
                                relative
                                hidden lg:flex
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
                                    onClick={() => {
                                        setProfileOpen((previous) => !previous);
                                        setMobileMenuOpen(false);
                                    }}
                                    className="
                                        group
                                        flex
                                        items-center
                                        gap-1.5
                                        sm:gap-3
                                        rounded-full
                                        border
                                        border-[#F5F5DC]/10
                                        bg-[#F5F5DC]/[0.035]
                                        py-1
                                        pl-1
                                        pr-1.5
                                        sm:py-1.5
                                        sm:pl-1.5
                                        sm:pr-3
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
                                            isolate
                                            z-0
                                            flex
                                            h-8
                                            w-8
                                            sm:h-10
                                            sm:w-10
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
                                                crossOrigin="anonymous"
                                                className="
                                                    block
                                                    h-full
                                                    w-full
                                                    object-cover
                                                "
                                                onError={(event) => {
                                                    event.currentTarget.style.display = "none";
                                                }}
                                            />
                                        ) : null}
                                        
                                        {!userImage && (
                                            <span className="text-[12px] font-bold tracking-wide text-[#FFB04D]">
                                                {userInitials}
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

                                    <div className="block min-w-0 max-w-[76px] sm:hidden lg:block lg:min-w-[105px] lg:max-w-[145px]">
                                        <p
                                            className="
                                                truncate
                                                text-left
                                                font-['Work_Sans',sans-serif]
                                                text-[10px]
                                                sm:text-[12px]
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
                                            top-[calc(100%+10px)]
                                            w-[min(285px,calc(100vw-24px))]
                                            sm:top-[54px]
                                            sm:w-[285px]
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
                                                            crossOrigin="anonymous"
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
                                                            {userInitials}
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
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    setProfileOpen(false);
                                }}
                                className="
                                    flex
                                    lg:block
                                    shrink-0
                                    rounded-[2px]
                                    border
                                    border-[rgba(245,245,220,0.14)]
                                    px-2.5
                                    py-2
                                    text-[10px]
                                    sm:px-[18px]
                                    sm:py-[9px]
                                    sm:text-[12px]
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
                                const nextOpen = !mobileMenuOpen;
                                setMobileMenuOpen(nextOpen);
                                setProfileOpen(false);

                                if (nextOpen) {
                                    setSearchOpen(true);
                                    if (
                                        searchProducts.length === 0 &&
                                        import.meta.env.VITE_API_URL
                                    ) {
                                        setSearchLoading(true);
                                        setSearchError("");
                                    }
                                } else {
                                    setSearchOpen(false);
                                }
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
                    <div className="fixed left-0 right-0 top-[68px] max-h-[calc(100dvh-68px)] overflow-y-auto overscroll-contain border-t border-[rgba(245,245,220,0.12)] bg-[#0A0A0A]/[0.98] px-4 pb-6 pt-4 shadow-[0_22px_45px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:top-[78px] sm:max-h-[calc(100dvh-78px)] sm:px-5 lg:hidden">
                        {/* Mobile search lives inside the menu; no header search/cart icons on mobile. */}
                        <div className="mb-4 overflow-hidden rounded-xl border border-[#F5F5DC]/15 bg-[#11110F] shadow-[0_8px_24px_rgba(0,0,0,0.22)]">
                            <div className="flex min-h-12 items-center gap-3 px-4">
                                <Search
                                    size={18}
                                    className="shrink-0 text-[#FF8F00]"
                                    strokeWidth={2}
                                />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                    placeholder="Search die-cast, series, or model..."
                                    aria-label="Search products"
                                    className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#F5F5DC] outline-none placeholder:text-[#F5F5DC]/40"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        aria-label="Clear search"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSearchDismissed(false);
                                        }}
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#F5F5DC]/55 transition-colors hover:bg-[#F5F5DC]/[0.07] hover:text-[#FF8F00]"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            {searchQuery && (
                                <div className="max-h-[min(300px,38dvh)] overflow-y-auto border-t border-[#F5F5DC]/10 p-2">
                                    {searchLoading && (
                                        <p className="px-3 py-4 text-center text-xs text-[#F5F5DC]/50">
                                            Finding products...
                                        </p>
                                    )}

                                    {!searchLoading &&
                                        (searchError || !import.meta.env.VITE_API_URL) && (
                                            <p className="px-3 py-4 text-center text-xs text-[#FF8F00]">
                                                {searchError || "Search is temporarily unavailable."}
                                            </p>
                                        )}

                                    {!searchLoading &&
                                        !searchError &&
                                        import.meta.env.VITE_API_URL &&
                                        searchResults.length === 0 && (
                                            <p className="px-3 py-4 text-center text-xs text-[#F5F5DC]/50">
                                                No matching products found.
                                            </p>
                                        )}

                                    {!searchLoading &&
                                        searchResults.map((product) => {
                                            const productId = getProductId(product);
                                            const image = Array.isArray(product?.images)
                                                ? product.images[0]
                                                : null;

                                            return (
                                                <button
                                                    type="button"
                                                    key={productId}
                                                    onClick={() => {
                                                        handleSearchResultClick(product);
                                                        setMobileMenuOpen(false);
                                                        setSearchOpen(false);
                                                    }}
                                                    className="group flex min-h-14 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[#F5F5DC]/[0.07] active:bg-[#F5F5DC]/[0.1]"
                                                >
                                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#F5F5DC]/10 bg-[#F5F5DC]/[0.05]">
                                                        {image ? (
                                                            <img
                                                                src={image}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <Package size={17} className="text-[#FF8F00]" />
                                                        )}
                                                    </span>
                                                    <span className="min-w-0 flex-1">
                                                        <span className="block truncate text-sm font-medium text-[#F5F5DC] group-hover:text-[#FF8F00]">
                                                            {product?.name || "Unnamed product"}
                                                        </span>
                                                        <span className="mt-1 block truncate text-[10px] uppercase tracking-[0.08em] text-[#F5F5DC]/40">
                                                            {product?.series || product?.category || "Die-cast collectible"}
                                                        </span>
                                                    </span>
                                                    <span className="text-lg text-[#F5F5DC]/25 group-hover:text-[#FF8F00]">
                                                        →
                                                    </span>
                                                </button>
                                            );
                                        })}
                                </div>
                            )}
                        </div>

                        <p className="mb-2 px-4 font-['Work_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F5F5DC]/35">
                            Navigation
                        </p>
                        <ul className="m-0 flex list-none flex-col gap-1 p-0">
                            {NAV_LINKS.map((link) => (
                                <li key={link.name}>
                                    <NavLink
                                        to={link.path}
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            setProfileOpen(false);
                                        }}
                                        className={({ isActive }) => `
                                            block min-h-12 border-l-2 px-4 py-3.5
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

export default memo(Header);