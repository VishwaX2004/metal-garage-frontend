
import {
    Heart,
    Plus,
    Star,
    ImageOff,
    Check,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const CART_STORAGE_KEY = "cart";

export default function ProdcutCard(props) {
    const product = props.product;

    // =========================================================
    // PRODUCT DATA
    // =========================================================

    const productName =
        product?.name || "Unnamed Product";

    const productPrice =
        typeof product?.price === "number"
            ? product.price
            : Number(product?.price) || 0;

    const labelledPrice =
        typeof product?.labelledPrice === "number"
            ? product.labelledPrice
            : Number(product?.labelledPrice) || 0;

    const hasPrice =
        product?.price !== undefined &&
        product?.price !== null &&
        !isNaN(Number(product?.price));

    const safeRating = Math.min(
        5,
        Math.max(
            0,
            Number(
                product?.rating ??
                    product?.ratings ??
                    0
            ) || 0
        )
    );

    // =========================================================
    // IMAGES
    // =========================================================

    const validImages = Array.isArray(
        product?.images
    )
        ? product.images.filter(
              (image) =>
                  typeof image === "string" &&
                  image.trim() !== ""
          )
        : [];

    const [imageIndex, setImageIndex] =
        useState(0);

    const [imageError, setImageError] =
        useState(false);

    const [isAdding, setIsAdding] =
        useState(false);

    const currentImage =
        validImages[imageIndex];

    // =========================================================
    // STOCK
    // IMPORTANT:
    // Your MongoDB schema uses "quantity"
    // =========================================================

    const stockQuantity =
        Number(product?.quantity);

    const isOutOfStock =
        Number.isFinite(stockQuantity)
            ? stockQuantity <= 0
            : product?.stock === 0 ||
              product?.availability ===
                  "out-of-stock" ||
              product?.status ===
                  "Out of Stock" ||
              product?.status ===
                  "out-of-stock" ||
              product?.isOutOfStock === true;

    // =========================================================
    // SALE
    // =========================================================

    const isSale =
        hasPrice &&
        labelledPrice > productPrice &&
        labelledPrice > 0;

    // =========================================================
    // IMAGE HANDLERS
    // =========================================================

    const handleImageError = () => {
        setImageError(true);
    };

    const handleImageChange = (index) => {
        setImageIndex(index);
        setImageError(false);
    };

    // =========================================================
    // GET PRODUCT ID
    // =========================================================

    const getProductId = () => {
        return (
            product?.productID ||
            product?._id ||
            product?.id ||
            product?.sku ||
            product?.name
        );
    };

    // =========================================================
    // ADD TO CART
    // =========================================================

    const handleAddToCart = () => {
        if (isAdding) {
            return;
        }

        if (isOutOfStock) {
            toast.error(
                "This product is out of stock."
            );

            return;
        }

        const productId = getProductId();

        if (!productId) {
            toast.error(
                "Unable to add product. Product ID is missing."
            );

            return;
        }

        try {
            const storedCart =
                localStorage.getItem(
                    CART_STORAGE_KEY
                );

            let cart = [];

            if (storedCart) {
                const parsed =
                    JSON.parse(storedCart);

                if (Array.isArray(parsed)) {
                    cart = parsed;
                }
            }

            const existingIndex =
                cart.findIndex((item) => {
                    const itemId =
                        item?.productID ||
                        item?._id ||
                        item?.id ||
                        item?.sku ||
                        item?.name;

                    return itemId === productId;
                });

            // =================================================
            // PRODUCT ALREADY IN CART
            // =================================================

            if (existingIndex !== -1) {
                const existingItem =
                    cart[existingIndex];

                const currentQuantity =
                    Number(
                        existingItem?.cartQuantity
                    ) || 1;

                const availableStock =
                    Number(product?.quantity);

                if (
                    Number.isFinite(
                        availableStock
                    ) &&
                    currentQuantity >=
                        availableStock
                ) {
                    toast.error(
                        `Only ${availableStock} ${
                            availableStock === 1
                                ? "item"
                                : "items"
                        } available.`
                    );

                    return;
                }

                cart[existingIndex] = {
                    ...existingItem,
                    ...product,
                    cartQuantity:
                        currentQuantity + 1,
                };

                localStorage.setItem(
                    CART_STORAGE_KEY,
                    JSON.stringify(cart)
                );

                window.dispatchEvent(
                    new CustomEvent(
                        "cartUpdated",
                        {
                            detail: cart,
                        }
                    )
                );

                setIsAdding(true);

                toast.success(
                    `${productName} quantity increased.`
                );

                setTimeout(() => {
                    setIsAdding(false);
                }, 500);

                return;
            }

            // =================================================
            // NEW PRODUCT
            // =================================================

            const cartItem = {
                ...product,

                // Keep your MongoDB productID
                productID:
                    product?.productID ||
                    productId,

                // IMPORTANT:
                // quantity = database stock
                // cartQuantity = customer's quantity
                cartQuantity: 1,
            };

            cart.push(cartItem);

            localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify(cart)
            );

            // Tell other components that cart changed
            window.dispatchEvent(
                new CustomEvent(
                    "cartUpdated",
                    {
                        detail: cart,
                    }
                )
            );

            setIsAdding(true);

            toast.success(
                `${productName} added to cart!`
            );

            setTimeout(() => {
                setIsAdding(false);
            }, 500);
        } catch (error) {
            console.error(
                "Add to cart error:",
                error
            );

            toast.error(
                "Something went wrong while adding the product."
            );

            setIsAdding(false);
        }
    };

    return (
        <article
            className="
                group
                relative
                w-full
                max-w-[341px]
                overflow-hidden
                rounded-[8px]
                border
                border-black/15
                bg-[#F5F5DC]
                text-[#0A0A0A]
                transition-all
                duration-300
                ease-out
                hover:-translate-y-1
                hover:border-black/30
                hover:shadow-[0_22px_45px_rgba(10,10,10,0.14)]
            "
        >
            {/* =====================================================
                CORNER BRACKETS
            ===================================================== */}

            <span
                className="
                    pointer-events-none
                    absolute
                    left-[10px]
                    top-[10px]
                    z-30
                    h-[15px]
                    w-[15px]
                    border-l-2
                    border-t-2
                    border-black/50
                "
            />

            <span
                className="
                    pointer-events-none
                    absolute
                    bottom-[10px]
                    right-[10px]
                    z-30
                    h-[15px]
                    w-[15px]
                    border-b-2
                    border-r-2
                    border-black/50
                "
            />

            {/* =====================================================
                IMAGE SECTION
                Increased from 250px to 300px
            ===================================================== */}

            <div
                className={`
                    relative
                    flex
                    h-[300px]
                    w-full
                    items-center
                    justify-center
                    overflow-hidden
                    bg-[#ECE8D6]
                    bg-[radial-gradient(circle_at_50%_30%,rgba(255,143,0,0.12),transparent_60%)]
                    before:pointer-events-none
                    before:absolute
                    before:inset-0
                    before:z-0
                    before:bg-[repeating-linear-gradient(45deg,rgba(10,10,10,0.03)_0_1px,transparent_1px_18px)]
                    sm:h-[315px]
                    ${
                        isOutOfStock
                            ? "grayscale-[0.6] opacity-70"
                            : ""
                    }
                `}
            >
                {/* =================================================
                    BADGE
                ================================================= */}

                <span
                    className={`
                        absolute
                        left-3
                        top-3
                        z-20
                        rounded-[3px]
                        px-[10px]
                        py-[6px]
                        font-mono
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.08em]
                        shadow-sm
                        ${
                            isOutOfStock
                                ? "bg-black/55 text-[#F5F5DC]"
                                : isSale
                                ? "bg-[#FF8F00] text-[#0A0A0A]"
                                : product?.featured
                                ? "bg-[#FF3B00] text-[#F5F5DC]"
                                : "bg-[#0A0A0A] text-[#F5F5DC]"
                        }
                    `}
                >
                    {isOutOfStock
                        ? "SOLD OUT"
                        : isSale
                        ? "SALE"
                        : product?.featured
                        ? "FEATURED"
                        : "NEW"}
                </span>

                {/* =================================================
                    WISHLIST
                ================================================= */}

                <button
                    type="button"
                    aria-label={`Add ${productName} to wishlist`}
                    className="
                        absolute
                        right-3
                        top-3
                        z-20
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-black/10
                        bg-[#F5F5DC]/95
                        text-[#0A0A0A]
                        shadow-[0_3px_12px_rgba(10,10,10,0.08)]
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:bg-[#0A0A0A]
                        hover:text-[#FF8F00]
                        hover:shadow-[0_5px_15px_rgba(10,10,10,0.15)]
                    "
                >
                    <Heart
                        className="h-[16px] w-[16px]"
                        strokeWidth={1.8}
                    />
                </button>

                {/* =================================================
                    PRODUCT IMAGE
                    Bigger + more visible
                ================================================= */}

                {currentImage && !imageError ? (
                    <div
                        className="
                            relative
                            z-[1]
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center
                            px-4
                            py-3
                        "
                    >
                        <img
                            key={currentImage}
                            src={currentImage}
                            alt={productName}
                            loading="lazy"
                            decoding="async"
                            onError={
                                handleImageError
                            }
                            className="
                                block
                                h-auto
                                max-h-[280px]
                                w-auto
                                max-w-[94%]
                                select-none
                                object-contain
                                drop-shadow-[0_18px_20px_rgba(10,10,10,0.22)]
                                transition-transform
                                duration-500
                                ease-out
                                group-hover:-translate-y-1
                                group-hover:scale-[1.08]
                            "
                        />
                    </div>
                ) : (
                    /* =================================================
                       IMAGE FALLBACK
                    ================================================= */

                    <div
                        className="
                            relative
                            z-[1]
                            flex
                            h-full
                            w-full
                            flex-col
                            items-center
                            justify-center
                            gap-2
                            text-black/30
                        "
                    >
                        <div
                            className="
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-black/10
                                bg-black/5
                            "
                        >
                            <ImageOff
                                className="h-6 w-6"
                                strokeWidth={1.5}
                            />
                        </div>

                        <span
                            className="
                                font-mono
                                text-[10px]
                                uppercase
                                tracking-[0.12em]
                            "
                        >
                            Image unavailable
                        </span>
                    </div>
                )}

                {/* =================================================
                    IMAGE COUNT
                ================================================= */}

                {validImages.length > 1 &&
                    !imageError && (
                        <div
                            className="
                                absolute
                                bottom-3
                                left-1/2
                                z-20
                                flex
                                -translate-x-1/2
                                items-center
                                gap-1.5
                                rounded-full
                                border
                                border-black/5
                                bg-[#F5F5DC]/95
                                px-3
                                py-1.5
                                shadow-sm
                            "
                        >
                            {validImages.map(
                                (_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        aria-label={`View image ${
                                            index +
                                            1
                                        }`}
                                        onClick={() =>
                                            handleImageChange(
                                                index
                                            )
                                        }
                                        className={`
                                            h-1.5
                                            w-1.5
                                            rounded-full
                                            transition-all
                                            ${
                                                index ===
                                                imageIndex
                                                    ? "scale-125 bg-[#FF8F00]"
                                                    : "bg-black/25"
                                            }
                                        `}
                                    />
                                )
                            )}
                        </div>
                    )}
            </div>

            {/* =====================================================
                PRODUCT BODY
            ===================================================== */}

            <div
                className="
                    px-[18px]
                    pb-[18px]
                    pt-[17px]
                "
            >
                {/* =================================================
                    SERIES
                ================================================= */}

                <div
                    className="
                        mb-[5px]
                        line-clamp-1
                        text-[10.5px]
                        font-medium
                        uppercase
                        tracking-[0.1em]
                        text-[#CC7000]
                    "
                >
                    {product?.series ||
                        product?.category ||
                        "Collection"}
                </div>

                {/* =================================================
                    NAME
                ================================================= */}

                <h3
                    className="
                        mb-[7px]
                        line-clamp-1
                        font-sans
                        text-[17px]
                        font-semibold
                        tracking-normal
                        text-[#0A0A0A]
                    "
                    title={productName}
                >
                    {productName}
                </h3>

                {/* =================================================
                    PRODUCT SPECIFICATION
                ================================================= */}

                <div
                    className="
                        mb-3
                        line-clamp-1
                        font-mono
                        text-[10.5px]
                        uppercase
                        tracking-[0.03em]
                        text-black/45
                    "
                >
                    {product?.scale ||
                        "1:64 SCALE"}

                    {" — "}

                    {product?.productType ||
                        product?.vehicleType ||
                        "DIE-CAST"}

                    {" — "}

                    {product?.condition ||
                        "NEW"}
                </div>

                {/* =================================================
                    RATING
                ================================================= */}

                <div
                    className="
                        mb-[15px]
                        flex
                        items-center
                        gap-1
                    "
                >
                    {[1, 2, 3, 4, 5].map(
                        (star) => (
                            <Star
                                key={star}
                                className={`
                                    h-3
                                    w-3
                                    ${
                                        star <=
                                        safeRating
                                            ? "text-[#FF8F00]"
                                            : "text-black/15"
                                    }
                                `}
                                fill={
                                    star <=
                                    safeRating
                                        ? "currentColor"
                                        : "none"
                                }
                                strokeWidth={1}
                            />
                        )
                    )}

                    <span
                        className="
                            ml-1
                            text-[11px]
                            text-black/50
                        "
                    >
                        {safeRating.toFixed(1)}
                    </span>
                </div>

                {/* =================================================
                    STOCK INFO
                ================================================= */}

                {!isOutOfStock &&
                    Number.isFinite(
                        stockQuantity
                    ) && (
                        <div
                            className="
                                mb-3
                                flex
                                items-center
                                gap-1.5
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-[0.08em]
                                text-black/45
                            "
                        >
                            <span
                                className="
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-[#FF8F00]
                                "
                            />

                            {stockQuantity}{" "}
                            {stockQuantity === 1
                                ? "item"
                                : "items"}{" "}
                            available
                        </div>
                    )}

                {/* =================================================
                    PRICE + ADD BUTTON
                ================================================= */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                    "
                >
                    {/* PRICE */}

                    <div
                        className="
                            flex
                            items-baseline
                            gap-2
                        "
                    >
                        <span
                            className="
                                font-mono
                                text-[18px]
                                font-semibold
                                tracking-tight
                                text-[#0A0A0A]
                            "
                        >
                            {hasPrice
                                ? `Rs.${productPrice.toLocaleString()}`
                                : "Price N/A"}
                        </span>

                        {isSale && (
                            <span
                                className="
                                    font-mono
                                    text-xs
                                    text-black/40
                                    line-through
                                "
                            >
                                Rs.
                                {labelledPrice.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* =================================================
                        ADD TO CART BUTTON
                    ================================================= */}

                    <button
                        type="button"
                        disabled={
                            isOutOfStock ||
                            isAdding
                        }
                        onClick={
                            handleAddToCart
                        }
                        aria-label={
                            isOutOfStock
                                ? "Product sold out"
                                : `Add ${productName} to cart`
                        }
                        className={`
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-full
                            shadow-sm
                            transition-all
                            duration-200
                            ${
                                isAdding
                                    ? "rotate-0 bg-[#FF8F00] text-[#0A0A0A]"
                                    : "bg-[#0A0A0A] text-[#F5F5DC] hover:-translate-y-0.5 hover:rotate-90 hover:bg-[#FF8F00] hover:text-[#0A0A0A] hover:shadow-[0_7px_18px_rgba(255,143,0,0.25)]"
                            }
                            disabled:pointer-events-none
                            disabled:bg-black/25
                        `}
                    >
                        {isAdding ? (
                            <Check
                                className="
                                    h-[18px]
                                    w-[18px]
                                "
                                strokeWidth={2.2}
                            />
                        ) : (
                            <Plus
                                className="
                                    h-[18px]
                                    w-[18px]
                                "
                                strokeWidth={2}
                            />
                        )}
                    </button>
                </div>
            </div>
        </article>
    );
}

