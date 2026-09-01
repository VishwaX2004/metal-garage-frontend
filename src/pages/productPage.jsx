import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    ChevronLeft,
    ChevronRight,
    Grid2X2,
    List,
    SlidersHorizontal,
    X,
} from "lucide-react";

import { Loader } from "../components/loader";
import Header from "../components/header";
import Footer from "../components/footer";
import ProdcutCard from "../components/productCard";


export default function ProductPage() {

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    /* ================= FILTER STATES ================= */

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedScales, setSelectedScales] = useState([]);
    const [selectedAvailability, setSelectedAvailability] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);

    /*
     * IMPORTANT:
     * Don't hard-code 150 here.
     * Your products can have prices like 3500, 5000, 12000 etc.
     */
    const [maxPrice, setMaxPrice] = useState(null);

    const [sortBy, setSortBy] = useState("Featured");
    const [viewMode, setViewMode] = useState("grid");
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const productsPerPage = 9;


    /* ================= FETCH PRODUCTS ================= */

    useEffect(() => {

        let mounted = true;

        axios
            .get(import.meta.env.VITE_API_URL + "/api/products")
            .then((response) => {

                if (!mounted) return;

                /*
                 * Your backend returns:
                 *
                 * res.status(200).json(products)
                 *
                 * So normally response.data is an array.
                 *
                 * This also safely supports { products: [] }.
                 */
                const data = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data?.products)
                        ? response.data.products
                        : [];

                setProducts(data);

                /*
                 * Find the highest actual product price.
                 */
                const prices = data
                    .map((product) => Number(product?.price))
                    .filter(
                        (price) =>
                            Number.isFinite(price) &&
                            price >= 0
                    );

                const highestPrice =
                    prices.length > 0
                        ? Math.max(...prices)
                        : 150;

                setMaxPrice(highestPrice);

                setIsLoading(false);

            })
            .catch((error) => {

                console.error(
                    "Error fetching products:",
                    error
                );

                setProducts([]);
                setMaxPrice(150);
                setIsLoading(false);

            });

        return () => {
            mounted = false;
        };

    }, []);


    /* ================= PRICE RANGE ================= */

    const priceRange = useMemo(() => {

        const prices = products
            .map((product) => Number(product?.price))
            .filter(
                (price) =>
                    Number.isFinite(price) &&
                    price >= 0
            );

        if (prices.length === 0) {
            return {
                min: 0,
                max: 150,
            };
        }

        return {
            min: 0,
            max: Math.max(...prices),
        };

    }, [products]);


    /*
     * Make sure maxPrice always has a valid value.
     */
    const currentMaxPrice =
        maxPrice === null
            ? priceRange.max
            : Math.min(
                Math.max(
                    Number(maxPrice),
                    priceRange.min
                ),
                priceRange.max
            );


    /* ================= NORMALIZE VALUE ================= */

    const normalize = (value) => {

        if (value === undefined || value === null) {
            return "";
        }

        return String(value)
            .trim()
            .toLowerCase();

    };


    /* ================= CATEGORY ================= */

    const getCategoryName = (product) => {

        const category = normalize(product?.category);

        switch (category) {

            case "main line":
                return "Hot Wheels";

            case "premium":
                return "Premium";

            case "silver series":
                return "Silver Series";

            case "fantasy":
                return "Fantasy";

            default:
                return product?.category || "Other";

        }

    };


    const matchesCategory = (product, filter) => {

        const category = normalize(product?.category);
        const series = normalize(product?.series);
        const name = normalize(product?.name);
        const vehicleType = normalize(product?.vehicleType);
        const casting = normalize(product?.casting);
        const manufacturer = normalize(product?.manufacturer);
        const model = normalize(product?.model);

        if (filter === "Hot Wheels") {

            return (
                category === "main line" ||
                category === "hot wheels"
            );

        }


        if (filter === "Premium") {

            return category === "premium";

        }


        if (filter === "JDM Legends") {

            return (
                vehicleType === "jdm" ||
                series.includes("jdm") ||
                name.includes("jdm") ||
                name.includes("skyline") ||
                name.includes("supra") ||
                name.includes("rx-7") ||
                name.includes("rx7") ||
                casting.includes("skyline") ||
                casting.includes("supra") ||
                casting.includes("rx-7") ||
                casting.includes("rx7") ||
                model.includes("skyline") ||
                model.includes("supra")
            );

        }


        if (filter === "Muscle Cars") {

            return (
                vehicleType === "muscle car" ||
                vehicleType === "muscle"
            );

        }


        if (filter === "Supercars") {

            return (
                vehicleType === "supercar" ||
                vehicleType === "hypercar"
            );

        }


        if (filter === "Rare Finds") {

            const condition = normalize(product?.condition);
            const status = normalize(product?.status);

            return (
                product?.featured === true ||
                condition === "mint" ||
                condition === "near mint" ||
                status === "coming soon"
            );

        }


        if (filter === "Silver Series") {

            return category === "silver series";

        }


        if (filter === "Fantasy") {

            return category === "fantasy";

        }


        return false;

    };


    /* ================= AVAILABILITY ================= */

    const matchesAvailability = (
        product,
        filter
    ) => {

        const quantity = Number(
            product?.quantity ?? 0
        );

        const inStock =
            product?.inStock === true ||
            quantity > 0;


        if (filter === "In Stock") {

            return inStock;

        }


        if (filter === "Limited Run") {

            return (
                inStock &&
                quantity > 0 &&
                quantity <= 10
            );

        }


        if (filter === "Sold Out") {

            return (
                product?.inStock === false ||
                quantity <= 0
            );

        }


        return false;

    };


    /* ================= COLOR ================= */

    const matchesColor = (
        product,
        color
    ) => {

        if (!color) {
            return true;
        }

        const productColor =
            normalize(product?.color);

        const selectedColor =
            normalize(color);

        return (
            productColor === selectedColor ||
            productColor.includes(selectedColor)
        );

    };


    /* ================= TOGGLE FILTER ================= */

    const toggleFilter = (
        value,
        selected,
        setter
    ) => {

        if (selected.includes(value)) {

            setter(
                selected.filter(
                    (item) => item !== value
                )
            );

        } else {

            setter([
                ...selected,
                value
            ]);

        }

        setCurrentPage(1);

    };


    /* ================= FILTER + SORT ================= */

    const filteredProducts = useMemo(() => {

        let result = [...products];


        /* ---------- CATEGORY ---------- */

        if (selectedCategories.length > 0) {

            result = result.filter(
                (product) =>
                    selectedCategories.some(
                        (category) =>
                            matchesCategory(
                                product,
                                category
                            )
                    )
            );

        }


        /* ---------- SCALE ---------- */

        if (selectedScales.length > 0) {

            result = result.filter(
                (product) => {

                    const productScale =
                        normalize(product?.scale);

                    return selectedScales.some(
                        (scale) =>
                            productScale ===
                            normalize(scale)
                    );

                }
            );

        }


        /* ---------- PRICE ---------- */

        /*
         * FIXED:
         *
         * Previously:
         * price <= 150
         *
         * Now:
         * price <= actual maximum selected price.
         */
        if (maxPrice !== null) {

            result = result.filter(
                (product) => {

                    const price =
                        Number(product?.price);

                    if (!Number.isFinite(price)) {
                        return false;
                    }

                    return (
                        price <= currentMaxPrice
                    );

                }
            );

        }


        /* ---------- AVAILABILITY ---------- */

        if (
            selectedAvailability.length > 0
        ) {

            result = result.filter(
                (product) =>
                    selectedAvailability.some(
                        (availability) =>
                            matchesAvailability(
                                product,
                                availability
                            )
                    )
            );

        }


        /* ---------- COLOR ---------- */

        if (selectedColor) {

            result = result.filter(
                (product) =>
                    matchesColor(
                        product,
                        selectedColor
                    )
            );

        }


        /* ---------- SORT ---------- */

        switch (sortBy) {

            case "Newest Arrivals":

                result.sort(
                    (a, b) =>
                        new Date(
                            b?.createdAt || 0
                        ) -
                        new Date(
                            a?.createdAt || 0
                        )
                );

                break;


            case "Price: Low to High":

                result.sort(
                    (a, b) =>
                        Number(a?.price || 0) -
                        Number(b?.price || 0)
                );

                break;


            case "Price: High to Low":

                result.sort(
                    (a, b) =>
                        Number(b?.price || 0) -
                        Number(a?.price || 0)
                );

                break;


            case "Highest Rated":

                result.sort(
                    (a, b) =>
                        Number(b?.rating || 0) -
                        Number(a?.rating || 0)
                );

                break;


            case "Featured":

                result.sort(
                    (a, b) =>
                        Number(Boolean(b?.featured)) -
                        Number(Boolean(a?.featured))
                );

                break;


            default:
                break;

        }


        return result;

    }, [
        products,
        selectedCategories,
        selectedScales,
        selectedAvailability,
        selectedColor,
        maxPrice,
        currentMaxPrice,
        sortBy,
    ]);


    /* ================= PAGINATION ================= */

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredProducts.length /
            productsPerPage
        )
    );


    const safeCurrentPage = Math.min(
        currentPage,
        totalPages
    );


    const startIndex =
        (safeCurrentPage - 1) *
        productsPerPage;


    const paginatedProducts =
        filteredProducts.slice(
            startIndex,
            startIndex + productsPerPage
        );


    /* ================= RESET PAGE ================= */

    useEffect(() => {

        if (currentPage > totalPages) {

            setCurrentPage(totalPages);

        }

    }, [
        currentPage,
        totalPages
    ]);


    /* ================= CLEAR FILTERS ================= */

    const clearFilters = () => {

        setSelectedCategories([]);
        setSelectedScales([]);
        setSelectedAvailability([]);
        setSelectedColor(null);

        /*
         * Reset to actual maximum price.
         */
        setMaxPrice(priceRange.max);

        setSortBy("Featured");
        setCurrentPage(1);

    };


    /* ================= ACTIVE FILTER COUNT ================= */

    const activeFilterCount =
        selectedCategories.length +
        selectedScales.length +
        selectedAvailability.length +
        (selectedColor ? 1 : 0) +
        (
            currentMaxPrice <
            priceRange.max
                ? 1
                : 0
        );


    /* ================= CATEGORY COUNT ================= */

    const categoryCount = (category) => {

        return products.filter(
            (product) =>
                matchesCategory(
                    product,
                    category
                )
        ).length;

    };


    /* ================= SCALE COUNT ================= */

    const scaleCount = (scale) => {

        return products.filter(
            (product) =>
                normalize(product?.scale) ===
                normalize(scale)
        ).length;

    };


    /* ================= AVAILABILITY COUNT ================= */

    const availabilityCount = (
        availability
    ) => {

        return products.filter(
            (product) =>
                matchesAvailability(
                    product,
                    availability
                )
        ).length;

    };


    /* ================= LOADING ================= */

    if (isLoading) {

        return (

            <main
                className="
                    w-full
                    min-h-screen
                    flex
                    flex-col
                    pt-[78px]
                "
            >

                <Header />

                <div
                    className="
                        flex-1
                        w-full
                        min-h-[calc(100vh-78px)]
                        flex
                        items-center
                        justify-center
                        bg-[#F5F5DC]
                    "
                >

                    <Loader />

                </div>

                <Footer />

            </main>

        );

    }


    return (

        <main
            className="
                w-full
                min-h-screen
                flex
                flex-col
                pt-[78px]
                bg-[#F5F5DC]
            "
        >

            <Header />


            {/* =====================================================
                SHOP HERO
            ====================================================== */}

            <section
                className="
                    relative
                    overflow-hidden
                    bg-[#0A0A0A]
                    px-5
                    pb-[46px]
                    pt-[70px]
                    text-[#F5F5DC]
                    md:px-10
                    lg:pt-[90px]
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-[radial-gradient(ellipse_at_82%_20%,rgba(255,143,0,0.10),transparent_55%),repeating-linear-gradient(115deg,rgba(245,245,220,0.025)_0_1px,transparent_1px_64px)]
                    "
                />

                <div
                    className="
                        relative
                        mx-auto
                        max-w-[1320px]
                    "
                >

                    <div
                        className="
                            mb-[18px]
                            flex
                            items-center
                            gap-2
                            font-mono
                            text-[12px]
                            tracking-[0.06em]
                            text-[#F5F5DC]/50
                        "
                    >

                        <span
                            className="
                                hover:text-[#FF8F00]
                            "
                        >
                            Home
                        </span>

                        <span className="opacity-50">
                            /
                        </span>

                        <span>
                            Shop
                        </span>

                    </div>


                    <h1
                        className="
                            mb-2
                            font-sans
                            text-[clamp(34px,4.4vw,54px)]
                            font-bold
                            uppercase
                            leading-none
                            tracking-tight
                        "
                    >

                        Shop the{" "}

                        <em
                            className="
                                not-italic
                                text-[#FF8F00]
                            "
                        >
                            garage.
                        </em>

                    </h1>


                    <p
                        className="
                            max-w-[480px]
                            text-[15px]
                            leading-[1.6]
                            text-[#F5F5DC]/70
                        "
                    >
                        Browse the full catalog — every casting,
                        every series, every rarity tier, all in one place.
                    </p>

                </div>

            </section>


            {/* =====================================================
                SHOP SECTION
            ====================================================== */}

            <section
                className="
                    flex-1
                    px-5
                    py-[52px]
                    pb-[110px]
                    md:px-10
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-[1320px]
                    "
                >

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-[44px]
                            lg:grid-cols-[260px_minmax(0,1fr)]
                        "
                    >


                        {/* =================================================
                            MOBILE FILTER OVERLAY
                        ================================================= */}

                        {
                            filtersOpen && (

                                <div
                                    className="
                                        fixed
                                        inset-0
                                        z-[1300]
                                        bg-black/40
                                        lg:hidden
                                    "
                                    onClick={() =>
                                        setFiltersOpen(false)
                                    }
                                />

                            )
                        }


                        {/* =================================================
                            FILTER SIDEBAR
                        ================================================= */}

                        <aside
                            className={`
                                fixed
                                inset-y-0
                                left-0
                                z-[1400]
                                w-[80%]
                                max-w-[360px]
                                overflow-y-auto
                                bg-[#F5F5DC]
                                px-7
                                pb-7
                                pt-[90px]
                                shadow-[20px_0_40px_rgba(0,0,0,0.2)]
                                transition-transform
                                duration-300
                                lg:sticky
                                lg:top-[100px]
                                lg:z-auto
                                lg:block
                                lg:w-auto
                                lg:max-w-none
                                lg:overflow-visible
                                lg:bg-transparent
                                lg:p-0
                                lg:shadow-none
                                ${
                                    filtersOpen
                                        ? "translate-x-0"
                                        : "-translate-x-full lg:translate-x-0"
                                }
                            `}
                        >

                            {/* Mobile Close */}

                            <button
                                type="button"
                                onClick={() =>
                                    setFiltersOpen(false)
                                }
                                className="
                                    absolute
                                    right-6
                                    top-6
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    text-[#0A0A0A]
                                    transition-colors
                                    hover:text-[#FF8F00]
                                    lg:hidden
                                "
                            >

                                <X
                                    className="
                                        h-[18px]
                                        w-[18px]
                                    "
                                />

                            </button>


                            {/* ================= CATEGORY ================= */}

                            <FilterBlock title="Category">

                                <FilterCheckbox
                                    id="cat-hot-wheels"
                                    label="Hot Wheels"
                                    count={categoryCount("Hot Wheels")}
                                    checked={selectedCategories.includes("Hot Wheels")}
                                    onChange={() =>
                                        toggleFilter(
                                            "Hot Wheels",
                                            selectedCategories,
                                            setSelectedCategories
                                        )
                                    }
                                />

                                <FilterCheckbox
                                    id="cat-premium"
                                    label="Premium"
                                    count={categoryCount("Premium")}
                                    checked={selectedCategories.includes("Premium")}
                                    onChange={() =>
                                        toggleFilter(
                                            "Premium",
                                            selectedCategories,
                                            setSelectedCategories
                                        )
                                    }
                                />

                                <FilterCheckbox
                                    id="cat-jdm"
                                    label="JDM Legends"
                                    count={categoryCount("JDM Legends")}
                                    checked={selectedCategories.includes("JDM Legends")}
                                    onChange={() =>
                                        toggleFilter(
                                            "JDM Legends",
                                            selectedCategories,
                                            setSelectedCategories
                                        )
                                    }
                                />

                                <FilterCheckbox
                                    id="cat-muscle"
                                    label="Muscle Cars"
                                    count={categoryCount("Muscle Cars")}
                                    checked={selectedCategories.includes("Muscle Cars")}
                                    onChange={() =>
                                        toggleFilter(
                                            "Muscle Cars",
                                            selectedCategories,
                                            setSelectedCategories
                                        )
                                    }
                                />

                                <FilterCheckbox
                                    id="cat-super"
                                    label="Supercars"
                                    count={categoryCount("Supercars")}
                                    checked={selectedCategories.includes("Supercars")}
                                    onChange={() =>
                                        toggleFilter(
                                            "Supercars",
                                            selectedCategories,
                                            setSelectedCategories
                                        )
                                    }
                                />

                                <FilterCheckbox
                                    id="cat-rare"
                                    label="Rare Finds"
                                    count={categoryCount("Rare Finds")}
                                    checked={selectedCategories.includes("Rare Finds")}
                                    onChange={() =>
                                        toggleFilter(
                                            "Rare Finds",
                                            selectedCategories,
                                            setSelectedCategories
                                        )
                                    }
                                />

                            </FilterBlock>


                            {/* ================= PRICE ================= */}

                            <FilterBlock title="Price">

                                <input
                                    type="range"
                                    min={priceRange.min}
                                    max={priceRange.max}
                                    value={currentMaxPrice}
                                    onChange={(e) => {

                                        setMaxPrice(
                                            Number(
                                                e.target.value
                                            )
                                        );

                                        setCurrentPage(1);

                                    }}
                                    className="
                                        w-full
                                        accent-[#FF8F00]
                                    "
                                />

                                <div
                                    className="
                                        mt-[10px]
                                        flex
                                        justify-between
                                        font-mono
                                        text-[12px]
                                        text-black/60
                                    "
                                >

                                    <span>
                                        ${priceRange.min}
                                    </span>

                                    <span>
                                        Up to ${currentMaxPrice}
                                    </span>

                                    <span>
                                        ${priceRange.max}
                                    </span>

                                </div>

                            </FilterBlock>


                            {/* ================= SCALE ================= */}

                            <FilterBlock title="Scale">

                                <FilterCheckbox
                                    id="scale-64"
                                    label="1:64"
                                    count={scaleCount("1:64")}
                                    checked={selectedScales.includes("1:64")}
                                    onChange={() =>
                                        toggleFilter(
                                            "1:64",
                                            selectedScales,
                                            setSelectedScales
                                        )
                                    }
                                />

                                <FilterCheckbox
                                    id="scale-43"
                                    label="1:43"
                                    count={scaleCount("1:43")}
                                    checked={selectedScales.includes("1:43")}
                                    onChange={() =>
                                        toggleFilter(
                                            "1:43",
                                            selectedScales,
                                            setSelectedScales
                                        )
                                    }
                                />

                                <FilterCheckbox
                                    id="scale-18"
                                    label="1:18"
                                    count={scaleCount("1:18")}
                                    checked={selectedScales.includes("1:18")}
                                    onChange={() =>
                                        toggleFilter(
                                            "1:18",
                                            selectedScales,
                                            setSelectedScales
                                        )
                                    }
                                />

                            </FilterBlock>


                            {/* ================= AVAILABILITY ================= */}

                            <FilterBlock title="Availability">

                                <FilterCheckbox
                                    id="availability-stock"
                                    label="In Stock"
                                    count={availabilityCount("In Stock")}
                                    checked={selectedAvailability.includes("In Stock")}
                                    onChange={() =>
                                        toggleFilter(
                                            "In Stock",
                                            selectedAvailability,
                                            setSelectedAvailability
                                        )
                                    }
                                />

                                <FilterCheckbox
                                    id="availability-limited"
                                    label="Limited Run"
                                    count={availabilityCount("Limited Run")}
                                    checked={selectedAvailability.includes("Limited Run")}
                                    onChange={() =>
                                        toggleFilter(
                                            "Limited Run",
                                            selectedAvailability,
                                            setSelectedAvailability
                                        )
                                    }
                                />

                                <FilterCheckbox
                                    id="availability-sold"
                                    label="Sold Out"
                                    count={availabilityCount("Sold Out")}
                                    checked={selectedAvailability.includes("Sold Out")}
                                    onChange={() =>
                                        toggleFilter(
                                            "Sold Out",
                                            selectedAvailability,
                                            setSelectedAvailability
                                        )
                                    }
                                />

                            </FilterBlock>


                            {/* ================= FINISH ================= */}

                            <div
                                className="
                                    border-b
                                    border-black/10
                                    py-[22px]
                                "
                            >

                                <h4
                                    className="
                                        mb-4
                                        font-sans
                                        text-[13px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.08em]
                                    "
                                >
                                    Finish
                                </h4>


                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        gap-[9px]
                                    "
                                >

                                    <ColorSwatch
                                        title="Black"
                                        color="#0A0A0A"
                                        active={
                                            selectedColor === "Black"
                                        }
                                        onClick={() =>
                                            setSelectedColor(
                                                selectedColor === "Black"
                                                    ? null
                                                    : "Black"
                                            )
                                        }
                                    />

                                    <ColorSwatch
                                        title="Orange"
                                        color="#FF8F00"
                                        active={
                                            selectedColor === "Orange"
                                        }
                                        onClick={() =>
                                            setSelectedColor(
                                                selectedColor === "Orange"
                                                    ? null
                                                    : "Orange"
                                            )
                                        }
                                    />

                                    <ColorSwatch
                                        title="Alloy"
                                        color="#C7C2AC"
                                        active={
                                            selectedColor === "Alloy"
                                        }
                                        onClick={() =>
                                            setSelectedColor(
                                                selectedColor === "Alloy"
                                                    ? null
                                                    : "Alloy"
                                            )
                                        }
                                    />

                                    <ColorSwatch
                                        title="Red"
                                        color="#8C1D1D"
                                        active={
                                            selectedColor === "Red"
                                        }
                                        onClick={() =>
                                            setSelectedColor(
                                                selectedColor === "Red"
                                                    ? null
                                                    : "Red"
                                            )
                                        }
                                    />

                                    <ColorSwatch
                                        title="Blue"
                                        color="#1F3A5C"
                                        active={
                                            selectedColor === "Blue"
                                        }
                                        onClick={() =>
                                            setSelectedColor(
                                                selectedColor === "Blue"
                                                    ? null
                                                    : "Blue"
                                            )
                                        }
                                    />

                                    <ColorSwatch
                                        title="Cream"
                                        color="#F5F5DC"
                                        active={
                                            selectedColor === "Cream"
                                        }
                                        onClick={() =>
                                            setSelectedColor(
                                                selectedColor === "Cream"
                                                    ? null
                                                    : "Cream"
                                            )
                                        }
                                    />

                                </div>

                            </div>


                            {/* ================= CLEAR ================= */}

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="
                                    mt-1
                                    font-mono
                                    text-[12px]
                                    uppercase
                                    tracking-[0.06em]
                                    text-[#CC7000]
                                    transition-colors
                                    hover:text-[#FF8F00]
                                "
                            >
                                Clear all filters
                            </button>

                        </aside>


                        {/* =================================================
                            MAIN COLUMN
                        ================================================= */}

                        <div className="min-w-0">


                            {/* ================= TOOLBAR ================= */}

                            <div
                                className="
                                    mb-[26px]
                                    flex
                                    flex-wrap
                                    items-center
                                    justify-between
                                    gap-5
                                    border-b
                                    border-black/10
                                    pb-[22px]
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-4
                                    "
                                >

                                    {/* Mobile Filter */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFiltersOpen(true)
                                        }
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2.5
                                            rounded-[2px]
                                            border
                                            border-black/15
                                            px-[18px]
                                            py-[11px]
                                            text-[12px]
                                            uppercase
                                            tracking-[0.08em]
                                            transition-all
                                            hover:border-black
                                            lg:hidden
                                        "
                                    >

                                        <SlidersHorizontal
                                            className="
                                                h-[15px]
                                                w-[15px]
                                            "
                                        />

                                        Filters

                                        {
                                            activeFilterCount > 0 && (

                                                <span
                                                    className="
                                                        flex
                                                        h-[17px]
                                                        min-w-[17px]
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-[#FF8F00]
                                                        px-1
                                                        text-[9px]
                                                        font-bold
                                                    "
                                                >
                                                    {activeFilterCount}
                                                </span>

                                            )
                                        }

                                    </button>


                                    {/* Result Count */}

                                    <div
                                        className="
                                            text-[13.5px]
                                            text-black/60
                                        "
                                    >

                                        <strong
                                            className="
                                                text-[#0A0A0A]
                                            "
                                        >
                                            {filteredProducts.length}
                                        </strong>

                                        {" "}models found

                                    </div>

                                </div>


                                {/* Toolbar Right */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-4
                                    "
                                >

                                    {/* View Toggle */}

                                    <div className="flex">

                                        <button
                                            type="button"
                                            aria-label="Grid view"
                                            onClick={() =>
                                                setViewMode("grid")
                                            }
                                            className={`
                                                flex
                                                h-[34px]
                                                w-[34px]
                                                items-center
                                                justify-center
                                                border
                                                text-black/50
                                                transition-all
                                                ${
                                                    viewMode === "grid"
                                                        ? "border-[#0A0A0A] bg-[#ECE8D6] text-[#0A0A0A]"
                                                        : "border-black/10"
                                                }
                                            `}
                                        >

                                            <Grid2X2
                                                className="
                                                    h-[15px]
                                                    w-[15px]
                                                "
                                            />

                                        </button>


                                        <button
                                            type="button"
                                            aria-label="List view"
                                            onClick={() =>
                                                setViewMode("list")
                                            }
                                            className={`
                                                flex
                                                h-[34px]
                                                w-[34px]
                                                items-center
                                                justify-center
                                                border-y
                                                border-r
                                                text-black/50
                                                transition-all
                                                ${
                                                    viewMode === "list"
                                                        ? "border-[#0A0A0A] bg-[#ECE8D6] text-[#0A0A0A]"
                                                        : "border-black/10"
                                                }
                                            `}
                                        >

                                            <List
                                                className="
                                                    h-[15px]
                                                    w-[15px]
                                                "
                                            />

                                        </button>

                                    </div>


                                    {/* Sort */}

                                    <select
                                        value={sortBy}
                                        onChange={(e) => {

                                            setSortBy(
                                                e.target.value
                                            );

                                            setCurrentPage(1);

                                        }}
                                        className="
                                            appearance-none
                                            rounded-[2px]
                                            border
                                            border-black/10
                                            bg-[#F5F5DC]
                                            bg-[linear-gradient(45deg,transparent_50%,#0A0A0A_50%),linear-gradient(135deg,#0A0A0A_50%,transparent_50%)]
                                            bg-[position:calc(100%-14px)_14px,calc(100%-10px)_14px]
                                            bg-[length:4px_4px,4px_4px]
                                            bg-no-repeat
                                            px-[14px]
                                            py-[10px]
                                            pr-8
                                            font-mono
                                            text-[12px]
                                            tracking-[0.04em]
                                            outline-none
                                            transition-colors
                                            focus:border-black
                                        "
                                    >

                                        <option value="Featured">
                                            Featured
                                        </option>

                                        <option value="Newest Arrivals">
                                            Newest Arrivals
                                        </option>

                                        <option value="Price: Low to High">
                                            Price: Low to High
                                        </option>

                                        <option value="Price: High to Low">
                                            Price: High to Low
                                        </option>

                                        <option value="Highest Rated">
                                            Highest Rated
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* ================= ACTIVE TAGS ================= */}

                            {
                                activeFilterCount > 0 && (

                                    <div
                                        className="
                                            mb-6
                                            flex
                                            flex-wrap
                                            gap-2.5
                                        "
                                    >

                                        {
                                            selectedCategories.map(
                                                (category) => (

                                                    <ActiveTag
                                                        key={category}
                                                        label={category}
                                                        onRemove={() =>
                                                            toggleFilter(
                                                                category,
                                                                selectedCategories,
                                                                setSelectedCategories
                                                            )
                                                        }
                                                    />

                                                )
                                            )
                                        }


                                        {
                                            selectedScales.map(
                                                (scale) => (

                                                    <ActiveTag
                                                        key={scale}
                                                        label={`${scale} Scale`}
                                                        onRemove={() =>
                                                            toggleFilter(
                                                                scale,
                                                                selectedScales,
                                                                setSelectedScales
                                                            )
                                                        }
                                                    />

                                                )
                                            )
                                        }


                                        {
                                            selectedAvailability.map(
                                                (availability) => (

                                                    <ActiveTag
                                                        key={availability}
                                                        label={availability}
                                                        onRemove={() =>
                                                            toggleFilter(
                                                                availability,
                                                                selectedAvailability,
                                                                setSelectedAvailability
                                                            )
                                                        }
                                                    />

                                                )
                                            )
                                        }


                                        {
                                            selectedColor && (

                                                <ActiveTag
                                                    label={selectedColor}
                                                    onRemove={() =>
                                                        setSelectedColor(null)
                                                    }
                                                />

                                            )
                                        }


                                        {
                                            currentMaxPrice <
                                                priceRange.max && (

                                                <ActiveTag
                                                    label={`Up to $${currentMaxPrice}`}
                                                    onRemove={() => {
                                                        setMaxPrice(
                                                            priceRange.max
                                                        );
                                                        setCurrentPage(1);
                                                    }}
                                                />

                                            )
                                        }

                                    </div>

                                )
                            }


                            {/* ================= PRODUCTS ================= */}

                            {
                                paginatedProducts.length > 0 ? (

                                    <div
                                        className={`
                                            grid
                                            ${
                                                viewMode === "grid"
                                                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                                                    : "grid-cols-1"
                                            }
                                            gap-[22px]
                                        `}
                                    >

                                        {
                                            paginatedProducts.map(
                                                (item) => (

                                                    <div
                                                        key={
                                                            item.productID ||
                                                            item._id
                                                        }
                                                        className={`
                                                            flex
                                                            ${
                                                                viewMode === "grid"
                                                                    ? "justify-center"
                                                                    : "justify-start"
                                                            }
                                                        `}
                                                    >

                                                        <ProdcutCard
                                                            product={item}
                                                        />

                                                    </div>

                                                )
                                            )
                                        }

                                    </div>

                                ) : (

                                    <div
                                        className="
                                            flex
                                            min-h-[420px]
                                            flex-col
                                            items-center
                                            justify-center
                                            text-center
                                        "
                                    >

                                        <div
                                            className="
                                                mb-5
                                                flex
                                                h-16
                                                w-16
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-black/5
                                            "
                                        >

                                            <span className="text-2xl">
                                                🛍️
                                            </span>

                                        </div>


                                        <h2
                                            className="
                                                font-sans
                                                text-xl
                                                font-bold
                                                uppercase
                                            "
                                        >
                                            No Models Found
                                        </h2>


                                        <p
                                            className="
                                                mt-2
                                                text-sm
                                                text-black/50
                                            "
                                        >
                                            Try changing or clearing your filters.
                                        </p>


                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="
                                                mt-5
                                                rounded-[2px]
                                                bg-[#0A0A0A]
                                                px-5
                                                py-3
                                                font-mono
                                                text-[11px]
                                                uppercase
                                                tracking-[0.08em]
                                                text-[#F5F5DC]
                                                transition-all
                                                hover:-translate-y-0.5
                                                hover:bg-[#FF8F00]
                                                hover:text-[#0A0A0A]
                                            "
                                        >
                                            Clear Filters
                                        </button>

                                    </div>

                                )
                            }


                            {/* ================= PAGINATION ================= */}

                            {
                                filteredProducts.length > 0 && (

                                    <div
                                        className="
                                            mt-10
                                            flex
                                            items-center
                                            justify-center
                                            gap-1.5
                                        "
                                    >

                                        {/* Previous */}

                                        <button
                                            type="button"
                                            disabled={
                                                safeCurrentPage === 1
                                            }
                                            onClick={() =>
                                                setCurrentPage(
                                                    (page) =>
                                                        Math.max(
                                                            1,
                                                            page - 1
                                                        )
                                                )
                                            }
                                            className="
                                                flex
                                                h-[38px]
                                                min-w-[38px]
                                                items-center
                                                justify-center
                                                rounded-[2px]
                                                border
                                                border-black/10
                                                text-black/60
                                                transition-all
                                                hover:border-black
                                                hover:text-black
                                                disabled:pointer-events-none
                                                disabled:opacity-30
                                            "
                                        >

                                            <ChevronLeft
                                                className="
                                                    h-[14px]
                                                    w-[14px]
                                                "
                                            />

                                        </button>


                                        {/* Page Numbers */}

                                        {
                                            Array.from(
                                                {
                                                    length: totalPages
                                                },
                                                (_, index) =>
                                                    index + 1
                                            ).map(
                                                (page) => (

                                                    <button
                                                        key={page}
                                                        type="button"
                                                        onClick={() =>
                                                            setCurrentPage(
                                                                page
                                                            )
                                                        }
                                                        className={`
                                                            flex
                                                            h-[38px]
                                                            min-w-[38px]
                                                            items-center
                                                            justify-center
                                                            rounded-[2px]
                                                            border
                                                            font-mono
                                                            text-[12.5px]
                                                            transition-all
                                                            ${
                                                                safeCurrentPage === page
                                                                    ? "border-[#0A0A0A] bg-[#0A0A0A] text-[#F5F5DC]"
                                                                    : "border-black/10 text-black/60 hover:border-black hover:text-black"
                                                            }
                                                        `}
                                                    >

                                                        {page}

                                                    </button>

                                                )
                                            )
                                        }


                                        {/* Next */}

                                        <button
                                            type="button"
                                            disabled={
                                                safeCurrentPage ===
                                                totalPages
                                            }
                                            onClick={() =>
                                                setCurrentPage(
                                                    (page) =>
                                                        Math.min(
                                                            totalPages,
                                                            page + 1
                                                        )
                                                )
                                            }
                                            className="
                                                flex
                                                h-[38px]
                                                min-w-[38px]
                                                items-center
                                                justify-center
                                                rounded-[2px]
                                                border
                                                border-black/10
                                                text-black/60
                                                transition-all
                                                hover:border-black
                                                hover:text-black
                                                disabled:pointer-events-none
                                                disabled:opacity-30
                                            "
                                        >

                                            <ChevronRight
                                                className="
                                                    h-[14px]
                                                    w-[14px]
                                                "
                                            />

                                        </button>

                                    </div>

                                )
                            }

                        </div>

                    </div>

                </div>

            </section>


            <Footer />

        </main>

    );

}


/* =============================================================
   FILTER BLOCK
============================================================= */

function FilterBlock({
    title,
    children
}) {

    return (

        <div
            className="
                border-b
                border-black/10
                py-[22px]
                first:pt-0
            "
        >

            <h4
                className="
                    mb-4
                    flex
                    items-center
                    justify-between
                    font-sans
                    text-[13px]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                "
            >
                {title}
            </h4>


            <div
                className="
                    flex
                    flex-col
                    gap-[11px]
                "
            >
                {children}
            </div>

        </div>

    );

}


/* =============================================================
   FILTER CHECKBOX
============================================================= */

function FilterCheckbox({
    id,
    label,
    count,
    checked,
    onChange,
}) {

    return (

        <label
            htmlFor={id}
            className="
                flex
                cursor-pointer
                items-center
                justify-between
                gap-2.5
                text-[13.5px]
                text-black/75
            "
        >

            <span
                className="
                    flex
                    flex-1
                    items-center
                    gap-2.5
                "
            >

                <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="peer sr-only"
                />


                <span
                    className="
                        relative
                        h-4
                        w-4
                        shrink-0
                        rounded-[3px]
                        border-[1.5px]
                        border-black/35
                        transition-all
                        peer-checked:border-[#0A0A0A]
                        peer-checked:bg-[#0A0A0A]
                        peer-checked:after:absolute
                        peer-checked:after:left-[4px]
                        peer-checked:after:top-[1px]
                        peer-checked:after:h-2
                        peer-checked:after:w-1
                        peer-checked:after:rotate-45
                        peer-checked:after:border-b-2
                        peer-checked:after:border-r-2
                        peer-checked:after:border-[#FF8F00]
                    "
                />

                <span>
                    {label}
                </span>

            </span>


            <span
                className="
                    font-mono
                    text-[11.5px]
                    text-black/40
                "
            >
                ({count})
            </span>

        </label>

    );

}


/* =============================================================
   COLOR SWATCH
============================================================= */

function ColorSwatch({
    title,
    color,
    active,
    onClick,
}) {

    return (

        <button
            type="button"
            title={title}
            aria-label={title}
            onClick={onClick}
            className={`
                relative
                h-7
                w-7
                rounded-full
                border-[1.5px]
                border-black/15
                transition-transform
                duration-150
                hover:-translate-y-0.5
                ${
                    active
                        ? "after:absolute after:-inset-1 after:rounded-full after:border-[1.5px] after:border-[#0A0A0A]"
                        : ""
                }
            `}
            style={{
                backgroundColor: color,
            }}
        />

    );

}


/* =============================================================
   ACTIVE FILTER TAG
============================================================= */

function ActiveTag({
    label,
    onRemove,
}) {

    return (

        <span
            className="
                flex
                items-center
                gap-2
                rounded-[2px]
                bg-[#0A0A0A]
                px-[12px]
                py-[7px]
                font-mono
                text-[11.5px]
                uppercase
                tracking-[0.05em]
                text-[#F5F5DC]
            "
        >

            {label}

            <button
                type="button"
                onClick={onRemove}
                className="
                    text-[15px]
                    leading-none
                    text-[#FF8F00]
                    transition-colors
                    hover:text-[#F5F5DC]
                "
            >
                ×
            </button>

        </span>

    );

}