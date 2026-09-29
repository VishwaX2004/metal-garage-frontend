import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    Heart,
    Minus,
    Plus,
    ShoppingBag,
    ChevronLeft,
    ChevronRight,
    Check,
    Package,
    ShieldCheck,
    RotateCcw,
    ArrowLeft,
    ImageOff,
    Truck,
    Sparkles,
} from "lucide-react";

import Header from "../components/header";
import Footer from "../components/footer";
import { Loader } from "../components/loader";

const CART_STORAGE_KEY = "cart";
const DEFAULT_HEADER_HEIGHT = 80;

export default function ProductOverview() {
    const { productID } = useParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState("Loading");
    const [product, setProduct] = useState(null);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const [headerHeight, setHeaderHeight] = useState(DEFAULT_HEADER_HEIGHT);
    const [headerFixed, setHeaderFixed] = useState(false);

    // =========================================================
    // SCROLL TO TOP (on page load / product change)
    // =========================================================

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [productID]);

    // =========================================================
    // MEASURE HEADER SO THE CARD FITS THE REMAINING SCREEN
    // =========================================================

    useEffect(() => {
        const headerElement = document.querySelector("header");

        if (!headerElement) return;

        const measure = () => {
            const rect = headerElement.getBoundingClientRect();
            const position =
                window.getComputedStyle(headerElement).position;

            setHeaderHeight(Math.round(rect.height) || DEFAULT_HEADER_HEIGHT);
            setHeaderFixed(position === "fixed");
        };

        measure();

        let observer = null;

        if (typeof ResizeObserver !== "undefined") {
            observer = new ResizeObserver(measure);
            observer.observe(headerElement);
        }

        window.addEventListener("resize", measure);

        return () => {
            if (observer) observer.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, [status]);

    // =========================================================
    // FETCH PRODUCT
    // =========================================================

    useEffect(() => {
        if (!productID) {
            setStatus("Error");
            toast.error("Product ID is missing.");
            return;
        }

        const fetchProduct = async () => {
            try {
                setStatus("Loading");

                const apiUrl = import.meta.env.VITE_API_URL;

                if (!apiUrl) {
                    throw new Error("VITE_API_URL is not configured.");
                }

                const response = await axios.get(
                    `${apiUrl}/api/products/${encodeURIComponent(productID)}`
                );

                const fetchedProduct = response?.data?.product;

                if (!fetchedProduct) {
                    throw new Error("Product not found.");
                }

                setProduct(fetchedProduct);
                setSelectedImage(0);
                setQuantity(1);
                setImageError(false);
                setStatus("Success");
            } catch (error) {
                console.error("Error fetching product:", error);

                setProduct(null);
                setStatus("Error");

                if (error?.response?.status === 404) {
                    toast.error("Product not found.");
                } else if (
                    error?.message === "VITE_API_URL is not configured."
                ) {
                    toast.error("API URL is not configured.");
                } else {
                    toast.error("Error fetching product data.");
                }
            }
        };

        fetchProduct();
    }, [productID]);

    // =========================================================
    // SHARED LAYOUT VALUES
    // =========================================================

    const layoutStyle = {
        "--mg-header": `${headerHeight}px`,
        paddingTop: headerFixed ? `${headerHeight}px` : 0,
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (status === "Loading") {
        return (
            <div
                className="min-h-screen bg-[#F5F5DC] text-[#0A0A0A]"
                style={layoutStyle}
            >
                <Header />

                <main
                    className="flex items-center justify-center px-5"
                    style={{
                        minHeight: `calc(100dvh - ${headerHeight}px)`,
                    }}
                >
                    <div className="text-center">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#0A0A0A] text-[#FF8F00] shadow-xl">
                            <Package size={26} strokeWidth={1.6} />
                        </div>

                        <p className="mb-4 font-mono text-xs font-bold tracking-[.18em] text-[#B35F00]">
                            Metal Garage · Loading product
                        </p>

                        <Loader />
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (status === "Error" || !product) {
        return (
            <div
                className="min-h-screen bg-[#F5F5DC] text-[#0A0A0A]"
                style={layoutStyle}
            >
                <Header />

                <main
                    className="flex items-center justify-center px-5"
                    style={{
                        minHeight: `calc(100dvh - ${headerHeight}px)`,
                    }}
                >
                    <div className="w-full max-w-xl text-center">
                        <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-[#0A0A0A] text-[#FF8F00] shadow-2xl">
                            <Package size={34} strokeWidth={1.5} />
                        </div>

                        <p className="mb-3 font-mono text-xs font-black tracking-[.18em] text-[#B35F00]">
                            Metal Garage · Error 404
                        </p>

                        <h1 className="font-['Oswald',sans-serif] text-5xl font-bold uppercase leading-[.95] sm:text-6xl">
                            PRODUCT
                            <br />
                            NOT FOUND
                        </h1>

                        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-black/70">
                            We couldn't find the die-cast model you're
                            looking for.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="mt-8 inline-flex items-center gap-3 rounded-[4px] bg-[#0A0A0A] px-7 py-4 font-mono text-xs font-black uppercase tracking-[.14em] text-[#F5F5DC] transition-all hover:-translate-y-1 hover:bg-[#FF8F00] hover:text-[#0A0A0A]"
                        >
                            <ArrowLeft size={16} />
                            Go Back
                        </button>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    // =========================================================
    // PRODUCT DATA
    // =========================================================

    const images = Array.isArray(product.images)
        ? product.images.filter(
              (image) =>
                  typeof image === "string" && image.trim() !== ""
          )
        : [];

    const productPrice = Number(product.price) || 0;
    const labelledPrice = Number(product.labelledPrice) || 0;

    const stockQuantity = Number(product.quantity);
    const hasValidStock = Number.isFinite(stockQuantity);

    const isOutOfStock = hasValidStock
        ? stockQuantity <= 0
        : product.inStock === false ||
          product.status === "Out of Stock";

    const isSale =
        labelledPrice > productPrice && labelledPrice > 0;

    const discountPercentage = isSale
        ? Math.round(
              ((labelledPrice - productPrice) / labelledPrice) * 100
          )
        : 0;

    const savings = isSale
        ? labelledPrice - productPrice
        : 0;

    // =========================================================
    // INFORMATION
    // =========================================================

    const category = product.category || "Die-Cast Collection";
    const productType = product.productType || "Single Car";
    const scale = product.scale || "1:64";
    const condition = product.condition || "New";
    const packaging = product.packaging || "Carded";
    const series = product.series || "Metal Garage Collection";
    const casting = product.casting || "—";
    const manufacturer = product.manufacturer || "Hot Wheels";
    const model = product.model || "—";
    const vehicleType = product.vehicleType || "Die-Cast";
    const year = product.year || "—";

    // =========================================================
    // IMAGE NAVIGATION
    // =========================================================

    const previousImage = () => {
        if (images.length <= 1) return;

        setImageError(false);

        setSelectedImage((current) =>
            current === 0 ? images.length - 1 : current - 1
        );
    };

    const nextImage = () => {
        if (images.length <= 1) return;

        setImageError(false);

        setSelectedImage((current) =>
            current === images.length - 1 ? 0 : current + 1
        );
    };

    const selectImage = (index) => {
        if (index < 0 || index >= images.length) return;

        setSelectedImage(index);
        setImageError(false);
    };

    // =========================================================
    // QUANTITY
    // =========================================================

    const decreaseQuantity = () => {
        setQuantity((current) =>
            current > 1 ? current - 1 : 1
        );
    };

    const increaseQuantity = () => {
        if (isOutOfStock) return;

        if (
            hasValidStock &&
            quantity >= stockQuantity
        ) {
            toast.error(
                `Only ${stockQuantity} ${
                    stockQuantity === 1 ? "item" : "items"
                } available.`
            );

            return;
        }

        setQuantity((current) => current + 1);
    };

    // =========================================================
    // PRODUCT ID
    // =========================================================

    const getProductId = () => {
        return (
            product.productID ||
            product._id ||
            product.id ||
            product.sku ||
            product.name
        );
    };

    // =========================================================
    // CART
    // =========================================================

    const getStoredCart = () => {
        try {
            const storedCart =
                localStorage.getItem(CART_STORAGE_KEY);

            if (!storedCart) return [];

            const parsed = JSON.parse(storedCart);

            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("Invalid cart data:", error);
            return [];
        }
    };

    const handleAddToCart = () => {
        if (isAdding) return;

        if (isOutOfStock) {
            toast.error("This product is out of stock.");
            return;
        }

        const productId = getProductId();

        if (!productId) {
            toast.error(
                "Unable to add product. Product ID is missing."
            );
            return;
        }

        if (
            hasValidStock &&
            quantity > stockQuantity
        ) {
            toast.error(
                `Only ${stockQuantity} ${
                    stockQuantity === 1 ? "item" : "items"
                } available.`
            );

            return;
        }

        try {
            const cart = getStoredCart();

            const existingIndex = cart.findIndex((item) => {
                const itemId =
                    item?.productID ||
                    item?._id ||
                    item?.id ||
                    item?.sku ||
                    item?.name;

                return String(itemId) === String(productId);
            });

            if (existingIndex !== -1) {
                const existingItem = cart[existingIndex];

                const currentQuantity =
                    Number(existingItem?.cartQuantity) || 1;

                const newQuantity =
                    currentQuantity + quantity;

                if (
                    hasValidStock &&
                    newQuantity > stockQuantity
                ) {
                    toast.error(
                        `Only ${stockQuantity} ${
                            stockQuantity === 1
                                ? "item"
                                : "items"
                        } available.`
                    );

                    return;
                }

                cart[existingIndex] = {
                    ...existingItem,
                    ...product,
                    productID:
                        product.productID || productId,
                    cartQuantity: newQuantity,
                    stockQuantity: hasValidStock
                        ? stockQuantity
                        : existingItem.stockQuantity,
                };
            } else {
                cart.push({
                    ...product,
                    productID:
                        product.productID || productId,
                    cartQuantity: quantity,
                    stockQuantity: hasValidStock
                        ? stockQuantity
                        : null,
                });
            }

            localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify(cart)
            );

            window.dispatchEvent(
                new CustomEvent("cartUpdated", {
                    detail: cart,
                })
            );

            window.dispatchEvent(
                new CustomEvent("addToCart", {
                    detail: {
                        product,
                        quantity,
                    },
                })
            );

            setIsAdding(true);

            toast.success(
                `${product.name} added to cart!`
            );

            setTimeout(() => {
                setIsAdding(false);
            }, 700);
        } catch (error) {
            console.error("Add to cart error:", error);

            toast.error(
                "Something went wrong while adding the product."
            );

            setIsAdding(false);
        }
    };

    // =========================================================
    // WISHLIST
    // =========================================================

    const handleWishlist = () => {
        const newState = !isWishlisted;

        setIsWishlisted(newState);

        toast.success(
            newState
                ? "Added to wishlist"
                : "Removed from wishlist"
        );
    };

    // =========================================================
    // PAGE
    // =========================================================

    return (
        <div
            className="min-h-screen w-full overflow-x-hidden bg-[#F5F5DC] text-[#0A0A0A]"
            style={layoutStyle}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Work+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

                html {
                    scroll-behavior: smooth;
                }

                ::selection {
                    background: #FF8F00;
                    color: #0A0A0A;
                }

                .mg-display {
                    font-family: 'Oswald', sans-serif;
                    text-transform: uppercase;
                    font-weight: 700;
                    letter-spacing: .01em;
                    line-height: 1;
                }

                .mg-mono {
                    font-family: 'JetBrains Mono', monospace;
                }

                .mg-body {
                    font-family: 'Work Sans', sans-serif;
                }

                .mg-grid {
                    background-image:
                        linear-gradient(
                            rgba(10,10,10,.045) 1px,
                            transparent 1px
                        ),
                        linear-gradient(
                            90deg,
                            rgba(10,10,10,.045) 1px,
                            transparent 1px
                        );

                    background-size: 30px 30px;
                }

                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes imageIn {
                    from {
                        opacity: 0;
                        transform: scale(1.03);
                    }

                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes shine {
                    from {
                        transform: translateX(-120%) skewX(-20deg);
                    }

                    to {
                        transform: translateX(240%) skewX(-20deg);
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: .45;
                    }

                    50% {
                        opacity: 1;
                    }
                }

                .mg-page {
                    animation: fadeUp .55s cubic-bezier(.22,1,.36,1);
                }

                .mg-image {
                    animation: imageIn .45s cubic-bezier(.22,1,.36,1);
                }

                .mg-pulse {
                    animation: pulse 2s ease-in-out infinite;
                }

                .mg-button {
                    position: relative;
                    overflow: hidden;
                }

                .mg-button::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -120%;
                    width: 60%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255,255,255,.25),
                        transparent
                    );
                    pointer-events: none;
                }

                .mg-button:hover::before {
                    animation: shine .7s ease;
                }

                .mg-spec {
                    transition:
                        border-color .2s ease,
                        background-color .2s ease;
                }

                .mg-spec:hover {
                    border-color: rgba(255,143,0,.45);
                    background: rgba(255,143,0,.07);
                }

                .mg-scroll::-webkit-scrollbar {
                    width: 6px;
                    height: 4px;
                }

                .mg-scroll::-webkit-scrollbar-thumb {
                    background: rgba(10,10,10,.22);
                    border-radius: 999px;
                }

                button:focus-visible,
                a:focus-visible {
                    outline: 2px solid #FF8F00;
                    outline-offset: 2px;
                }

                @media (prefers-reduced-motion: reduce) {
                    *,
                    *::before,
                    *::after {
                        animation-duration: .01ms !important;
                        animation-iteration-count: 1 !important;
                        scroll-behavior: auto !important;
                    }
                }
            `}</style>

            <Header />

            <main className="mg-page mg-body">

                {/* =================================================
                    PRODUCT CARD (fits the screen below the header)
                ================================================= */}

                <section className="mx-auto w-full max-w-[1400px] px-3 py-3 sm:px-5 lg:px-6">

                    <div className="flex flex-col overflow-hidden rounded-[6px] border border-black/15 bg-[#F5F5DC] shadow-[0_20px_70px_rgba(10,10,10,.12)] lg:h-[calc(100dvh-var(--mg-header)-24px)] lg:min-h-[540px]">

                        {/* TOP BAR: BREADCRUMB + PRODUCT ID */}

                        <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-[#0A0A0A] px-4 py-3 text-[#F5F5DC] sm:px-6">

                            <nav
                                aria-label="Breadcrumb"
                                className="flex min-w-0 items-center gap-2"
                            >
                                <span className="mg-pulse h-2.5 w-2.5 shrink-0 rounded-full bg-[#FF8F00]" />

                                <Link
                                    to="/"
                                    className="mg-mono shrink-0 text-xs font-semibold text-white/75 transition-colors hover:text-[#FF8F00]"
                                >
                                    Home
                                </Link>

                                <span className="text-white/40">/</span>

                                <Link
                                    to="/product"
                                    className="mg-mono shrink-0 text-xs font-semibold text-white/75 transition-colors hover:text-[#FF8F00]"
                                >
                                    Collection
                                </Link>

                                <span className="text-white/40">/</span>

                                <span className="mg-mono truncate text-xs font-semibold text-[#F5F5DC]">
                                    {product.name}
                                </span>
                            </nav>

                            <span className="mg-mono text-xs text-white/60">
                                ID: {product.productID}
                            </span>
                        </div>

                        {/* MAIN CONTENT */}

                        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1.05fr_.95fr]">

                            {/* =================================================
                                IMAGE SECTION
                            ================================================= */}

                            <div className="flex min-h-0 flex-col border-b border-black/10 p-4 sm:p-6 lg:border-b-0 lg:border-r lg:p-6">

                                <div className="mb-3 flex shrink-0 items-center gap-3">
                                    <span className="mg-mono text-xs font-bold text-[#B35F00]">
                                        Product preview
                                    </span>

                                    <div className="h-px flex-1 bg-black/15" />

                                    <span className="mg-mono text-xs font-semibold text-black/60">
                                        Scale {scale}
                                    </span>
                                </div>

                                <div className="relative mx-auto aspect-square w-full max-w-[640px] overflow-hidden rounded-[4px] border border-black/15 bg-[#ECE8D6] shadow-[0_16px_45px_rgba(10,10,10,.08)] lg:aspect-auto lg:max-w-none lg:min-h-0 lg:flex-1">

                                    <div className="mg-grid pointer-events-none absolute inset-0 opacity-70" />

                                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,143,0,.12),transparent_55%)]" />

                                    {isSale && (
                                        <div className="mg-mono absolute left-3 top-3 z-30 bg-[#FF8F00] px-3 py-2 text-xs font-black uppercase tracking-[.06em] text-[#0A0A0A] shadow-lg">
                                            Sale · -{discountPercentage}%
                                        </div>
                                    )}

                                    {!isSale && product.featured && (
                                        <div className="mg-mono absolute left-3 top-3 z-30 bg-[#FF3B00] px-3 py-2 text-xs font-black uppercase tracking-[.06em] text-[#F5F5DC] shadow-lg">
                                            Featured
                                        </div>
                                    )}

                                    {isOutOfStock && (
                                        <div className="mg-mono absolute left-3 top-3 z-40 bg-[#0A0A0A]/90 px-3 py-2 text-xs font-black uppercase tracking-[.06em] text-[#F5F5DC] shadow-lg">
                                            Sold out
                                        </div>
                                    )}

                                    {/* WISHLIST */}

                                    <button
                                        type="button"
                                        onClick={handleWishlist}
                                        aria-label={
                                            isWishlisted
                                                ? "Remove from wishlist"
                                                : "Add to wishlist"
                                        }
                                        className={`absolute right-3 top-3 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-black/15 bg-[#F5F5DC]/95 text-[#0A0A0A] shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0A0A0A] hover:text-[#FF8F00] ${
                                            isWishlisted
                                                ? "bg-[#0A0A0A] text-[#FF8F00]"
                                                : ""
                                        }`}
                                    >
                                        <Heart
                                            size={20}
                                            strokeWidth={1.8}
                                            fill={
                                                isWishlisted
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                        />
                                    </button>

                                    {/* PRODUCT IMAGE */}

                                    {images.length > 0 &&
                                    images[selectedImage] &&
                                    !imageError ? (
                                        <img
                                            key={`${selectedImage}-${images[selectedImage]}`}
                                            src={images[selectedImage]}
                                            alt={product.name}
                                            onError={() =>
                                                setImageError(true)
                                            }
                                            className={`mg-image relative z-10 h-full w-full object-contain p-6 transition-transform duration-700 hover:scale-[1.03] sm:p-10 lg:p-8 ${
                                                isOutOfStock
                                                    ? "grayscale-[.7] opacity-55"
                                                    : ""
                                            }`}
                                        />
                                    ) : (
                                        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-3 text-black/50">
                                            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-black/15 bg-black/[.04]">
                                                <ImageOff
                                                    size={30}
                                                    strokeWidth={1.4}
                                                />
                                            </div>

                                            <span className="mg-mono text-xs font-bold">
                                                Image unavailable
                                            </span>
                                        </div>
                                    )}

                                    {/* IMAGE COUNTER */}

                                    <div className="absolute bottom-3 right-3 z-20">
                                        <span className="mg-mono rounded-[3px] bg-[#0A0A0A]/80 px-3 py-1.5 text-xs font-bold text-[#F5F5DC] backdrop-blur-md">
                                            {selectedImage + 1} /{" "}
                                            {Math.max(images.length, 1)}
                                        </span>
                                    </div>

                                    {/* PREVIOUS */}

                                    {images.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={previousImage}
                                            aria-label="Previous image"
                                            className="absolute left-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/15 bg-[#F5F5DC]/95 text-black shadow-lg transition-all hover:scale-105 hover:bg-[#FF8F00]"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                    )}

                                    {/* NEXT */}

                                    {images.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={nextImage}
                                            aria-label="Next image"
                                            className="absolute right-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/15 bg-[#F5F5DC]/95 text-black shadow-lg transition-all hover:scale-105 hover:bg-[#FF8F00]"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    )}
                                </div>

                                {/* THUMBNAILS */}

                                {images.length > 1 && (
                                    <div className="mg-scroll mx-auto mt-3 flex w-full max-w-[640px] shrink-0 gap-2.5 overflow-x-auto pb-1 lg:max-w-none">
                                        {images.map((image, index) => (
                                            <button
                                                key={`${image}-${index}`}
                                                type="button"
                                                onClick={() =>
                                                    selectImage(index)
                                                }
                                                aria-label={`View image ${index + 1}`}
                                                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-[3px] border bg-[#ECE8D6] transition-all duration-300 sm:h-[70px] sm:w-[70px] ${
                                                    selectedImage === index
                                                        ? "border-[#FF8F00] ring-2 ring-[#FF8F00]/30"
                                                        : "border-black/15 opacity-70 hover:border-black/40 hover:opacity-100"
                                                }`}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${product.name} ${index + 1}`}
                                                    className="h-full w-full object-contain p-1.5"
                                                    onError={(event) => {
                                                        event.currentTarget.style.display =
                                                            "none";
                                                    }}
                                                />

                                                {selectedImage === index && (
                                                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FF8F00]" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* =================================================
                                DETAILS
                            ================================================= */}

                            <div className="mg-scroll flex min-h-0 flex-col gap-4 p-5 sm:p-7 lg:overflow-y-auto lg:p-6 xl:p-8">

                                {/* CATEGORY */}

                                <div className="flex flex-wrap items-center gap-2.5">
                                    <span className="mg-mono text-xs font-black uppercase tracking-[.1em] text-[#B35F00]">
                                        {category}
                                    </span>

                                    <span className="h-1.5 w-1.5 rounded-full bg-black/30" />

                                    <span className="mg-mono text-xs font-semibold text-black/65">
                                        {productType}
                                    </span>
                                </div>

                                {/* TITLE */}

                                <h1 className="mg-display -mt-1 max-w-[700px] text-[clamp(30px,3.4vw,50px)] text-[#080808]">
                                    {product.name}
                                </h1>

                                {/* PRICE CARD */}

                                <div className="rounded-[5px] border border-black/15 bg-white/50 px-5 py-4">

                                    <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
                                        <span className="mg-mono text-3xl font-black tracking-[-.04em] text-[#0A0A0A] sm:text-4xl">
                                            Rs.{" "}
                                            {productPrice.toLocaleString()}
                                        </span>

                                        {isSale && (
                                            <span className="mg-mono pb-1 text-base font-bold text-black/50 line-through">
                                                Rs.{" "}
                                                {labelledPrice.toLocaleString()}
                                            </span>
                                        )}
                                    </div>

                                    {isSale && (
                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                            <Sparkles
                                                size={15}
                                                className="text-[#FF8F00]"
                                            />

                                            <span className="mg-mono text-xs font-black text-[#8A4800]">
                                                You save Rs.{" "}
                                                {savings.toLocaleString()}
                                            </span>

                                            <span className="text-black/30">
                                                /
                                            </span>

                                            <span className="mg-mono text-xs font-black text-[#8A4800]">
                                                {discountPercentage}% off
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* DESCRIPTION */}

                                <div>
                                    <p className="mg-mono mb-1.5 text-xs font-black text-black/70">
                                        About this model
                                    </p>

                                    <p className="max-w-[680px] text-[15px] font-medium leading-7 text-black/80">
                                        {product.description ||
                                            "A premium die-cast model prepared for your Metal Garage collection."}
                                    </p>
                                </div>

                                {/* STOCK */}

                                <div
                                    className={`flex flex-wrap items-center justify-between gap-3 rounded-[5px] border px-4 py-3 ${
                                        isOutOfStock
                                            ? "border-red-500/30 bg-red-500/[.06]"
                                            : "border-black/15 bg-white/40"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`h-3 w-3 shrink-0 rounded-full ${
                                                isOutOfStock
                                                    ? "bg-red-500"
                                                    : "bg-[#FF8F00]"
                                            }`}
                                        />

                                        <div>
                                            <p className="mg-mono text-sm font-black text-[#0A0A0A]">
                                                {isOutOfStock
                                                    ? "Out of stock"
                                                    : "In stock"}
                                            </p>

                                            <p className="text-[13px] font-medium text-black/65">
                                                {isOutOfStock
                                                    ? "Currently unavailable"
                                                    : "Ready for collection"}
                                            </p>
                                        </div>
                                    </div>

                                    {!isOutOfStock && hasValidStock && (
                                        <span className="mg-mono rounded-full bg-[#FF8F00]/15 px-3 py-1.5 text-xs font-black text-[#7A3F00]">
                                            {stockQuantity}{" "}
                                            {stockQuantity === 1
                                                ? "unit"
                                                : "units"}{" "}
                                            available
                                        </span>
                                    )}
                                </div>

                                {/* PURCHASE */}

                                <div>
                                    <p className="mg-mono mb-2 text-xs font-black text-black/70">
                                        Quantity
                                    </p>

                                    <div className="flex gap-3">

                                        <div className="flex h-14 items-center rounded-[4px] border border-black/20 bg-white/70">

                                            <button
                                                type="button"
                                                onClick={decreaseQuantity}
                                                disabled={isOutOfStock}
                                                aria-label="Decrease quantity"
                                                className="flex h-12 w-12 items-center justify-center text-black/70 transition-colors hover:bg-[#ECE8D6] hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                                            >
                                                <Minus size={17} />
                                            </button>

                                            <span className="w-10 text-center font-mono text-lg font-black">
                                                {quantity}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={increaseQuantity}
                                                disabled={
                                                    isOutOfStock ||
                                                    (hasValidStock &&
                                                        quantity >=
                                                            stockQuantity)
                                                }
                                                aria-label="Increase quantity"
                                                className="flex h-12 w-12 items-center justify-center text-black/70 transition-colors hover:bg-[#ECE8D6] hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                                            >
                                                <Plus size={17} />
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleAddToCart}
                                            disabled={
                                                isOutOfStock ||
                                                isAdding
                                            }
                                            className={`mg-button flex h-14 flex-1 items-center justify-center gap-3 rounded-[4px] px-5 font-mono text-sm font-black uppercase tracking-[.1em] shadow-lg transition-all duration-300 ${
                                                isOutOfStock
                                                    ? "cursor-not-allowed bg-black/15 text-black/50"
                                                    : isAdding
                                                      ? "bg-[#FF8F00] text-[#0A0A0A]"
                                                      : "bg-[#0A0A0A] text-[#F5F5DC] hover:-translate-y-0.5 hover:bg-[#FF8F00] hover:text-[#0A0A0A]"
                                            }`}
                                        >
                                            {isAdding ? (
                                                <Check
                                                    size={20}
                                                    strokeWidth={2.4}
                                                />
                                            ) : (
                                                <ShoppingBag
                                                    size={19}
                                                    strokeWidth={1.9}
                                                />
                                            )}

                                            {isOutOfStock
                                                ? "Sold out"
                                                : isAdding
                                                  ? "Added to garage"
                                                  : "Add to cart"}
                                        </button>
                                    </div>
                                </div>

                                {/* BENEFITS */}

                                <div className="grid grid-cols-3 overflow-hidden rounded-[4px] border border-black/15">

                                    <Benefit
                                        icon={<Package size={20} />}
                                        title="Quality"
                                    />

                                    <Benefit
                                        icon={<RotateCcw size={20} />}
                                        title="Returns"
                                        bordered
                                    />

                                    <Benefit
                                        icon={<ShieldCheck size={20} />}
                                        title="Secure"
                                    />

                                </div>

                                {/* DELIVERY */}

                                <div className="flex items-center gap-4 rounded-[4px] border-l-[3px] border-[#FF8F00] bg-[#FF8F00]/[.08] px-4 py-3">

                                    <Truck
                                        size={22}
                                        className="shrink-0 text-[#B35F00]"
                                        strokeWidth={1.7}
                                    />

                                    <div>
                                        <p className="mg-mono text-xs font-black text-black/80">
                                            Collector delivery
                                        </p>

                                        <p className="mt-0.5 text-[13px] font-medium text-black/65">
                                            Carefully packed for your collection.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =================================================
                    SPECIFICATIONS
                ================================================= */}

                <section className="mx-auto w-full max-w-[1400px] px-3 pb-8 sm:px-5 lg:px-6 lg:pb-10">

                    <div className="rounded-[6px] border border-black/15 bg-[#ECE8D6] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">

                        <div className="mx-auto max-w-[1180px]">

                            {/* SECTION HEADER */}

                            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">

                                <div>
                                    <p className="mg-mono mb-2 text-xs font-black text-[#B35F00]">
                                        Metal Garage · Details
                                    </p>

                                    <h2 className="mg-display text-3xl sm:text-4xl">
                                        Model Specifications
                                    </h2>
                                </div>

                                <span className="mg-mono text-xs font-bold text-black/55">
                                    Verified product data
                                </span>
                            </div>

                            {/* SPECIFICATIONS */}

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                                <LargeSpec
                                    label="Category"
                                    value={category}
                                />

                                <LargeSpec
                                    label="Series"
                                    value={series}
                                />

                                <LargeSpec
                                    label="Casting"
                                    value={casting}
                                />

                                <LargeSpec
                                    label="Manufacturer"
                                    value={manufacturer}
                                />

                                <LargeSpec
                                    label="Model"
                                    value={model}
                                />

                                <LargeSpec
                                    label="Vehicle Type"
                                    value={vehicleType}
                                />

                                <LargeSpec
                                    label="Scale"
                                    value={scale}
                                />

                                <LargeSpec
                                    label="Year"
                                    value={year}
                                />

                                <LargeSpec
                                    label="Packaging"
                                    value={packaging}
                                />

                                <LargeSpec
                                    label="Condition"
                                    value={condition}
                                />

                                <LargeSpec
                                    label="Product Type"
                                    value={productType}
                                />

                                <LargeSpec
                                    label="Product ID"
                                    value={product.productID}
                                />

                            </div>

                            {/* BOTTOM COLLECTOR INFO */}

                            <div className="mt-8 grid grid-cols-1 overflow-hidden rounded-[5px] border border-black/15 bg-[#F5F5DC] sm:grid-cols-3">

                                <CollectorInfo
                                    icon={<Sparkles size={18} />}
                                    title="Collector grade"
                                    text="Built for enthusiasts"
                                />

                                <CollectorInfo
                                    icon={<ShieldCheck size={18} />}
                                    title="Garage standard"
                                    text="Carefully selected models"
                                    bordered
                                />

                                <CollectorInfo
                                    icon={<Truck size={18} />}
                                    title="Ready to ship"
                                    text="Packed with collector care"
                                />

                            </div>

                            {/* FOOTER LINE */}

                            <div className="mt-8 flex items-center justify-center gap-4 text-center">

                                <div className="hidden h-px w-20 bg-black/15 sm:block" />

                                <span className="mg-mono text-xs font-bold text-black/50">
                                    Built for collectors. Driven by passion.
                                </span>

                                <div className="hidden h-px w-20 bg-black/15 sm:block" />

                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

// =============================================================
// BENEFIT
// =============================================================

function Benefit({ icon, title, bordered = false }) {
    return (
        <div
            className={`flex flex-col items-center justify-center gap-1.5 px-2 py-3 text-center ${
                bordered
                    ? "border-x border-black/15"
                    : ""
            }`}
        >
            <div className="text-[#B35F00]">
                {icon}
            </div>

            <p className="mg-mono text-xs font-black text-black/75">
                {title}
            </p>
        </div>
    );
}

// =============================================================
// LARGE SPEC
// =============================================================

function LargeSpec({ label, value }) {
    return (
        <div className="mg-spec min-h-[92px] rounded-[4px] border border-black/15 bg-[#F5F5DC] px-5 py-4">

            <p className="mg-mono text-xs font-bold text-black/60">
                {label}
            </p>

            <p className="mt-2 break-words text-base font-bold leading-6 text-[#080808]">
                {value || "—"}
            </p>
        </div>
    );
}

// =============================================================
// COLLECTOR INFO
// =============================================================

function CollectorInfo({
    icon,
    title,
    text,
    bordered = false,
}) {
    return (
        <div
            className={`flex items-center gap-4 px-5 py-5 sm:px-6 sm:py-6 ${
                bordered
                    ? "border-y border-black/15 sm:border-y-0 sm:border-x"
                    : ""
            }`}
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0A0A0A] text-[#FF8F00]">
                {icon}
            </div>

            <div>
                <p className="mg-mono text-xs font-black text-black/65">
                    {title}
                </p>

                <p className="mt-0.5 text-sm font-bold text-black/85">
                    {text}
                </p>
            </div>
        </div>
    );
}