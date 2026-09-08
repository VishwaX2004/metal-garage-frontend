import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import mediaUpload from "../../utils/mediaUpload";

export default function AdminAddProduct() {
    const navigate = useNavigate();

    const [productID, setProductID] = useState("");
    const [name, setName] = useState("");
    const [altNames, setAltNames] = useState("");
    const [description, setDescription] = useState("");

    const [images, setImages] = useState([]);

    const [category, setCategory] = useState("Main Line");
    const [productType, setProductType] = useState("Single Car");
    const [carCount, setCarCount] = useState(1);

    const [price, setPrice] = useState(0);
    const [labelledPrice, setLabelledPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);

    const [year, setYear] = useState(new Date().getFullYear());
    const [series, setSeries] = useState("");
    const [casting, setCasting] = useState("");
    const [manufacturer, setManufacturer] = useState("");
    const [model, setModel] = useState("");
    const [vehicleType, setVehicleType] = useState("Other");
    const [color, setColor] = useState("");
    const [scale, setScale] = useState("1:64");
    const [seriesNumber, setSeriesNumber] = useState("");
    const [condition, setCondition] = useState("New");
    const [packaging, setPackaging] = useState("Carded");

    const [inStock, setInStock] = useState(true);
    const [featured, setFeatured] = useState(false);
    const [status, setStatus] = useState("Active");

    const [setloading, setIsloading] = useState(false);

    const categories = [
        "Main Line",
        "Premium",
        "Silver Series",
        "Fantasy",
    ];

    const productTypes = [
        "Single Car",
        "Car Pack",
    ];

    const vehicleTypes = [
        "Sports Car",
        "Supercar",
        "Hypercar",
        "Muscle Car",
        "Classic Car",
        "JDM",
        "Truck",
        "SUV",
        "Race Car",
        "Motorcycle",
        "Fantasy",
        "Other",
    ];

    const conditions = [
        "New",
        "Mint",
        "Near Mint",
        "Used",
    ];

    const packagingTypes = [
        "Carded",
        "Blister Pack",
        "Boxed",
        "Multi Pack",
    ];

    const statuses = [
        "Active",
        "Inactive",
        "Out of Stock",
        "Coming Soon",
    ];

    /* =========================================================
       IMAGE SELECTION
    ========================================================= */

    function handleImageChange(e) {
        const selectedFiles = Array.from(e.target.files || []);

        setImages(selectedFiles);
    }

    /* =========================================================
       ADD PRODUCT
    ========================================================= */

    async function addProduct() {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        /* ---------------- VALIDATION ---------------- */

        if (!productID.trim()) {
            toast.error("Enter a product ID.");
            return;
        }

        if (!name.trim()) {
            toast.error("Enter a product name.");
            return;
        }

        if (!description.trim()) {
            toast.error("Enter a product description.");
            return;
        }

        if (images.length === 0) {
            toast.error("Please select at least one product image.");
            return;
        }

        if (Number(price) < 0) {
            toast.error("Enter a valid selling price.");
            return;
        }

        if (Number(labelledPrice) < 0) {
            toast.error("Enter a valid labelled price.");
            return;
        }

        if (Number(quantity) < 0) {
            toast.error("Enter a valid quantity.");
            return;
        }

        if (Number(carCount) < 1) {
            toast.error("Car count must be at least 1.");
            return;
        }

        if (!series.trim()) {
            toast.error("Enter the series.");
            return;
        }

        if (!casting.trim()) {
            toast.error("Enter the casting.");
            return;
        }

        try {
            setIsloading(true);

            /* =====================================================
               UPLOAD IMAGES
            ===================================================== */

            const uploadPromises = images.map((file) =>
                mediaUpload(file)
            );

            const imageUrls = await Promise.all(uploadPromises);

            if (
                !imageUrls.every(
                    (url) => typeof url === "string" && url.trim() !== ""
                )
            ) {
                throw new Error(
                    "Image upload returned an invalid URL."
                );
            }

            /* =====================================================
               ALTERNATIVE NAMES
            ===================================================== */

            const altNameList = altNames
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);

            /* =====================================================
               STOCK / STATUS
            ===================================================== */

            const finalQuantity = Number(quantity) || 0;

            let finalInStock = inStock;
            let finalStatus = status;

            if (finalQuantity <= 0) {
                finalInStock = false;
                finalStatus = "Out of Stock";
            } else {
                finalInStock = true;

                if (finalStatus === "Out of Stock") {
                    finalStatus = "Active";
                }
            }

            /* =====================================================
               PRODUCT DATA
            ===================================================== */

            const productData = {
                productID: productID.trim(),

                name: name.trim(),

                altNames: altNameList,

                description: description.trim(),

                images: imageUrls,

                category,

                productType,

                carCount: Number(carCount),

                price: Number(price),

                labelledPrice: Number(labelledPrice),

                quantity: finalQuantity,

                year: Number(year),

                series: series.trim(),

                casting: casting.trim(),

                manufacturer: manufacturer.trim(),

                model: model.trim(),

                vehicleType,

                color: color.trim(),

                scale,

                seriesNumber: seriesNumber.trim(),

                condition,

                packaging,

                inStock: finalInStock,

                featured,

                status: finalStatus,
            };

            console.log(
                "Sending product data:",
                productData
            );

            /* =====================================================
               API URL
            ===================================================== */

            const apiUrl = import.meta.env.VITE_API_URL;

            if (!apiUrl) {
                throw new Error(
                    "VITE_API_URL is not configured."
                );
            }

            /* =====================================================
               CREATE PRODUCT
            ===================================================== */

            await axios.post(
                `${apiUrl}/api/products`,
                productData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success(
                "Product added successfully!"
            );

            navigate("/admin/products");

        } catch (error) {
            console.error(
                "Error adding product:",
                error
            );

            console.error(
                "Server response:",
                error?.response?.data
            );

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Error adding product.";

            toast.error(message);

        } finally {
            setIsloading(false);
        }
    }

    /* =========================================================
       SUMMARY VALUES
    ========================================================= */

    const discount =
        Number(labelledPrice) > Number(price)
            ? Math.round(
                ((Number(labelledPrice) - Number(price)) /
                    Number(labelledPrice)) *
                100
            )
            : 0;

    return (
        <div className="min-h-full w-full bg-primary px-4 py-6 text-accent sm:px-6 lg:px-8">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-7 max-w-7xl"
            >
                <div className="mb-3 flex items-center gap-3">
                    <span className="h-px w-10 bg-accent/40" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-accent/60">
                        DIECAST / ADMIN
                    </span>
                </div>

                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    Add New Product
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-accent/65">
                    Add a die-cast car product with images,
                    pricing, vehicle details, packaging and
                    inventory information.
                </p>
            </motion.div>

            {/* =================================================
                MAIN CARD
            ================================================= */}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.6,
                    delay: 0.1,
                }}
                className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-accent/15 bg-white/40 shadow-[0_25px_80px_-35px_rgba(8,6,22,0.35)]"
            >

                <div className="p-5 sm:p-7 lg:p-9">

                    <div className="grid grid-cols-1 gap-10 xl:grid-cols-12">

                        {/* =================================================
                            LEFT SIDE
                        ================================================= */}

                        <div className="space-y-9 xl:col-span-8">

                            {/* =================================================
                                BASIC INFORMATION
                            ================================================= */}

                            <motion.section
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <SectionTitle
                                    number="01"
                                    title="Basic Information"
                                    description="Core product details"
                                />

                                <div className="grid gap-5 md:grid-cols-2">

                                    <InputField
                                        label="Product ID"
                                        placeholder="DC-001"
                                        value={productID}
                                        onChange={(e) =>
                                            setProductID(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <InputField
                                        label="Product Name"
                                        placeholder="1969 Dodge Charger"
                                        value={name}
                                        onChange={(e) =>
                                            setName(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="mt-5">

                                    <InputField
                                        label="Alternative Names"
                                        placeholder="Dodge Charger, Muscle Car"
                                        value={altNames}
                                        onChange={(e) =>
                                            setAltNames(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <p className="mt-1 text-[10px] text-accent/40">
                                        Separate multiple names with commas.
                                    </p>

                                </div>

                                <div className="mt-5">

                                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-accent/65">
                                        Description
                                    </label>

                                    <textarea
                                        rows="6"
                                        placeholder="Describe the car, casting, design, edition and important product details..."
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(
                                                e.target.value
                                            )
                                        }
                                        className="w-full resize-none rounded-2xl border border-accent/15 bg-primary px-4 py-3.5 text-sm leading-6 text-accent outline-none placeholder:text-accent/35 focus:border-accent/35 focus:ring-4 focus:ring-accent/10"
                                    />

                                </div>

                            </motion.section>

                            {/* =================================================
                                PRICING
                            ================================================= */}

                            <motion.section
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: 0.05,
                                }}
                            >
                                <SectionTitle
                                    number="02"
                                    title="Pricing & Inventory"
                                    description="Set pricing and stock quantity"
                                />

                                <div className="grid gap-5 sm:grid-cols-2">

                                    <PriceInput
                                        label="Selling Price"
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <PriceInput
                                        label="Labelled Price"
                                        value={labelledPrice}
                                        onChange={(e) =>
                                            setLabelledPrice(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="mt-5 grid gap-5 sm:grid-cols-2">

                                    <NumberInput
                                        label="Quantity"
                                        value={quantity}
                                        min="0"
                                        onChange={(e) =>
                                            setQuantity(
                                                Math.max(
                                                    0,
                                                    Number(
                                                        e.target.value
                                                    )
                                                )
                                            )
                                        }
                                    />

                                    <NumberInput
                                        label="Manufacturing Year"
                                        value={year}
                                        min="1900"
                                        onChange={(e) =>
                                            setYear(
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        }
                                    />

                                </div>

                            </motion.section>

                            {/* =================================================
                                IMAGES
                            ================================================= */}

                            <motion.section
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: 0.1,
                                }}
                            >
                                <SectionTitle
                                    number="03"
                                    title="Product Images"
                                    description="Upload clear product photographs"
                                />

                                <label
                                    htmlFor="product-images"
                                    className="group flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-accent/20 bg-primary/60 p-8 text-center transition hover:border-accent/40 hover:bg-white/50"
                                >

                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary shadow-lg transition group-hover:-translate-y-1">

                                        <svg
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                d="M3 16.5l4.5-4.5a2.25 2.25 0 013.182 0L15 16.5m-3-3l1.318-1.318a2.25 2.25 0 013.182 0L21 16.5M4.5 19.5h15A1.5 1.5 0 0021 18V6a1.5 1.5 0 00-1.5-1.5h-15A1.5 1.5 0 003 6v12a1.5 1.5 0 001.5 1.5z"
                                            />
                                        </svg>

                                    </div>

                                    <p className="text-sm font-bold">

                                        {images.length > 0
                                            ? `${images.length} image${images.length > 1 ? "s" : ""} selected`
                                            : "Upload product images"
                                        }

                                    </p>

                                    <p className="mt-1 text-xs text-accent/50">
                                        JPG, PNG or WEBP
                                    </p>

                                    <input
                                        id="product-images"
                                        type="file"
                                        multiple
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={
                                            handleImageChange
                                        }
                                        className="hidden"
                                    />

                                </label>

                                {images.length > 0 && (

                                    <div className="mt-3 space-y-1">

                                        {images.map(
                                            (image, index) => (

                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        x: -10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    key={`${image.name}-${index}`}
                                                    className="flex items-center justify-between rounded-lg bg-primary px-3 py-2 text-xs"
                                                >

                                                    <span className="max-w-[80%] truncate">
                                                        {image.name}
                                                    </span>

                                                    <span className="text-accent/40">
                                                        {(
                                                            image.size /
                                                            1024 /
                                                            1024
                                                        ).toFixed(2)}{" "}
                                                        MB
                                                    </span>

                                                </motion.div>

                                            )
                                        )}

                                    </div>

                                )}

                            </motion.section>

                            {/* =================================================
                                CAR DETAILS
                            ================================================= */}

                            <motion.section
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: 0.15,
                                }}
                            >

                                <SectionTitle
                                    number="04"
                                    title="Vehicle Details"
                                    description="Technical and identification details"
                                />

                                <div className="grid gap-5 md:grid-cols-2">

                                    <InputField
                                        label="Series"
                                        placeholder="Hot Wheels Mainline"
                                        value={series}
                                        onChange={(e) =>
                                            setSeries(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <InputField
                                        label="Casting"
                                        placeholder="Dodge Charger R/T"
                                        value={casting}
                                        onChange={(e) =>
                                            setCasting(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <InputField
                                        label="Manufacturer"
                                        placeholder="Mattel"
                                        value={manufacturer}
                                        onChange={(e) =>
                                            setManufacturer(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <InputField
                                        label="Model"
                                        placeholder="Dodge Charger"
                                        value={model}
                                        onChange={(e) =>
                                            setModel(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <SelectField
                                        label="Vehicle Type"
                                        value={vehicleType}
                                        onChange={(e) =>
                                            setVehicleType(
                                                e.target.value
                                            )
                                        }
                                    >

                                        {vehicleTypes.map(
                                            (item) => (
                                                <option
                                                    key={item}
                                                    value={item}
                                                >
                                                    {item}
                                                </option>
                                            )
                                        )}

                                    </SelectField>

                                    <InputField
                                        label="Color"
                                        placeholder="Red"
                                        value={color}
                                        onChange={(e) =>
                                            setColor(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <SelectField
                                        label="Scale"
                                        value={scale}
                                        onChange={(e) =>
                                            setScale(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="1:18">
                                            1:18
                                        </option>

                                        <option value="1:24">
                                            1:24
                                        </option>

                                        <option value="1:32">
                                            1:32
                                        </option>

                                        <option value="1:43">
                                            1:43
                                        </option>

                                        <option value="1:64">
                                            1:64
                                        </option>

                                        <option value="1:87">
                                            1:87
                                        </option>

                                    </SelectField>

                                    <InputField
                                        label="Series Number"
                                        placeholder="HW-2026-045"
                                        value={seriesNumber}
                                        onChange={(e) =>
                                            setSeriesNumber(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </motion.section>

                            {/* =================================================
                                PACKAGING
                            ================================================= */}

                            <motion.section
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: 0.2,
                                }}
                            >

                                <SectionTitle
                                    number="05"
                                    title="Product & Packaging"
                                    description="Set collection and packaging information"
                                />

                                <div className="grid gap-5 md:grid-cols-2">

                                    <SelectField
                                        label="Category"
                                        value={category}
                                        onChange={(e) =>
                                            setCategory(
                                                e.target.value
                                            )
                                        }
                                    >

                                        {categories.map(
                                            (item) => (
                                                <option
                                                    key={item}
                                                    value={item}
                                                >
                                                    {item}
                                                </option>
                                            )
                                        )}

                                    </SelectField>

                                    <SelectField
                                        label="Product Type"
                                        value={productType}
                                        onChange={(e) =>
                                            setProductType(
                                                e.target.value
                                            )
                                        }
                                    >

                                        {productTypes.map(
                                            (item) => (
                                                <option
                                                    key={item}
                                                    value={item}
                                                >
                                                    {item}
                                                </option>
                                            )
                                        )}

                                    </SelectField>

                                    <NumberInput
                                        label="Car Count"
                                        value={carCount}
                                        min="1"
                                        onChange={(e) =>
                                            setCarCount(
                                                Math.max(
                                                    1,
                                                    Number(
                                                        e.target.value
                                                    )
                                                )
                                            )
                                        }
                                    />

                                    <SelectField
                                        label="Condition"
                                        value={condition}
                                        onChange={(e) =>
                                            setCondition(
                                                e.target.value
                                            )
                                        }
                                    >

                                        {conditions.map(
                                            (item) => (
                                                <option
                                                    key={item}
                                                    value={item}
                                                >
                                                    {item}
                                                </option>
                                            )
                                        )}

                                    </SelectField>

                                    <SelectField
                                        label="Packaging"
                                        value={packaging}
                                        onChange={(e) =>
                                            setPackaging(
                                                e.target.value
                                            )
                                        }
                                    >

                                        {packagingTypes.map(
                                            (item) => (
                                                <option
                                                    key={item}
                                                    value={item}
                                                >
                                                    {item}
                                                </option>
                                            )
                                        )}

                                    </SelectField>

                                    <SelectField
                                        label="Status"
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(
                                                e.target.value
                                            )
                                        }
                                    >

                                        {statuses.map(
                                            (item) => (
                                                <option
                                                    key={item}
                                                    value={item}
                                                >
                                                    {item}
                                                </option>
                                            )
                                        )}

                                    </SelectField>

                                </div>

                            </motion.section>

                        </div>

                        {/* =================================================
                            RIGHT SIDE
                        ================================================= */}

                        <div className="space-y-6 xl:col-span-4">

                            {/* =================================================
                                SUMMARY
                            ================================================= */}

                            <motion.section
                                initial={{
                                    opacity: 0,
                                    x: 20,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.2,
                                }}
                                className="sticky top-6 space-y-6"
                            >

                                <section className="rounded-2xl border border-accent/15 bg-primary/70 p-5 sm:p-6">

                                    <SectionTitle
                                        number="06"
                                        title="Product Summary"
                                        description="Review your product information"
                                    />

                                    <div className="space-y-5">

                                        <SummaryRow
                                            label="Product ID"
                                            value={
                                                productID ||
                                                "Not set"
                                            }
                                        />

                                        <SummaryRow
                                            label="Category"
                                            value={
                                                category
                                            }
                                        />

                                        <SummaryRow
                                            label="Product Type"
                                            value={
                                                productType
                                            }
                                        />

                                        <SummaryRow
                                            label="Car Count"
                                            value={
                                                carCount
                                            }
                                        />

                                        <SummaryRow
                                            label="Series"
                                            value={
                                                series ||
                                                "Not set"
                                            }
                                        />

                                        <SummaryRow
                                            label="Casting"
                                            value={
                                                casting ||
                                                "Not set"
                                            }
                                        />

                                        <SummaryRow
                                            label="Vehicle"
                                            value={
                                                vehicleType
                                            }
                                        />

                                        <SummaryRow
                                            label="Scale"
                                            value={
                                                scale
                                            }
                                        />

                                        <SummaryRow
                                            label="Condition"
                                            value={
                                                condition
                                            }
                                        />

                                        <SummaryRow
                                            label="Packaging"
                                            value={
                                                packaging
                                            }
                                        />

                                        <SummaryRow
                                            label="Quantity"
                                            value={
                                                quantity
                                            }
                                        />

                                        <SummaryRow
                                            label="Images"
                                            value={
                                                images.length
                                            }
                                        />

                                    </div>

                                </section>

                                {/* =================================================
                                    PRICE SUMMARY
                                ================================================= */}

                                <section className="rounded-2xl bg-accent p-6 text-primary shadow-xl">

                                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary/50">
                                        Pricing
                                    </p>

                                    <div className="mt-4">

                                        <p className="text-3xl font-light">
                                            Rs.{" "}
                                            {Number(
                                                price || 0
                                            ).toLocaleString()}
                                        </p>

                                        {Number(
                                            labelledPrice
                                        ) > Number(price) && (

                                                <div className="mt-2 flex items-center gap-2">

                                                    <span className="text-xs text-primary/40 line-through">
                                                        Rs.{" "}
                                                        {Number(
                                                            labelledPrice
                                                        ).toLocaleString()}
                                                    </span>

                                                    <span className="rounded-full bg-primary/15 px-2 py-1 text-[9px] font-bold">
                                                        {discount}% OFF
                                                    </span>

                                                </div>

                                            )}

                                    </div>

                                    <div className="mt-6 border-t border-primary/10 pt-5">

                                        <SummaryRow
                                            label="Stock"
                                            value={`${quantity} units`}
                                        />

                                        <div className="mt-3">
                                            <SummaryRow
                                                label="Status"
                                                value={
                                                    quantity <= 0
                                                        ? "Out of Stock"
                                                        : status
                                                }
                                            />
                                        </div>

                                    </div>

                                </section>

                                {/* =================================================
                                    OPTIONS
                                ================================================= */}

                                <section className="rounded-2xl border border-accent/15 bg-white/50 p-5">

                                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-accent/65">
                                        Product Options
                                    </p>

                                    <ToggleOption
                                        label="In Stock"
                                        description="Product is available for purchase"
                                        checked={inStock}
                                        onChange={(e) =>
                                            setInStock(
                                                e.target.checked
                                            )
                                        }
                                    />

                                    <div className="my-4 h-px bg-accent/10" />

                                    <ToggleOption
                                        label="Featured Product"
                                        description="Show product in featured sections"
                                        checked={featured}
                                        onChange={(e) =>
                                            setFeatured(
                                                e.target.checked
                                            )
                                        }
                                    />

                                </section>

                            </motion.section>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    FOOTER BUTTONS
                ================================================= */}

                <div className="border-t border-accent/15 bg-white/20 px-5 py-5 sm:px-7 lg:px-9">

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

                        <button
                            type="button"
                            disabled={setloading}
                            onClick={() =>
                                navigate(
                                    "/admin/products"
                                )
                            }
                            className="rounded-xl border border-accent/20 bg-primary px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-accent transition hover:border-accent/40 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <motion.button
                            type="button"
                            disabled={setloading}
                            onClick={addProduct}
                            whileHover={{
                                y: -2,
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                            className="rounded-xl bg-accent px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {setloading
                                ? "Saving Product..."
                                : "Add Product →"
                            }

                        </motion.button>

                    </div>

                </div>

            </motion.div>

        </div>
    );
}


/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
    number,
    title,
    description,
}) {
    return (
        <div className="mb-5 flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-[9px] font-bold text-primary">
                {number}
            </div>

            <div>

                <h2 className="text-sm font-bold tracking-tight text-accent">
                    {title}
                </h2>

                <p className="mt-1 text-[10px] text-accent/55">
                    {description}
                </p>

            </div>

        </div>
    );
}


/* =========================================================
   TEXT INPUT
========================================================= */

function InputField({
    label,
    placeholder,
    value,
    onChange,
}) {
    return (
        <div>

            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-accent/70">
                {label}
            </label>

            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="h-12 w-full rounded-xl border border-accent/15 bg-primary px-4 text-sm font-medium text-accent outline-none placeholder:text-accent/35 focus:border-accent/40 focus:ring-4 focus:ring-accent/10"
            />

        </div>
    );
}


/* =========================================================
   NUMBER INPUT
========================================================= */

function NumberInput({
    label,
    value,
    min = 0,
    onChange,
}) {
    return (
        <div>

            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-accent/70">
                {label}
            </label>

            <input
                type="number"
                min={min}
                value={value}
                onChange={onChange}
                className="h-12 w-full rounded-xl border border-accent/15 bg-primary px-4 text-sm font-medium text-accent outline-none placeholder:text-accent/35 focus:border-accent/40 focus:ring-4 focus:ring-accent/10"
            />

        </div>
    );
}


/* =========================================================
   PRICE INPUT
========================================================= */

function PriceInput({
    label,
    value,
    onChange,
}) {
    return (
        <div>

            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-accent/70">
                {label}
            </label>

            <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-accent/50">
                    Rs.
                </span>

                <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={value}
                    onChange={onChange}
                    className="h-12 w-full rounded-xl border border-accent/15 bg-primary pl-11 pr-4 text-sm font-medium text-accent outline-none placeholder:text-accent/35 focus:border-accent/40 focus:ring-4 focus:ring-accent/10"
                />

            </div>

        </div>
    );
}


/* =========================================================
   SELECT
========================================================= */

function SelectField({
    label,
    value,
    onChange,
    children,
}) {
    return (
        <div>

            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-accent/70">
                {label}
            </label>

            <select
                value={value}
                onChange={onChange}
                className="h-12 w-full rounded-xl border border-accent/15 bg-primary px-4 text-sm font-medium text-accent outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/10"
            >
                {children}
            </select>

        </div>
    );
}


/* =========================================================
   SUMMARY ROW
========================================================= */

function SummaryRow({
    label,
    value,
}) {
    return (
        <div className="flex items-center justify-between gap-4">

            <span className="shrink-0 text-[10px] uppercase tracking-wider text-primary/45">
                {label}
            </span>

            <span className="max-w-[60%] truncate text-right text-xs font-medium text-primary/85">
                {value}
            </span>

        </div>
    );
}


/* =========================================================
   TOGGLE
========================================================= */

function ToggleOption({
    label,
    description,
    checked,
    onChange,
}) {
    return (
        <label className="flex cursor-pointer items-center justify-between gap-4">

            <div>

                <p className="text-xs font-bold text-accent">
                    {label}
                </p>

                <p className="mt-1 text-[10px] text-accent/45">
                    {description}
                </p>

            </div>

            <div className="relative shrink-0">

                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="peer sr-only"
                />

                <div className="h-6 w-11 rounded-full bg-accent/15 transition peer-checked:bg-accent" />

                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />

            </div>

        </label>
    );
}

