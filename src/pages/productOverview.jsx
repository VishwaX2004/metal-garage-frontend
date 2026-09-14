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
    // LOADING
    // =========================================================

    if (status === "Loading") {
        return (
            <div className="min-h-screen bg-[#F5F5DC] text-[#0A0A0A]">
                <Header />

                <main className="flex min-h-[75vh] items-center justify-center px-5">
                    <div className="text-center">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#0A0A0A] text-[#FF8F00] shadow-xl">
                            <Package size={26} strokeWidth={1.6} />
                        </div>

                        <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[.25em] text-[#FF8F00]">
                            METAL GARAGE / LOADING
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
            <div className="min-h-screen bg-[#F5F5DC] text-[#0A0A0A]">
                <Header />

                <main className="flex min-h-[75vh] items-center justify-center px-5">
                    <div className="w-full max-w-xl text-center">
                        <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-[#0A0A0A] text-[#FF8F00] shadow-2xl">
                            <Package size={34} strokeWidth={1.5} />
                        </div>

                        <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[.25em] text-[#FF8F00]">
                            METAL GARAGE / 404
                        </p>

                        <h1 className="font-['Oswald',sans-serif] text-5xl font-bold uppercase leading-[.95] sm:text-6xl">
                            PRODUCT
                            <br />
                            NOT FOUND
                        </h1>

                        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-black/60">
                            We couldn't find the die-cast model you're
                            looking for.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="mt-8 inline-flex items-center gap-3 rounded-[4px] bg-[#0A0A0A] px-7 py-4 font-mono text-[10px] font-black uppercase tracking-[.16em] text-[#F5F5DC] transition-all hover:-translate-y-1 hover:bg-[#FF8F00] hover:text-[#0A0A0A]"
                        >
                            <ArrowLeft size={15} />
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
        <div className="min-h-screen w-full overflow-x-hidden bg-[#F5F5DC] text-[#0A0A0A]">

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
                    line-height: .94;
                }

                .mg-mono {
                    font-family: 'JetBrains Mono', monospace;
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
                        transform: translateY(20px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes imageIn {
                    from {
                        opacity: 0;
                        transform: scale(1.04);
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
                    animation: fadeUp .65s cubic-bezier(.22,1,.36,1);
                }

                .mg-image {
                    animation: imageIn .5s cubic-bezier(.22,1,.36,1);
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
                        transform .25s ease,
                        border-color .25s ease,
                        background-color .25s ease,
                        box-shadow .25s ease;
                }

                .mg-spec:hover {
                    transform: translateY(-3px);
                    border-color: rgba(255,143,0,.35);
                    background: rgba(255,143,0,.07);
                    box-shadow: 0 12px 28px rgba(10,10,10,.06);
                }

                .mg-benefit {
                    transition:
                        background-color .25s ease,
                        transform .25s ease;
                }

                .mg-benefit:hover {
                    background: rgba(255,143,0,.08);
                    transform: translateY(-2px);
                }

                .mg-thumb-scroll::-webkit-scrollbar {
                    height: 4px;
                }

                .mg-thumb-scroll::-webkit-scrollbar-thumb {
                    background: rgba(10,10,10,.18);
                    border-radius: 999px;
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

            <main className="mg-page">

                {/* =================================================
                    BREADCRUMB
                ================================================= */}

                <div className="mx-auto w-full max-w-[1320px] px-4 pt-6 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Link
                            to="/"
                            className="mg-mono shrink-0 text-[9px] font-bold uppercase tracking-[.15em] text-black/40 transition-colors hover:text-[#FF8F00]"
                        >
                            Home
                        </Link>

                        <span className="text-black/20">/</span>

                        <Link
                            to="/product"
                            className="mg-mono shrink-0 text-[9px] font-bold uppercase tracking-[.15em] text-black/40 transition-colors hover:text-[#FF8F00]"
                        >
                            Collection
                        </Link>

                        <span className="text-black/20">/</span>

                        <span className="mg-mono truncate text-[9px] font-bold uppercase tracking-[.15em] text-black/65">
                            {product.name}
                        </span>
                    </div>
                </div>

                {/* =================================================
                    LARGE PRODUCT CARD
                ================================================= */}

                <section className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

                    <div className="overflow-hidden rounded-[6px] border border-black/10 bg-[#F5F5DC] shadow-[0_25px_90px_rgba(10,10,10,.12)]">

                        {/* TOP BAR */}

                        <div className="flex min-h-[54px] flex-wrap items-center justify-between gap-3 bg-[#0A0A0A] px-5 py-3 text-[#F5F5DC] sm:px-7">

                            <div className="flex items-center gap-3">
                                <span className="mg-pulse h-2.5 w-2.5 rounded-full bg-[#FF8F00]" />

                                <span className="mg-mono text-[9px] font-bold uppercase tracking-[.2em]">
                                    METAL GARAGE
                                </span>

                                <span className="hidden h-4 w-px bg-white/15 sm:block" />

                                <span className="hidden mg-mono text-[8px] uppercase tracking-[.15em] text-white/40 sm:block">
                                    COLLECTOR EDITION
                                </span>
                            </div>

                            <span className="mg-mono text-[8px] uppercase tracking-[.14em] text-white/40">
                                {product.productID}
                            </span>
                        </div>

                        {/* MAIN CONTENT */}

                        <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_.92fr]">

                            {/* =================================================
                                LARGE IMAGE SECTION
                            ================================================= */}

                            <div className="border-b border-black/10 p-5 sm:p-7 lg:border-b-0 lg:border-r lg:p-10">

                                <div className="mb-4 flex items-center gap-3">
                                    <span className="mg-mono text-[9px] font-black uppercase tracking-[.18em] text-[#FF8F00]">
                                        Product Preview
                                    </span>

                                    <div className="h-px flex-1 bg-black/10" />

                                    <span className="mg-mono text-[8px] uppercase tracking-[.12em] text-black/35">
                                        {scale}
                                    </span>
                                </div>

                                <div className="relative mx-auto aspect-square w-full max-w-[650px] overflow-hidden rounded-[4px] border border-black/10 bg-[#ECE8D6] shadow-[0_20px_55px_rgba(10,10,10,.08)]">

                                    <div className="mg-grid pointer-events-none absolute inset-0 opacity-70" />

                                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,143,0,.12),transparent_55%)]" />

                                    {isSale && (
                                        <div className="absolute left-4 top-4 z-30 bg-[#FF8F00] px-3 py-2 font-mono text-[9px] font-black uppercase tracking-[.1em] text-[#0A0A0A] shadow-lg">
                                            SALE / -{discountPercentage}%
                                        </div>
                                    )}

                                    {!isSale && product.featured && (
                                        <div className="absolute left-4 top-4 z-30 bg-[#FF3B00] px-3 py-2 font-mono text-[9px] font-black uppercase tracking-[.1em] text-[#F5F5DC] shadow-lg">
                                            FEATURED
                                        </div>
                                    )}

                                    {isOutOfStock && (
                                        <div className="absolute left-4 top-4 z-40 bg-[#0A0A0A]/90 px-3 py-2 font-mono text-[9px] font-black uppercase tracking-[.1em] text-[#F5F5DC] shadow-lg">
                                            SOLD OUT
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
                                        className={`absolute right-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-[#F5F5DC]/95 text-[#0A0A0A] shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#0A0A0A] hover:text-[#FF8F00] ${
                                            isWishlisted
                                                ? "bg-[#0A0A0A] text-[#FF8F00]"
                                                : ""
                                        }`}
                                    >
                                        <Heart
                                            size={19}
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
                                            className={`mg-image relative z-10 h-full w-full object-contain p-8 transition-transform duration-700 hover:scale-[1.035] sm:p-12 lg:p-16 ${
                                                isOutOfStock
                                                    ? "grayscale-[.7] opacity-55"
                                                    : ""
                                            }`}
                                        />
                                    ) : (
                                        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-3 text-black/30">
                                            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-black/10 bg-black/[.035]">
                                                <ImageOff
                                                    size={30}
                                                    strokeWidth={1.4}
                                                />
                                            </div>

                                            <span className="mg-mono text-[9px] font-bold uppercase tracking-[.15em]">
                                                Image unavailable
                                            </span>
                                        </div>
                                    )}

                                    {/* IMAGE COUNTER */}

                                    <div className="absolute bottom-4 right-4 z-20">
                                        <span className="mg-mono rounded-[3px] bg-[#F5F5DC]/90 px-3 py-2 text-[8px] font-bold uppercase tracking-[.1em] text-black/55 backdrop-blur-md">
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
                                            className="absolute left-4 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-[#F5F5DC]/95 text-black shadow-lg transition-all hover:scale-110 hover:bg-[#FF8F00]"
                                        >
                                            <ChevronLeft size={19} />
                                        </button>
                                    )}

                                    {/* NEXT */}

                                    {images.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={nextImage}
                                            aria-label="Next image"
                                            className="absolute right-4 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-[#F5F5DC]/95 text-black shadow-lg transition-all hover:scale-110 hover:bg-[#FF8F00]"
                                        >
                                            <ChevronRight size={19} />
                                        </button>
                                    )}
                                </div>

                                {/* THUMBNAILS */}

                                {images.length > 1 && (
                                    <div className="mg-thumb-scroll mx-auto mt-4 flex max-w-[650px] gap-3 overflow-x-auto pb-2">
                                        {images.map((image, index) => (
                                            <button
                                                key={`${image}-${index}`}
                                                type="button"
                                                onClick={() =>
                                                    selectImage(index)
                                                }
                                                className={`relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-[3px] border bg-[#ECE8D6] transition-all duration-300 sm:h-[84px] sm:w-[84px] ${
                                                    selectedImage === index
                                                        ? "border-[#FF8F00] ring-2 ring-[#FF8F00]/20"
                                                        : "border-black/10 opacity-60 hover:border-black/30 hover:opacity-100"
                                                }`}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${product.name} ${index + 1}`}
                                                    className="h-full w-full object-contain p-2 transition-transform duration-500 hover:scale-110"
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

                            <div className="p-6 sm:p-8 lg:p-10 xl:p-12">

                                {/* CATEGORY */}

                                <div className="mb-4 flex flex-wrap items-center gap-2.5">
                                    <span className="mg-mono text-[10px] font-black uppercase tracking-[.18em] text-[#FF8F00]">
                                        {category}
                                    </span>

                                    <span className="h-1.5 w-1.5 rounded-full bg-black/20" />

                                    <span className="mg-mono text-[9px] font-bold uppercase tracking-[.13em] text-black/40">
                                        {productType}
                                    </span>
                                </div>

                                {/* TITLE */}

                                <h1 className="mg-display max-w-[700px] text-[clamp(42px,5vw,70px)] text-[#080808]">
                                    {product.name}
                                </h1>

                                {/* PRODUCT ID */}

                                <div className="mt-4 flex items-center gap-3">
                                    <span className="mg-mono text-[9px] font-bold uppercase tracking-[.13em] text-black/40">
                                        Product ID / {product.productID}
                                    </span>

                                    <div className="h-px w-12 bg-black/15" />
                                </div>

                                {/* PRICE CARD */}

                                <div className="mt-7 rounded-[5px] border border-black/10 bg-white/40 p-5 sm:p-6">

                                    <div className="flex flex-wrap items-end gap-4">
                                        <span className="mg-mono text-3xl font-black tracking-[-.05em] sm:text-4xl">
                                            Rs.{" "}
                                            {productPrice.toLocaleString()}
                                        </span>

                                        {isSale && (
                                            <span className="mg-mono pb-1 text-base font-bold text-black/30 line-through">
                                                Rs.{" "}
                                                {labelledPrice.toLocaleString()}
                                            </span>
                                        )}
                                    </div>

                                    {isSale && (
                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            <Sparkles
                                                size={14}
                                                className="text-[#FF8F00]"
                                            />

                                            <span className="mg-mono text-[9px] font-black uppercase tracking-[.1em] text-[#995000]">
                                                Save Rs.{" "}
                                                {savings.toLocaleString()}
                                            </span>

                                            <span className="text-black/20">
                                                /
                                            </span>

                                            <span className="mg-mono text-[9px] font-black uppercase tracking-[.1em] text-[#995000]">
                                                {discountPercentage}% OFF
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* DESCRIPTION */}

                                <div className="mt-7">
                                    <p className="mg-mono mb-3 text-[10px] font-black uppercase tracking-[.16em] text-black/45">
                                        About This Model
                                    </p>

                                    <p className="max-w-[680px] text-[15px] font-medium leading-7 text-black/65 sm:text-[16px] sm:leading-8">
                                        {product.description ||
                                            "A premium die-cast model prepared for your Metal Garage collection."}
                                    </p>
                                </div>

                                {/* STOCK */}

                                <div
                                    className={`mt-7 rounded-[5px] border p-5 ${
                                        isOutOfStock
                                            ? "border-red-500/20 bg-red-500/[.035]"
                                            : "border-black/10 bg-white/35"
                                    }`}
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-4">

                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`h-3 w-3 rounded-full ${
                                                    isOutOfStock
                                                        ? "bg-red-500"
                                                        : "bg-[#FF8F00]"
                                                }`}
                                            />

                                            <div>
                                                <p className="mg-mono text-[10px] font-black uppercase tracking-[.12em]">
                                                    {isOutOfStock
                                                        ? "Out of Stock"
                                                        : "In Stock"}
                                                </p>

                                                <p className="mt-1 text-[12px] font-medium text-black/40">
                                                    {isOutOfStock
                                                        ? "Currently unavailable"
                                                        : "Ready for collection"}
                                                </p>
                                            </div>
                                        </div>

                                        {!isOutOfStock &&
                                            hasValidStock && (
                                                <span className="mg-mono rounded-full bg-[#FF8F00]/10 px-3 py-2 text-[9px] font-black uppercase tracking-[.08em] text-[#8A4800]">
                                                    {stockQuantity}{" "}
                                                    {stockQuantity === 1
                                                        ? "UNIT"
                                                        : "UNITS"}{" "}
                                                    AVAILABLE
                                                </span>
                                            )}
                                    </div>
                                </div>

                                {/* PURCHASE */}

                                <div className="mt-7">

                                    <p className="mg-mono mb-3 text-[10px] font-black uppercase tracking-[.14em] text-black/45">
                                        Quantity
                                    </p>

                                    <div className="flex gap-3">

                                        <div className="flex h-14 items-center rounded-[4px] border border-black/10 bg-white/60">

                                            <button
                                                type="button"
                                                onClick={decreaseQuantity}
                                                disabled={isOutOfStock}
                                                className="flex h-12 w-12 items-center justify-center text-black/55 transition-colors hover:bg-[#ECE8D6] hover:text-black disabled:cursor-not-allowed disabled:opacity-25"
                                            >
                                                <Minus size={16} />
                                            </button>

                                            <span className="w-10 text-center font-mono text-base font-black">
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
                                                className="flex h-12 w-12 items-center justify-center text-black/55 transition-colors hover:bg-[#ECE8D6] hover:text-black disabled:cursor-not-allowed disabled:opacity-25"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleAddToCart}
                                            disabled={
                                                isOutOfStock ||
                                                isAdding
                                            }
                                            className={`mg-button flex h-14 flex-1 items-center justify-center gap-3 rounded-[4px] px-5 font-mono text-[10px] font-black uppercase tracking-[.14em] shadow-lg transition-all duration-300 ${
                                                isOutOfStock
                                                    ? "cursor-not-allowed bg-black/10 text-black/30"
                                                    : isAdding
                                                      ? "bg-[#FF8F00] text-[#0A0A0A]"
                                                      : "bg-[#0A0A0A] text-[#F5F5DC] hover:-translate-y-1 hover:bg-[#FF8F00] hover:text-[#0A0A0A]"
                                            }`}
                                        >
                                            {isAdding ? (
                                                <Check
                                                    size={19}
                                                    strokeWidth={2.4}
                                                />
                                            ) : (
                                                <ShoppingBag
                                                    size={18}
                                                    strokeWidth={1.9}
                                                />
                                            )}

                                            {isOutOfStock
                                                ? "Sold Out"
                                                : isAdding
                                                  ? "Added To Garage"
                                                  : "Add To Cart"}
                                        </button>
                                    </div>
                                </div>

                                {/* BENEFITS */}

                                <div className="mt-7 grid grid-cols-3 overflow-hidden rounded-[4px] border border-black/10">

                                    <Benefit
                                        icon={<Package size={19} />}
                                        title="Quality"
                                    />

                                    <Benefit
                                        icon={<RotateCcw size={19} />}
                                        title="Returns"
                                        bordered
                                    />

                                    <Benefit
                                        icon={<ShieldCheck size={19} />}
                                        title="Secure"
                                    />

                                </div>

                                {/* DELIVERY */}

                                <div className="mt-5 flex items-center gap-4 rounded-[4px] border-l-[3px] border-[#FF8F00] bg-[#FF8F00]/[.055] px-4 py-4">

                                    <Truck
                                        size={20}
                                        className="shrink-0 text-[#FF8F00]"
                                        strokeWidth={1.6}
                                    />

                                    <div>
                                        <p className="mg-mono text-[9px] font-black uppercase tracking-[.12em] text-black/65">
                                            Collector Delivery
                                        </p>

                                        <p className="mt-1 text-[12px] font-medium text-black/45">
                                            Carefully packed for your collection.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            LARGE LOWER INFORMATION
                        ================================================= */}

                        <div className="border-t border-black/10 bg-[#ECE8D6] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">

                            <div className="mx-auto max-w-[1180px]">

                                {/* SECTION HEADER */}

                                <div className="mb-7 flex flex-wrap items-end justify-between gap-4">

                                    <div>
                                        <p className="mg-mono mb-2 text-[9px] font-black uppercase tracking-[.2em] text-[#FF8F00]">
                                            Metal Garage / Details
                                        </p>

                                        <h2 className="mg-display text-3xl sm:text-4xl">
                                            Model Specifications
                                        </h2>
                                    </div>

                                    <span className="mg-mono text-[8px] font-bold uppercase tracking-[.14em] text-black/30">
                                        VERIFIED PRODUCT DATA
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

                                <div className="mt-8 grid grid-cols-1 overflow-hidden rounded-[5px] border border-black/10 bg-[#F5F5DC] sm:grid-cols-3">

                                    <CollectorInfo
                                        icon={<Sparkles size={18} />}
                                        title="Collector Grade"
                                        text="Built for enthusiasts"
                                    />

                                    <CollectorInfo
                                        icon={<ShieldCheck size={18} />}
                                        title="Garage Standard"
                                        text="Carefully selected models"
                                        bordered
                                    />

                                    <CollectorInfo
                                        icon={<Truck size={18} />}
                                        title="Ready To Ship"
                                        text="Packed with collector care"
                                    />

                                </div>

                                {/* FOOTER LINE */}

                                <div className="mt-8 flex items-center justify-center gap-4 text-center">

                                    <div className="hidden h-px w-20 bg-black/10 sm:block" />

                                    <span className="mg-mono text-[8px] font-bold uppercase tracking-[.18em] text-black/30">
                                        Built for collectors. Driven by passion.
                                    </span>

                                    <div className="hidden h-px w-20 bg-black/10 sm:block" />

                                </div>
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
            className={`mg-benefit flex flex-col items-center justify-center px-2 py-5 text-center ${
                bordered
                    ? "border-x border-black/10"
                    : ""
            }`}
        >
            <div className="mb-2 text-[#FF8F00]">
                {icon}
            </div>

            <p className="mg-mono text-[8px] font-black uppercase tracking-[.12em] text-black/55">
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
        <div className="mg-spec min-h-[105px] rounded-[4px] border border-black/10 bg-[#F5F5DC] px-5 py-4 sm:px-6 sm:py-5">

            <p className="mg-mono text-[8px] font-black uppercase tracking-[.15em] text-black/40">
                {label}
            </p>

            <p className="mt-3 break-words text-[15px] font-bold leading-6 text-[#080808] sm:text-[16px]">
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
                    ? "border-y border-black/10 sm:border-y-0 sm:border-x"
                    : ""
            }`}
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0A0A0A] text-[#FF8F00]">
                {icon}
            </div>

            <div>
                <p className="mg-mono text-[8px] font-black uppercase tracking-[.13em] text-black/40">
                    {title}
                </p>

                <p className="mt-1 text-[12px] font-bold text-black/75">
                    {text}
                </p>
            </div>
        </div>
    );
}

