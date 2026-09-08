import { Heart, Plus, Star, ImageOff } from "lucide-react";
import { useState } from "react";

export default function ProdcutCard(props) {
    const product = props.product;

    // =========================================================
    // PRODUCT DATA FROM props.product
    // =========================================================

    const productName = product?.name || "Unnamed Product";

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
            Number(product?.rating ?? product?.ratings ?? 0) || 0
        )
    );

    const validImages = Array.isArray(product?.images)
        ? product.images.filter(
              (image) =>
                  typeof image === "string" && image.trim() !== ""
          )
        : [];

    const [imageIndex, setImageIndex] = useState(0);
    const [imageError, setImageError] = useState(false);

    const currentImage = validImages[imageIndex];

    const isOutOfStock =
        product?.stock === 0 ||
        product?.availability === "out-of-stock" ||
        product?.status === "out-of-stock" ||
        product?.isOutOfStock === true;

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

    return (
        <article
            className="
                group
                relative
                w-full
                max-w-[320px]
                overflow-hidden
                rounded-[6px]
                border
                border-black/15
                bg-[#F5F5DC]
                text-[#0A0A0A]
                transition-all
                duration-300
                ease-out
                hover:-translate-y-[6px]
                hover:border-black/30
                hover:shadow-[0_22px_40px_rgba(10,10,10,0.12)]
            "
        >

            {/* =================================================
                CORNER BRACKETS
            ================================================= */}

            <span
                className="
                    pointer-events-none
                    absolute
                    left-[10px]
                    top-[10px]
                    z-20
                    h-[14px]
                    w-[14px]
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
                    z-20
                    h-[14px]
                    w-[14px]
                    border-b-2
                    border-r-2
                    border-black/50
                "
            />

            {/* =================================================
                IMAGE SECTION
            ================================================= */}

            <div
                className={`
                    relative
                    flex
                    h-[200px]
                    w-full
                    items-center
                    justify-center
                    overflow-hidden
                    bg-[#ECE8D6]
                    bg-[radial-gradient(circle_at_50%_30%,rgba(255,143,0,0.10),transparent_60%)]
                    before:pointer-events-none
                    before:absolute
                    before:inset-0
                    before:bg-[repeating-linear-gradient(45deg,rgba(10,10,10,0.03)_0_1px,transparent_1px_18px)]
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
                        z-10
                        rounded-[2px]
                        px-[9px]
                        py-[5px]
                        font-mono
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.08em]

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
                    {
                        isOutOfStock
                            ? "SOLD OUT"
                            : isSale
                                ? "SALE"
                                : product?.featured
                                    ? "FEATURED"
                                    : "NEW"
                    }
                </span>

                {/* =================================================
                    WISHLIST
                ================================================= */}

                <button
                    type="button"
                    aria-label={`Add ${productName} to wishlist`}
                    className="
                        absolute
                        right-[10px]
                        top-[10px]
                        z-10
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        bg-[#F5F5DC]/90
                        text-[#0A0A0A]
                        shadow-sm
                        transition-all
                        duration-200
                        hover:bg-[#0A0A0A]
                        hover:text-[#FF8F00]
                    "
                >
                    <Heart
                        className="h-[15px] w-[15px]"
                        strokeWidth={1.8}
                    />
                </button>

                {/* =================================================
                    PRODUCT IMAGE
                ================================================= */}

                {currentImage && !imageError ? (
                    <img
                        key={currentImage}
                        src={currentImage}
                        alt={productName}
                        loading="lazy"
                        decoding="async"
                        onError={handleImageError}
                        className="
                            relative
                            z-[1]
                            h-full
                            w-full
                            object-contain
                            p-5
                            drop-shadow-[0_12px_14px_rgba(10,10,10,0.15)]
                            transition-transform
                            duration-500
                            ease-out
                            group-hover:-translate-y-1
                            group-hover:scale-[1.08]
                        "
                    />
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

                {validImages.length > 1 && !imageError && (
                    <div
                        className="
                            absolute
                            bottom-3
                            left-1/2
                            z-10
                            flex
                            -translate-x-1/2
                            items-center
                            gap-1.5
                            rounded-full
                            bg-[#F5F5DC]/90
                            px-2.5
                            py-1.5
                            shadow-sm
                        "
                    >
                        {validImages.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                aria-label={`View image ${index + 1}`}
                                onClick={() =>
                                    handleImageChange(index)
                                }
                                className={`
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    transition-all
                                    ${
                                        index === imageIndex
                                            ? "scale-125 bg-[#FF8F00]"
                                            : "bg-black/25"
                                    }
                                `}
                            />
                        ))}
                    </div>
                )}

            </div>

            {/* =================================================
                PRODUCT BODY
            ================================================= */}

            <div className="p-[18px] pb-5">

                {/* =================================================
                    SERIES
                ================================================= */}

                <div
                    className="
                        mb-[6px]
                        line-clamp-1
                        text-[10.5px]
                        font-medium
                        uppercase
                        tracking-[0.1em]
                        text-[#CC7000]
                    "
                >
                    {
                        product?.series ||
                        product?.category ||
                        "Collection"
                    }
                </div>

                {/* =================================================
                    NAME
                ================================================= */}

                <h3
                    className="
                        mb-[6px]
                        line-clamp-1
                        font-sans
                        text-[16.5px]
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
                        text-[11px]
                        uppercase
                        text-black/45
                    "
                >
                    {product?.scale || "1:64 SCALE"}

                    {" — "}

                    {
                        product?.productType ||
                        product?.vehicleType ||
                        "DIE-CAST"
                    }

                    {" — "}

                    {product?.condition || "NEW"}
                </div>

                {/* =================================================
                    RATING
                ================================================= */}

                <div
                    className="
                        mb-[14px]
                        flex
                        items-center
                        gap-1
                    "
                >
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`
                                h-3
                                w-3
                                ${
                                    star <= safeRating
                                        ? "text-[#FF8F00]"
                                        : "text-black/15"
                                }
                            `}
                            fill={
                                star <= safeRating
                                    ? "currentColor"
                                    : "none"
                            }
                            strokeWidth={1}
                        />
                    ))}

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
                    PRICE
                ================================================= */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                    "
                >
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
                                text-[17px]
                                font-semibold
                                text-[#0A0A0A]
                            "
                        >
                            {
                                hasPrice
                                    ? `$${productPrice.toLocaleString()}`
                                    : "Price N/A"
                            }
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
                                $
                                {labelledPrice.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* =================================================
                        ADD BUTTON
                    ================================================= */}

                    <button
                        type="button"
                        disabled={isOutOfStock}
                        aria-label={
                            isOutOfStock
                                ? "Product sold out"
                                : `Add ${productName} to cart`
                        }
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-[#0A0A0A]
                            text-[#F5F5DC]
                            transition-all
                            duration-200
                            hover:bg-[#FF8F00]
                            hover:text-[#0A0A0A]
                            hover:rotate-90
                            disabled:pointer-events-none
                            disabled:bg-black/25
                        "
                    >
                        <Plus
                            className="h-[15px] w-[15px]"
                            strokeWidth={2}
                        />
                    </button>

                </div>

            </div>

        </article>
    );
}