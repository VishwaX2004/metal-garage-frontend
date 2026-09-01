import { Heart, Plus, Star } from "lucide-react";

export default function ProdcutCard(props) {

    const product = props.product;

    const isSale = product.labelledPrice > product.price;

    const isOutOfStock =
        product.quantity !== undefined && product.quantity <= 0;

    return (

        <div
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

            {/* ================= CORNER BRACKETS ================= */}

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


            {/* ================= IMAGE ================= */}

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
                    before:absolute
                    before:inset-0
                    before:bg-[repeating-linear-gradient(45deg,rgba(10,10,10,0.03)_0_1px,transparent_1px_18px)]
                    ${isOutOfStock ? "grayscale-[0.6] opacity-70" : ""}
                `}
            >

                {/* ================= BADGE ================= */}

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
                                    : product.featured
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
                                : product.featured
                                    ? "FEATURED"
                                    : "NEW"
                    }
                </span>


                {/* ================= WISHLIST ================= */}

                <button
                    type="button"
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
                        bg-[#F5F5DC]/85
                        text-[#0A0A0A]
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


                {/* ================= PRODUCT IMAGE ================= */}

                {
                    product.images && product.images.length > 0 ? (

                        <img
                            src={product.images[0]}
                            alt={product.name}
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

                        <div
                            className="
                                relative
                                z-[1]
                                flex
                                h-full
                                w-full
                                items-center
                                justify-center
                                font-mono
                                text-xs
                                uppercase
                                tracking-widest
                                text-black/30
                            "
                        >
                            No Image
                        </div>

                    )}

            </div>


            {/* ================= PRODUCT BODY ================= */}

            <div className="p-[18px] pb-5">


                {/* ================= SERIES ================= */}

                <div
                    className="
                        mb-[6px]
                        text-[10.5px]
                        font-medium
                        uppercase
                        tracking-[0.1em]
                        text-[#CC7000]
                    "
                >
                    {product.series || product.category}
                </div>


                {/* ================= NAME ================= */}

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
                >
                    {product.name}
                </h3>


                {/* ================= PRODUCT SPEC ================= */}

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
                    {product.scale || "1:64"} SCALE
                    {" — "}
                    {product.productType || "DIE-CAST"}
                    {" — "}
                    {product.condition || "NEW"}
                </div>


                {/* ================= RATING ================= */}

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
                            className="h-3 w-3 text-[#FF8F00]"
                            fill="currentColor"
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
                        5.0
                    </span>

                </div>


                {/* ================= PRICE ================= */}

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
                            ${product.price}
                        </span>

                        {
                            isSale && (

                                <span
                                    className="
                                        font-mono
                                        text-xs
                                        text-black/40
                                        line-through
                                    "
                                >
                                    ${product.labelledPrice}
                                </span>

                            )
                        }

                    </div>


                    {/* ================= ADD BUTTON ================= */}

                    <button
                        type="button"
                        disabled={isOutOfStock}
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

        </div>

    );
}