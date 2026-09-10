import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    Minus,
    ShieldCheck,
    ShoppingCart,
    Trash2,
    ImageOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import Header from "../components/header";
import Footer from "../components/footer";
import ProdcutCard from "../components/productCard";


/* =========================================================
   CART SETTINGS
========================================================= */

const TAX_RATE = 0.0825;

const PROMO_CODES = {
    GARAGE10: 0.1,
    RACEDAY: 0.15,
};

const CART_STORAGE_KEY = "cart";
const SAVED_STORAGE_KEY = "savedForLater";


/* =========================================================
   HELPERS
========================================================= */

function currency(value) {
    const number = Number(value) || 0;

    return `Rs.${number
        .toFixed(2)
        .replace(/\.00$/, "")
        .replace(/(\.\d)0$/, "$1")}`;
}


function getProductId(product) {
    return (
        product?.productID ||
        product?._id ||
        product?.id ||
        product?.sku ||
        product?.name
    );
}


function getProductPrice(product) {
    return Number(product?.price) || 0;
}


function getProductStock(product) {
    const quantity = Number(product?.quantity);

    if (Number.isFinite(quantity)) {
        return Math.max(0, quantity);
    }

    return Infinity;
}


function getProductImage(product) {
    if (
        Array.isArray(product?.images) &&
        product.images.length > 0 &&
        typeof product.images[0] === "string"
    ) {
        return product.images[0];
    }

    return null;
}


function normalizeCartItem(item) {
    const product =
        item?.product &&
        typeof item.product === "object"
            ? item.product
            : item;

    const id = getProductId(product);

    const quantity = Math.max(
        1,
        Number(
            item?.cartQuantity ??
                item?.quantity ??
                1
        ) || 1
    );

    return {
        ...product,
        productID: product?.productID || id,
        cartQuantity: quantity,
    };
}


function readCart() {
    try {
        const stored =
            localStorage.getItem(
                CART_STORAGE_KEY
            );

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .map(normalizeCartItem)
            .filter((item) =>
                getProductId(item)
            );
    } catch (error) {
        console.error(
            "Unable to read cart:",
            error
        );

        return [];
    }
}


/*
 * IMPORTANT:
 * This function only saves the cart and notifies
 * OTHER components about the update.
 *
 * The CartPage itself ignores the event that it
 * generated. This prevents the removed item from
 * being immediately restored/re-normalized.
 */
function saveCart(cart) {
    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
    );

    window.dispatchEvent(
        new CustomEvent("cartUpdated", {
            detail: cart,
        })
    );
}


function getAvailableStock(product) {
    const stock = Number(
        product?.quantity
    );

    if (Number.isFinite(stock)) {
        return Math.max(0, stock);
    }

    return Infinity;
}


/* =========================================================
   PAGE
========================================================= */

export default function CartPage() {
    const navigate = useNavigate();


    /* =========================================================
       CART STATE
    ========================================================= */

    const [cartItems, setCartItems] =
        useState(() => readCart());

    /*
     * FIX:
     * Used to identify cartUpdated events generated
     * by this CartPage itself.
     *
     * Without this, saveCart() -> cartUpdated ->
     * setCartItems() -> saveCart() could repeatedly
     * update the cart.
     */
    const isOwnCartUpdateRef = useRef(false);


    const [discountRate, setDiscountRate] =
        useState(0);

    const [promoInput, setPromoInput] =
        useState("");

    const [promoMessage, setPromoMessage] =
        useState("");

    const [promoSuccess, setPromoSuccess] =
        useState(false);


    /* =========================================================
       SAVED ITEMS
    ========================================================= */

    const [savedItems, setSavedItems] =
        useState(() => {
            try {
                const saved =
                    localStorage.getItem(
                        SAVED_STORAGE_KEY
                    );

                if (!saved) {
                    return [];
                }

                const parsed =
                    JSON.parse(saved);

                return Array.isArray(parsed)
                    ? parsed
                    : [];
            } catch {
                return [];
            }
        });


    const [imageErrors, setImageErrors] =
        useState({});

    const [savedStatus, setSavedStatus] =
        useState({});


    /* =========================================================
       COMPLETE COLLECTION PRODUCTS
    ========================================================= */

    const [
        collectionProducts,
        setCollectionProducts,
    ] = useState([]);

    const [
        isCollectionLoading,
        setIsCollectionLoading,
    ] = useState(true);


    /* =========================================================
       FETCH COMPLETE COLLECTION
    ========================================================= */

    useEffect(() => {
        let mounted = true;

        const fetchCollectionProducts =
            async () => {
                try {
                    setIsCollectionLoading(true);

                    const apiUrl =
                        import.meta.env
                            .VITE_API_URL;

                    if (!apiUrl) {
                        throw new Error(
                            "VITE_API_URL is not configured."
                        );
                    }

                    const response =
                        await axios.get(
                            `${apiUrl}/api/products`
                        );

                    if (!mounted) {
                        return;
                    }

                    const data =
                        Array.isArray(
                            response.data
                        )
                            ? response.data
                            : Array.isArray(
                                response.data
                                    ?.products
                            )
                            ? response.data
                                .products
                            : [];

                    /*
                     * Randomly select only 4 products.
                     *
                     * The original product fetching
                     * logic remains unchanged.
                     */
                    const shuffledProducts = [
                        ...data,
                    ].sort(
                        () => Math.random() - 0.5
                    );

                    setCollectionProducts(
                        shuffledProducts.slice(0, 4)
                    );
                } catch (error) {
                    console.error(
                        "Error fetching collection products:",
                        error
                    );

                    if (mounted) {
                        setCollectionProducts(
                            []
                        );
                    }
                } finally {
                    if (mounted) {
                        setIsCollectionLoading(
                            false
                        );
                    }
                }
            };

        fetchCollectionProducts();

        return () => {
            mounted = false;
        };
    }, []);


    /* =========================================================
       SAVE CART
    ========================================================= */

    useEffect(() => {
        /*
         * Save the exact current state to localStorage.
         */
        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cartItems)
        );

        /*
         * Mark this event as coming from this CartPage.
         *
         * The flag stays true while dispatchEvent()
         * executes because browser CustomEvent dispatch
         * is synchronous.
         */
        isOwnCartUpdateRef.current = true;

        window.dispatchEvent(
            new CustomEvent("cartUpdated", {
                detail: cartItems,
            })
        );

        /*
         * Allow external cartUpdated events again.
         */
        isOwnCartUpdateRef.current = false;
    }, [cartItems]);


    /* =========================================================
       SAVE FOR LATER
    ========================================================= */

    useEffect(() => {
        localStorage.setItem(
            SAVED_STORAGE_KEY,
            JSON.stringify(savedItems)
        );
    }, [savedItems]);


    /* =========================================================
       LISTEN FOR CART UPDATES
    ========================================================= */

    useEffect(() => {
        const handleCartUpdated = (
            event
        ) => {
            /*
             * IMPORTANT FIX:
             *
             * Ignore the cartUpdated event generated
             * by this CartPage's own saveCart/state save.
             *
             * Other components can still update the
             * cart normally.
             */
            if (
                isOwnCartUpdateRef.current
            ) {
                return;
            }

            if (
                Array.isArray(
                    event.detail
                )
            ) {
                setCartItems(
                    event.detail
                        .map(
                            normalizeCartItem
                        )
                        .filter((item) =>
                            getProductId(item)
                        )
                );
            }
        };


        const handleAddToCart = (
            event
        ) => {
            const product =
                event?.detail;

            if (!product) {
                return;
            }

            addProductToCart(product);
        };


        window.addEventListener(
            "cartUpdated",
            handleCartUpdated
        );

        window.addEventListener(
            "addToCart",
            handleAddToCart
        );


        return () => {
            window.removeEventListener(
                "cartUpdated",
                handleCartUpdated
            );

            window.removeEventListener(
                "addToCart",
                handleAddToCart
            );
        };
    }, []);


    /* =========================================================
       CART CALCULATIONS
    ========================================================= */

    const totals = useMemo(() => {
        let subtotal = 0;
        let count = 0;

        cartItems.forEach((item) => {
            const price =
                getProductPrice(item);

            const quantity = Math.max(
                1,
                Number(
                    item.cartQuantity
                ) || 1
            );

            subtotal +=
                price * quantity;

            count += quantity;
        });


        const discount =
            subtotal * discountRate;


        /*
         * SHIPPING REMOVED
         */

        const shipping = 0;


        const taxableAmount =
            Math.max(
                0,
                subtotal - discount
            );


        const tax =
            taxableAmount *
            TAX_RATE;


        /*
         * Total no longer includes
         * shipping price.
         */

        const total =
            subtotal -
            discount +
            tax;


        return {
            subtotal,
            count,
            discount,
            shipping,
            tax,
            total,
        };
    }, [
        cartItems,
        discountRate,
    ]);


    /* =========================================================
       ADD PRODUCT
    ========================================================= */

    function addProductToCart(product) {
        if (!product) {
            toast.error(
                "Unable to add this product."
            );

            return;
        }


        const productId =
            getProductId(product);


        if (!productId) {
            toast.error(
                "Product ID is missing."
            );

            return;
        }


        const stock =
            getAvailableStock(product);


        if (stock <= 0) {
            toast.error(
                "This product is out of stock."
            );

            return;
        }


        setCartItems(
            (currentItems) => {
                const existingIndex =
                    currentItems.findIndex(
                        (item) =>
                            getProductId(
                                item
                            ) ===
                            productId
                    );


                if (
                    existingIndex !== -1
                ) {
                    const updated = [
                        ...currentItems,
                    ];


                    const currentQuantity =
                        Number(
                            updated[
                                existingIndex
                            ]
                                .cartQuantity
                        ) || 1;


                    if (
                        Number.isFinite(
                            stock
                        ) &&
                        currentQuantity >=
                            stock
                    ) {
                        toast.error(
                            `Only ${stock} item${
                                stock === 1
                                    ? ""
                                    : "s"
                            } available.`
                        );

                        return currentItems;
                    }


                    updated[
                        existingIndex
                    ] = {
                        ...updated[
                            existingIndex
                        ],
                        ...product,
                        cartQuantity:
                            currentQuantity +
                            1,
                    };


                    toast.success(
                        `${
                            product.name ||
                            "Product"
                        } quantity increased.`
                    );


                    return updated;
                }


                toast.success(
                    `${
                        product.name ||
                        "Product"
                    } added to cart.`
                );


                return [
                    ...currentItems,
                    {
                        ...product,
                        productID:
                            product?.productID ||
                            productId,
                        cartQuantity: 1,
                    },
                ];
            }
        );
    }


    /* =========================================================
       INCREASE QUANTITY
    ========================================================= */

    function increaseQuantity(
        productId
    ) {
        setCartItems(
            (currentItems) =>
                currentItems.map(
                    (item) => {
                        if (
                            getProductId(
                                item
                            ) !==
                            productId
                        ) {
                            return item;
                        }


                        const currentQuantity =
                            Number(
                                item.cartQuantity
                            ) || 1;


                        const stock =
                            getAvailableStock(
                                item
                            );


                        if (
                            Number.isFinite(
                                stock
                            ) &&
                            currentQuantity >=
                                stock
                        ) {
                            toast.error(
                                stock === 1
                                    ? "Only 1 item is available."
                                    : `Only ${stock} items are available.`
                            );

                            return item;
                        }


                        return {
                            ...item,
                            cartQuantity:
                                currentQuantity +
                                1,
                        };
                    }
                )
        );
    }


    /* =========================================================
       DECREASE QUANTITY
    ========================================================= */

    function decreaseQuantity(
        productId
    ) {
        setCartItems(
            (currentItems) =>
                currentItems.map(
                    (item) => {
                        if (
                            getProductId(
                                item
                            ) !==
                            productId
                        ) {
                            return item;
                        }


                        const currentQuantity =
                            Number(
                                item.cartQuantity
                            ) || 1;


                        return {
                            ...item,
                            cartQuantity:
                                Math.max(
                                    1,
                                    currentQuantity -
                                        1
                                ),
                        };
                    }
                )
        );
    }


    /* =========================================================
       MANUAL QUANTITY
    ========================================================= */

    function handleQuantityInput(
        productId,
        value
    ) {
        let quantity =
            Number.parseInt(
                value,
                10
            );


        if (
            !Number.isFinite(
                quantity
            ) ||
            quantity < 1
        ) {
            quantity = 1;
        }


        setCartItems(
            (currentItems) =>
                currentItems.map(
                    (item) => {
                        if (
                            getProductId(
                                item
                            ) !==
                            productId
                        ) {
                            return item;
                        }


                        const stock =
                            getAvailableStock(
                                item
                            );


                        if (
                            Number.isFinite(
                                stock
                            ) &&
                            quantity > stock
                        ) {
                            toast.error(
                                `Only ${stock} items are available.`
                            );

                            quantity =
                                Math.max(
                                    1,
                                    stock
                                );
                        }


                        return {
                            ...item,
                            cartQuantity:
                                quantity,
                        };
                    }
                )
        );
    }


    /* =========================================================
       REMOVE PRODUCT
    ========================================================= */

    function removeProduct(
        productId
    ) {
        /*
         * Find product before removing it so
         * the success message still contains
         * the product name.
         */
        const product =
            cartItems.find(
                (item) =>
                    getProductId(
                        item
                    ) ===
                    productId
            );


        /*
         * IMPORTANT:
         * Remove using the functional state update.
         *
         * The resulting cart is then automatically
         * saved by the cartItems useEffect above.
         */
        setCartItems(
            (currentItems) =>
                currentItems.filter(
                    (item) =>
                        getProductId(
                            item
                        ) !==
                        productId
                )
        );


        toast.success(
            `${
                product?.name ||
                "Product"
            } removed from cart.`
        );
    }


    /* =========================================================
       CLEAR CART
    ========================================================= */

    function clearCart() {
        if (
            cartItems.length === 0
        ) {
            toast.error(
                "Your cart is already empty."
            );

            return;
        }


        setCartItems([]);

        setDiscountRate(0);

        setPromoInput("");

        setPromoMessage("");

        setPromoSuccess(false);


        toast.success(
            "Cart cleared successfully."
        );
    }


    /* =========================================================
       SAVE FOR LATER
    ========================================================= */

    function saveForLater(
        product
    ) {
        const productId =
            getProductId(product);


        setSavedItems(
            (current) => {
                const exists =
                    current.some(
                        (item) =>
                            getProductId(
                                item
                            ) ===
                            productId
                    );


                if (exists) {
                    toast.error(
                        "Product is already saved."
                    );

                    return current;
                }


                toast.success(
                    `${
                        product.name ||
                        "Product"
                    } saved for later.`
                );


                return [
                    ...current,
                    {
                        ...product,
                        cartQuantity: 1,
                    },
                ];
            }
        );


        setSavedStatus(
            (current) => ({
                ...current,
                [productId]: true,
            })
        );
    }


    /* =========================================================
       APPLY PROMO
    ========================================================= */

    function applyPromo() {
        const code =
            promoInput
                .trim()
                .toUpperCase();


        if (!code) {
            setDiscountRate(0);

            setPromoMessage("");

            setPromoSuccess(false);


            toast.error(
                "Please enter a promo code."
            );

            return;
        }


        if (PROMO_CODES[code]) {
            const rate =
                PROMO_CODES[code];


            setDiscountRate(rate);


            setPromoMessage(
                `Code applied — ${Math.round(
                    rate * 100
                )}% off your order.`
            );


            setPromoSuccess(true);


            toast.success(
                `${code} applied successfully.`
            );


            return;
        }


        setDiscountRate(0);

        setPromoMessage(
            "That code isn't valid. Try again."
        );

        setPromoSuccess(false);


        toast.error(
            "Invalid promo code."
        );
    }


    /* =========================================================
       CHECKOUT
    ========================================================= */

    function handleCheckout() {
        if (
            cartItems.length === 0
        ) {
            toast.error(
                "Your cart is empty."
            );

            return;
        }


        toast.success(
            "Proceeding to checkout..."
        );


        navigate("/checkout");
    }


    /* =========================================================
       REV GAUGE
    ========================================================= */

    const [
        scrollProgress,
        setScrollProgress,
    ] = useState(0);


    useEffect(() => {
        const updateGauge = () => {
            const documentElement =
                document.documentElement;


            const maxScroll =
                documentElement
                    .scrollHeight -
                documentElement
                    .clientHeight;


            if (maxScroll <= 0) {
                setScrollProgress(0);

                return;
            }


            const scrolled =
                window.scrollY /
                maxScroll;


            setScrollProgress(
                Math.min(
                    Math.max(
                        scrolled,
                        0
                    ),
                    1
                ) * 100
            );
        };


        updateGauge();


        window.addEventListener(
            "scroll",
            updateGauge,
            {
                passive: true,
            }
        );


        window.addEventListener(
            "resize",
            updateGauge
        );


        return () => {
            window.removeEventListener(
                "scroll",
                updateGauge
            );

            window.removeEventListener(
                "resize",
                updateGauge
            );
        };
    }, []);


    /* =========================================================
       HERO TEXT
    ========================================================= */

    const heroText =
        cartItems.length > 0
            ? `${totals.count} ${
                  totals.count === 1
                      ? "item"
                      : "items"
              } ready for the garage.`
            : "Nothing parked here yet.";


    /* =========================================================
       PRODUCT IMAGE ERROR
    ========================================================= */

    const handleImageError =
        useCallback(
            (productId) => {
                setImageErrors(
                    (current) => ({
                        ...current,
                        [productId]:
                            true,
                    })
                );
            },
            []
        );


    /* =========================================================
       RETURN
    ========================================================= */

    return (
        <div
            className="
                min-h-screen
                overflow-x-hidden
                bg-[#F5F5DC]
                text-[#0A0A0A]
            "
        >

            {/* =====================================================
                GOOGLE FONTS + UI HELPERS
            ===================================================== */}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

                .metal-work {
                    font-family: 'Work Sans', sans-serif;
                }

                .metal-oswald {
                    font-family: 'Oswald', sans-serif;
                    text-transform: uppercase;
                    letter-spacing: .01em;
                    font-weight: 700;
                    line-height: 1.02;
                }

                .metal-mono {
                    font-family: 'JetBrains Mono', monospace;
                    letter-spacing: .04em;
                }

                .metal-selection::selection {
                    background: #FF8F00;
                    color: #0A0A0A;
                }

                .metal-ticks {
                    background: repeating-linear-gradient(
                        90deg,
                        rgba(10,10,10,.14) 0 1px,
                        transparent 1px 10px
                    );
                }

                .metal-hero-pattern {
                    background-image:
                        radial-gradient(
                            ellipse at 82% 20%,
                            rgba(255,143,0,.10),
                            transparent 55%
                        ),
                        repeating-linear-gradient(
                            115deg,
                            rgba(245,245,220,.025) 0 1px,
                            transparent 1px 64px
                        );
                }

                .metal-media-pattern {
                    background-image:
                        radial-gradient(
                            circle at 50% 30%,
                            rgba(255,143,0,.10),
                            transparent 60%
                        ),
                        repeating-linear-gradient(
                            45deg,
                            rgba(10,10,10,.03) 0 1px,
                            transparent 1px 18px
                        );
                }

                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }

                input[type="number"] {
                    -moz-appearance: textfield;
                }
            `}</style>


            <div className="metal-work metal-selection">

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <Header />


                {/* =====================================================
                    SIGNATURE REV GAUGE
                ===================================================== */}

                <div
                    aria-hidden="true"
                    className="
                        fixed
                        right-[22px]
                        top-1/2
                        z-[500]
                        hidden
                        h-[280px]
                        w-[34px]
                        -translate-y-1/2
                        flex-col
                        items-center
                        xl:flex
                    "
                >
                    <div
                        className="
                            relative
                            flex-1
                            w-[2px]
                            rounded-full
                            bg-black/15
                        "
                    >
                        <div
                            className="
                                absolute
                                left-[-4px]
                                top-0
                                h-[14%]
                                w-[10px]
                                opacity-50
                                [background:repeating-linear-gradient(45deg,#FF3B00_0_3px,transparent_3px_6px)]
                            "
                        />

                        <motion.div
                            className="
                                absolute
                                bottom-0
                                left-0
                                w-full
                                rounded-full
                                [background:linear-gradient(180deg,#FF3B00_0%,#FF8F00_35%,#FF8F00_100%)]
                            "
                            animate={{
                                height: `${scrollProgress}%`,
                            }}
                            transition={{
                                duration: 0.05,
                            }}
                        />

                        <motion.div
                            className="
                                absolute
                                left-1/2
                                h-4
                                w-4
                                -translate-x-1/2
                                translate-y-1/2
                                rounded-full
                                border-2
                                border-[#FF8F00]
                                bg-[#0A0A0A]
                            "
                            animate={{
                                bottom: `${scrollProgress}%`,
                            }}
                            transition={{
                                duration: 0.05,
                            }}
                        />
                    </div>

                    <div
                        className="
                            metal-mono
                            mt-[10px]
                            text-center
                            text-[10px]
                            text-[#0A0A0A]/60
                        "
                    >
                        RPM
                    </div>
                </div>


                {/* =====================================================
                    HERO
                ===================================================== */}

                <section
                    className="
                        metal-hero-pattern
                        relative
                        overflow-hidden
                        bg-[#0A0A0A]
                        px-5
                        py-[70px]
                        sm:px-10
                        lg:py-[95px]
                    "
                >
                    <div
                        className="
                            mx-auto
                            max-w-[1320px]
                        "
                    >
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 25,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.6,
                            }}
                        >
                            <div
                                className="
                                    metal-mono
                                    mb-4
                                    text-[10px]
                                    uppercase
                                    tracking-[0.2em]
                                    text-[#FF8F00]
                                "
                            >
                                GARAGE / CART
                            </div>

                            <h1
                                className="
                                    metal-oswald
                                    max-w-[800px]
                                    text-[46px]
                                    leading-none
                                    text-[#F5F5DC]
                                    sm:text-[64px]
                                    lg:text-[78px]
                                "
                            >
                                Your Garage
                            </h1>

                            <p
                                className="
                                    mt-5
                                    max-w-[560px]
                                    text-[14px]
                                    leading-6
                                    text-[#F5F5DC]/55
                                "
                            >
                                {heroText}
                            </p>
                        </motion.div>
                    </div>
                </section>


                {/* =====================================================
                    CART SECTION
                ===================================================== */}

                <section className="py-[70px] sm:py-[90px]">
                    <div
                        className="
                            mx-auto
                            max-w-[1320px]
                            px-5
                            sm:px-10
                        "
                    >

                        <AnimatePresence mode="wait">

                            {cartItems.length > 0 ? (

                                <motion.div
                                    key="cart"
                                    initial={{
                                        opacity: 0,
                                        y: 20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -20,
                                    }}
                                    className="
                                        grid
                                        gap-8
                                        lg:grid-cols-[1fr_390px]
                                    "
                                >

                                    {/* =================================================
                                        CART ITEMS
                                    ================================================= */}

                                    <div>

                                        <div
                                            className="
                                                mb-6
                                                flex
                                                items-center
                                                justify-between
                                                gap-4
                                            "
                                        >
                                            <div>
                                                <div
                                                    className="
                                                        metal-mono
                                                        mb-2
                                                        text-[10px]
                                                        uppercase
                                                        tracking-[0.16em]
                                                        text-[#FF8F00]
                                                    "
                                                >
                                                    CART ITEMS
                                                </div>

                                                <h2
                                                    className="
                                                        metal-oswald
                                                        text-[30px]
                                                    "
                                                >
                                                    {cartItems.length}{" "}
                                                    {cartItems.length ===
                                                    1
                                                        ? "Product"
                                                        : "Products"}
                                                </h2>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={
                                                    clearCart
                                                }
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    rounded-[2px]
                                                    border
                                                    border-black/10
                                                    px-4
                                                    py-2.5
                                                    text-[10px]
                                                    font-semibold
                                                    uppercase
                                                    tracking-[0.1em]
                                                    transition
                                                    hover:border-[#FF3B00]
                                                    hover:text-[#FF3B00]
                                                "
                                            >
                                                <Trash2
                                                    className="h-3.5 w-3.5"
                                                />

                                                Clear Cart
                                            </button>
                                        </div>


                                        <div className="space-y-4">

                                            {cartItems.map(
                                                (
                                                    item,
                                                    index
                                                ) => {
                                                    const productId =
                                                        getProductId(
                                                            item
                                                        );

                                                    const image =
                                                        getProductImage(
                                                            item
                                                        );

                                                    const quantity =
                                                        Number(
                                                            item.cartQuantity
                                                        ) || 1;

                                                    const price =
                                                        getProductPrice(
                                                            item
                                                        );

                                                    return (
                                                        <motion.article
                                                            key={
                                                                productId
                                                            }
                                                            initial={{
                                                                opacity: 0,
                                                                y: 15,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            transition={{
                                                                duration: 0.35,
                                                                delay:
                                                                    index *
                                                                    0.05,
                                                            }}
                                                            className="
                                                                overflow-hidden
                                                                rounded-[6px]
                                                                border
                                                                border-black/10
                                                                bg-[#F5F5DC]
                                                            "
                                                        >

                                                            <div className="flex flex-col sm:flex-row">

                                                                {/* IMAGE */}

                                                                <div
                                                                    className="
                                                                        flex
                                                                        h-[220px]
                                                                        w-full
                                                                        shrink-0
                                                                        items-center
                                                                        justify-center
                                                                        overflow-hidden
                                                                        bg-[#ECE8D6]
                                                                        sm:h-[210px]
                                                                        sm:w-[220px]
                                                                    "
                                                                >
                                                                    {image &&
                                                                    !imageErrors[
                                                                        productId
                                                                    ] ? (
                                                                        <img
                                                                            src={
                                                                                image
                                                                            }
                                                                            alt={
                                                                                item.name
                                                                            }
                                                                            onError={() =>
                                                                                handleImageError(
                                                                                    productId
                                                                                )
                                                                            }
                                                                            className="
                                                                                max-h-[190px]
                                                                                max-w-[90%]
                                                                                object-contain
                                                                                drop-shadow-[0_12px_18px_rgba(10,10,10,.18)]
                                                                            "
                                                                        />
                                                                    ) : (
                                                                        <div
                                                                            className="
                                                                                flex
                                                                                flex-col
                                                                                items-center
                                                                                gap-2
                                                                                text-black/20
                                                                            "
                                                                        >
                                                                            <ImageOff className="h-8 w-8" />

                                                                            <span className="metal-mono text-[9px] uppercase tracking-[0.1em]">
                                                                                Image unavailable
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>


                                                                {/* CONTENT */}

                                                                <div
                                                                    className="
                                                                        flex
                                                                        flex-1
                                                                        flex-col
                                                                        justify-between
                                                                        p-5
                                                                    "
                                                                >

                                                                    <div>

                                                                        <div
                                                                            className="
                                                                                metal-mono
                                                                                mb-2
                                                                                text-[9px]
                                                                                uppercase
                                                                                tracking-[0.12em]
                                                                                text-[#FF8F00]
                                                                            "
                                                                        >
                                                                            {item.series ||
                                                                                item.category ||
                                                                                "Collection"}
                                                                        </div>


                                                                        <h3
                                                                            className="
                                                                                mb-2
                                                                                text-[20px]
                                                                                font-semibold
                                                                            "
                                                                        >
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </h3>


                                                                        <div
                                                                            className="
                                                                                metal-mono
                                                                                text-[10px]
                                                                                uppercase
                                                                                tracking-[0.05em]
                                                                                text-black/40
                                                                            "
                                                                        >
                                                                            {item.scale ||
                                                                                "1:64"}{" "}
                                                                            SCALE
                                                                            {" — "}
                                                                            {item.productType ||
                                                                                item.vehicleType ||
                                                                                "DIE-CAST"}
                                                                        </div>

                                                                    </div>


                                                                    <div
                                                                        className="
                                                                            mt-6
                                                                            flex
                                                                            flex-wrap
                                                                            items-center
                                                                            justify-between
                                                                            gap-4
                                                                        "
                                                                    >

                                                                        {/* QUANTITY */}

                                                                        <div
                                                                            className="
                                                                                flex
                                                                                items-center
                                                                                overflow-hidden
                                                                                rounded-[3px]
                                                                                border
                                                                                border-black/10
                                                                            "
                                                                        >

                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    decreaseQuantity(
                                                                                        productId
                                                                                    )
                                                                                }
                                                                                className="
                                                                                    flex
                                                                                    h-9
                                                                                    w-9
                                                                                    items-center
                                                                                    justify-center
                                                                                    transition
                                                                                    hover:bg-black/5
                                                                                "
                                                                            >
                                                                                <Minus className="h-3.5 w-3.5" />
                                                                            </button>


                                                                            <input
                                                                                type="number"
                                                                                min="1"
                                                                                value={
                                                                                    quantity
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    handleQuantityInput(
                                                                                        productId,
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                                className="
                                                                                    h-9
                                                                                    w-12
                                                                                    border-x
                                                                                    border-black/10
                                                                                    bg-transparent
                                                                                    text-center
                                                                                    font-mono
                                                                                    text-[12px]
                                                                                    outline-none
                                                                                "
                                                                            />


                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    increaseQuantity(
                                                                                        productId
                                                                                    )
                                                                                }
                                                                                className="
                                                                                    flex
                                                                                    h-9
                                                                                    w-9
                                                                                    items-center
                                                                                    justify-center
                                                                                    transition
                                                                                    hover:bg-[#FF8F00]
                                                                                "
                                                                            >
                                                                                <PlusIcon />
                                                                            </button>

                                                                        </div>


                                                                        {/* PRICE */}

                                                                        <div className="text-right">

                                                                            <div
                                                                                className="
                                                                                    font-mono
                                                                                    text-[20px]
                                                                                    font-semibold
                                                                                "
                                                                            >
                                                                                {currency(
                                                                                    price *
                                                                                        quantity
                                                                                )}
                                                                            </div>


                                                                            <div
                                                                                className="
                                                                                    mt-1
                                                                                    text-[10px]
                                                                                    text-black/40
                                                                                "
                                                                            >
                                                                                {currency(
                                                                                    price
                                                                                )}{" "}
                                                                                each
                                                                            </div>

                                                                        </div>

                                                                    </div>


                                                                    {/* ACTIONS */}

                                                                    <div
                                                                        className="
                                                                            mt-4
                                                                            flex
                                                                            items-center
                                                                            justify-between
                                                                            border-t
                                                                            border-black/10
                                                                            pt-4
                                                                        "
                                                                    >

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                saveForLater(
                                                                                    item
                                                                                )
                                                                            }
                                                                            className="
                                                                                text-[10px]
                                                                                font-semibold
                                                                                uppercase
                                                                                tracking-[0.08em]
                                                                                text-black/50
                                                                                transition
                                                                                hover:text-[#FF8F00]
                                                                            "
                                                                        >
                                                                            {savedStatus[
                                                                                productId
                                                                            ]
                                                                                ? "Saved"
                                                                                : "Save for later"}
                                                                        </button>


                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                removeProduct(
                                                                                    productId
                                                                                )
                                                                            }
                                                                            className="
                                                                                inline-flex
                                                                                items-center
                                                                                gap-1.5
                                                                                text-[10px]
                                                                                font-semibold
                                                                                uppercase
                                                                                tracking-[0.08em]
                                                                                text-black/45
                                                                                transition
                                                                                hover:text-[#FF3B00]
                                                                            "
                                                                        >
                                                                            <Trash2 className="h-3.5 w-3.5" />
                                                                            Remove
                                                                        </button>

                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </motion.article>
                                                    );
                                                }
                                            )}

                                        </div>

                                    </div>


                                    {/* =================================================
                                        ORDER SUMMARY
                                    ================================================= */}

                                    <motion.aside
                                        initial={{
                                            opacity: 0,
                                            x: 20,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                        }}
                                        transition={{
                                            duration: 0.45,
                                        }}
                                        className="
                                            h-fit
                                            overflow-hidden
                                            rounded-[6px]
                                            bg-[#0A0A0A]
                                            text-[#F5F5DC]
                                            lg:sticky
                                            lg:top-6
                                        "
                                    >

                                        <div className="p-6">

                                            <div
                                                className="
                                                    metal-mono
                                                    mb-2
                                                    text-[9px]
                                                    uppercase
                                                    tracking-[0.16em]
                                                    text-[#FF8F00]
                                                "
                                            >
                                                GARAGE SUMMARY
                                            </div>


                                            <h2
                                                className="
                                                    metal-oswald
                                                    mb-6
                                                    text-[30px]
                                                "
                                            >
                                                Order Summary
                                            </h2>


                                            {/* PROMO */}

                                            <div className="mb-6">

                                                <div className="flex gap-2">

                                                    <input
                                                        type="text"
                                                        value={
                                                            promoInput
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setPromoInput(
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="PROMO CODE"
                                                        className="
                                                            min-w-0
                                                            flex-1
                                                            rounded-[2px]
                                                            border
                                                            border-[#F5F5DC]/15
                                                            bg-transparent
                                                            px-3
                                                            py-3
                                                            font-mono
                                                            text-[10px]
                                                            uppercase
                                                            tracking-[0.08em]
                                                            text-[#F5F5DC]
                                                            outline-none
                                                            placeholder:text-[#F5F5DC]/25
                                                            focus:border-[#FF8F00]
                                                        "
                                                    />


                                                    <button
                                                        type="button"
                                                        onClick={
                                                            applyPromo
                                                        }
                                                        className="
                                                            rounded-[2px]
                                                            bg-[#FF8F00]
                                                            px-4
                                                            py-3
                                                            text-[10px]
                                                            font-semibold
                                                            uppercase
                                                            tracking-[0.08em]
                                                            text-[#0A0A0A]
                                                            transition
                                                            hover:bg-[#FFA733]
                                                        "
                                                    >
                                                        Apply
                                                    </button>

                                                </div>


                                                {promoMessage && (
                                                    <p
                                                        className={`
                                                            mt-2
                                                            text-[10px]
                                                            ${
                                                                promoSuccess
                                                                    ? "text-[#FF8F00]"
                                                                    : "text-[#FF3B00]"
                                                            }
                                                        `}
                                                    >
                                                        {
                                                            promoMessage
                                                        }
                                                    </p>
                                                )}

                                            </div>


                                            {/* TOTALS */}

                                            <div className="space-y-3 border-t border-[#F5F5DC]/10 pt-5">

                                                <div className="flex justify-between text-[12px] text-[#F5F5DC]/55">
                                                    <span>
                                                        Subtotal
                                                    </span>

                                                    <span className="font-mono">
                                                        {currency(
                                                            totals.subtotal
                                                        )}
                                                    </span>
                                                </div>


                                                {totals.discount >
                                                    0 && (
                                                    <div className="flex justify-between text-[12px] text-[#FF8F00]">
                                                        <span>
                                                            Discount
                                                        </span>

                                                        <span className="font-mono">
                                                            -
                                                            {currency(
                                                                totals.discount
                                                            )}
                                                        </span>
                                                    </div>
                                                )}


                                                {/* SHIPPING REMOVED */}


                                                <div className="flex justify-between text-[12px] text-[#F5F5DC]/55">
                                                    <span>
                                                        Tax
                                                    </span>

                                                    <span className="font-mono">
                                                        {currency(
                                                            totals.tax
                                                        )}
                                                    </span>
                                                </div>

                                            </div>


                                            {/* GRAND TOTAL */}

                                            <div
                                                className="
                                                    mt-6
                                                    border-t
                                                    border-[#F5F5DC]/10
                                                    pt-5
                                                "
                                            >

                                                <div className="flex items-end justify-between">

                                                    <span
                                                        className="
                                                            metal-oswald
                                                            text-[20px]
                                                        "
                                                    >
                                                        Total
                                                    </span>


                                                    <span
                                                        className="
                                                            font-mono
                                                            text-[26px]
                                                            font-semibold
                                                            text-[#FF8F00]
                                                        "
                                                    >
                                                        {currency(
                                                            totals.total
                                                        )}
                                                    </span>

                                                </div>

                                            </div>


                                            {/* CHECKOUT */}

                                            <button
                                                type="button"
                                                onClick={
                                                    handleCheckout
                                                }
                                                className="
                                                    mt-6
                                                    flex
                                                    w-full
                                                    items-center
                                                    justify-center
                                                    gap-2.5
                                                    rounded-[2px]
                                                    bg-[#FF8F00]
                                                    px-5
                                                    py-4
                                                    text-[12px]
                                                    font-semibold
                                                    uppercase
                                                    tracking-[0.1em]
                                                    text-[#0A0A0A]
                                                    transition
                                                    hover:bg-[#FFA733]
                                                    hover:shadow-[0_10px_30px_rgba(255,143,0,.2)]
                                                "
                                            >
                                                Proceed to Checkout

                                                <ArrowRight className="h-4 w-4" />
                                            </button>


                                            {/* SECURITY */}

                                            <div
                                                className="
                                                    mt-5
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-[10px]
                                                    text-[#F5F5DC]/35
                                                "
                                            >
                                                <ShieldCheck className="h-4 w-4" />

                                                Secure checkout
                                            </div>


                                            {/* PAYMENT */}

                                            <div className="mt-5 flex flex-wrap gap-1.5">

                                                {[
                                                    "VISA",
                                                    "MASTERCARD",
                                                    "AMEX",
                                                    "PAYPAL",
                                                ].map(
                                                    (
                                                        payment
                                                    ) => (
                                                        <span
                                                            key={
                                                                payment
                                                            }
                                                            className="
                                                                metal-mono
                                                                rounded-[2px]
                                                                border
                                                                border-[#F5F5DC]/15
                                                                px-[9px]
                                                                py-[5px]
                                                                text-[9.5px]
                                                                tracking-[0.06em]
                                                                text-[#F5F5DC]/50
                                                            "
                                                        >
                                                            {
                                                                payment
                                                            }
                                                        </span>
                                                    )
                                                )}

                                            </div>

                                        </div>

                                    </motion.aside>

                                </motion.div>

                            ) : (

                                /* =====================================================
                                   EMPTY CART
                                ===================================================== */

                                <motion.div
                                    key="empty"
                                    initial={{
                                        opacity: 0,
                                        y: 20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                    }}
                                    className="
                                        py-[70px]
                                        pb-[90px]
                                        text-center
                                    "
                                >

                                    <motion.div
                                        initial={{
                                            scale: 0.8,
                                            opacity: 0,
                                        }}
                                        animate={{
                                            scale: 1,
                                            opacity: 1,
                                        }}
                                        transition={{
                                            duration: 0.4,
                                        }}
                                        className="
                                            mx-auto
                                            mb-[26px]
                                            flex
                                            h-[74px]
                                            w-[74px]
                                            items-center
                                            justify-center
                                            rounded-full
                                            border
                                            border-black/10
                                            bg-black/5
                                        "
                                    >
                                        <ShoppingCart
                                            className="
                                                h-9
                                                w-9
                                                text-black/20
                                            "
                                            strokeWidth={1.4}
                                        />
                                    </motion.div>


                                    <h2
                                        className="
                                            metal-oswald
                                            mb-[10px]
                                            text-[26px]
                                        "
                                    >
                                        Your garage is empty
                                    </h2>


                                    <p
                                        className="
                                            mx-auto
                                            mb-7
                                            max-w-[400px]
                                            text-[14px]
                                            leading-[1.6]
                                            text-black/55
                                        "
                                    >
                                        Nothing parked here
                                        yet. Browse the full
                                        catalog and find the
                                        next casting for your
                                        collection.
                                    </p>


                                    <motion.button
                                        type="button"
                                        whileHover={{
                                            y: -2,
                                        }}
                                        whileTap={{
                                            scale: 0.98,
                                        }}
                                        onClick={() =>
                                            navigate("/products")
                                        }
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2.5
                                            rounded-[2px]
                                            bg-[#FF8F00]
                                            px-[30px]
                                            py-4
                                            text-[13px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.1em]
                                            text-[#0A0A0A]
                                            transition-all
                                            duration-200
                                            hover:bg-[#FFA733]
                                            hover:shadow-[0_10px_24px_rgba(255,143,0,.25)]
                                        "
                                    >
                                        Shop the Garage

                                        <ArrowRight
                                            className="h-4 w-4"
                                            strokeWidth={1.8}
                                        />
                                    </motion.button>

                                </motion.div>

                            )}

                        </AnimatePresence>

                    </div>
                </section>


                {/* =====================================================
                    COMPLETE THE COLLECTION
                ===================================================== */}

                <section className="pb-[100px]">

                    <div
                        className="
                            mx-auto
                            max-w-[1320px]
                            px-5
                            sm:px-10
                        "
                    >

                        {/* SECTION TITLE */}

                        <div
                            className="
                                mb-[26px]
                                flex
                                items-center
                                gap-[6px]
                            "
                        >

                            <span
                                className="
                                    metal-mono
                                    whitespace-nowrap
                                    text-[11px]
                                    tracking-[0.18em]
                                    text-[#FF8F00]
                                "
                            >
                                COMPLETE THE COLLECTION
                            </span>


                            <span
                                className="
                                    metal-ticks
                                    h-2
                                    flex-1
                                "
                            />

                        </div>


                        {/* =================================================
                            RANDOM 4 PRODUCTS USING PRODUCT CARD
                        ================================================= */}

                        {isCollectionLoading ? (

                            <div
                                className="
                                    flex
                                    min-h-[250px]
                                    items-center
                                    justify-center
                                "
                            >

                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: 10,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    className="text-center"
                                >

                                    <div
                                        className="
                                            mx-auto
                                            mb-4
                                            h-10
                                            w-10
                                            animate-spin
                                            rounded-full
                                            border-2
                                            border-black/10
                                            border-t-[#FF8F00]
                                        "
                                    />

                                    <p
                                        className="
                                            metal-mono
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.15em]
                                            text-black/45
                                        "
                                    >
                                        Loading Collection
                                    </p>

                                </motion.div>

                            </div>

                        ) : collectionProducts.length >
                          0 ? (

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-5
                                    sm:grid-cols-2
                                    lg:grid-cols-3
                                    xl:grid-cols-4
                                "
                            >

                                {collectionProducts.map(
                                    (
                                        product,
                                        index
                                    ) => {

                                        const productId =
                                            getProductId(
                                                product
                                            );

                                        return (
                                            <motion.div
                                                key={
                                                    productId ||
                                                    index
                                                }
                                                initial={{
                                                    opacity: 0,
                                                    y: 25,
                                                }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                viewport={{
                                                    once: true,
                                                    amount: 0.1,
                                                }}
                                                transition={{
                                                    duration: 0.4,
                                                    delay:
                                                        index *
                                                        0.06,
                                                }}
                                            >

                                                <ProdcutCard
                                                    product={
                                                        product
                                                    }
                                                />

                                            </motion.div>
                                        );
                                    }
                                )}

                            </div>

                        ) : (

                            <motion.div
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                }}
                                className="
                                    rounded-[6px]
                                    border
                                    border-black/10
                                    bg-black/5
                                    px-6
                                    py-16
                                    text-center
                                "
                            >

                                <ShoppingCart
                                    className="
                                        mx-auto
                                        mb-4
                                        h-9
                                        w-9
                                        text-black/20
                                    "
                                    strokeWidth={1.3}
                                />


                                <h3
                                    className="
                                        metal-oswald
                                        text-[24px]
                                    "
                                >
                                    Collection unavailable
                                </h3>


                                <p
                                    className="
                                        mt-2
                                        text-[13px]
                                        text-black/45
                                    "
                                >
                                    We couldn't load the
                                    collection right now.
                                </p>

                            </motion.div>

                        )}

                    </div>

                </section>


                {/* =====================================================
                    FOOTER
                ===================================================== */}

                <Footer />

            </div>

        </div>
    );
}


/* =========================================================
   SMALL PLUS ICON
========================================================= */

function PlusIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    );
}