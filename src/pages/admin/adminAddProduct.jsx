
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
                    (url) =>
                        typeof url === "string" &&
                        url.trim() !== ""
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
        <div className="min-h-full w-full bg-[#ECE8D6] text-[#0A0A0A]">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="border-b border-black/10 bg-[#F5F5DC]"
            >
                <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-7 lg:px-9">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                        <div>
                            <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-black/45">
                                ADMIN / PRODUCTS / CREATE
                            </p>

                            <h1 className="font-sans text-3xl font-bold uppercase tracking-tight leading-none sm:text-4xl">
                                Add New Product
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-black/50">
                                Create a new die-cast vehicle listing with
                                pricing, specifications, images and inventory
                                information.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">

                            <div className="flex items-center gap-2 rounded-md border border-black/10 bg-[#ECE8D6] px-3 py-2">
                                <span className="h-2 w-2 rounded-full bg-[#FF8F00]" />

                                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-black/55">
                                    New Listing
                                </span>
                            </div>

                        </div>

                    </div>

                </div>
            </motion.div>

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-7 lg:px-9 lg:py-9">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: 0.05,
                    }}
                    className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_390px]"
                >

                    {/* =================================================
                        LEFT FORM
                    ================================================= */}

                    <div className="space-y-5">

                        {/* BASIC INFORMATION */}

                        <FormPanel
                            number="01"
                            title="Basic Information"
                            description="Core product identification"
                        >

                            <div className="grid gap-5 md:grid-cols-2">

                                <InputField
                                    label="Product ID"
                                    placeholder="DC-001"
                                    value={productID}
                                    onChange={(e) =>
                                        setProductID(e.target.value)
                                    }
                                />

                                <InputField
                                    label="Product Name"
                                    placeholder="1969 Dodge Charger"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                />

                            </div>

                            <div className="mt-5">

                                <InputField
                                    label="Alternative Names"
                                    placeholder="Dodge Charger, Muscle Car"
                                    value={altNames}
                                    onChange={(e) =>
                                        setAltNames(e.target.value)
                                    }
                                />

                                <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-black/35">
                                    Separate multiple names with commas
                                </p>

                            </div>

                            <div className="mt-5">

                                <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-black/50">
                                    Description
                                </label>

                                <textarea
                                    rows="6"
                                    placeholder="Describe the car, casting, design, edition and important product details..."
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    className="w-full resize-none rounded-md border border-black/10 bg-[#ECE8D6] px-4 py-3.5 text-sm leading-6 text-[#0A0A0A] outline-none placeholder:text-black/30 transition focus:border-[#FF8F00] focus:ring-2 focus:ring-[#FF8F00]/10"
                                />

                            </div>

                        </FormPanel>


                        {/* PRICING */}

                        <FormPanel
                            number="02"
                            title="Pricing & Inventory"
                            description="Set product price and stock quantity"
                        >

                            <div className="grid gap-5 sm:grid-cols-2">

                                <PriceInput
                                    label="Selling Price"
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(e.target.value)
                                    }
                                />

                                <PriceInput
                                    label="Labelled Price"
                                    value={labelledPrice}
                                    onChange={(e) =>
                                        setLabelledPrice(e.target.value)
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
                                                Number(e.target.value)
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
                                            Number(e.target.value)
                                        )
                                    }
                                />

                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">

                                <InfoBadge
                                    label="Selling"
                                    value={`Rs. ${Number(price || 0).toLocaleString()}`}
                                />

                                <InfoBadge
                                    label="Stock"
                                    value={`${quantity} units`}
                                />

                                {discount > 0 && (
                                    <InfoBadge
                                        label="Discount"
                                        value={`${discount}% OFF`}
                                        orange
                                    />
                                )}

                            </div>

                        </FormPanel>


                        {/* IMAGES */}

                        <FormPanel
                            number="03"
                            title="Product Images"
                            description="Upload clear product photographs"
                        >

                            <label
                                htmlFor="product-images"
                                className="group flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-black/20 bg-[#ECE8D6] p-8 text-center transition hover:border-[#FF8F00] hover:bg-[#DFDABF]/50"
                            >

                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-[#0A0A0A] text-[#FF8F00] transition group-hover:bg-[#FF8F00] group-hover:text-[#0A0A0A]">

                                    <svg
                                        className="h-5 w-5"
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

                                <p className="text-sm font-semibold">
                                    {images.length > 0
                                        ? `${images.length} image${images.length > 1 ? "s" : ""} selected`
                                        : "Upload product images"
                                    }
                                </p>

                                <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-black/35">
                                    JPG / PNG / WEBP
                                </p>

                                <input
                                    id="product-images"
                                    type="file"
                                    multiple
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />

                            </label>

                            {images.length > 0 && (

                                <div className="mt-4 space-y-2">

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
                                                className="flex items-center justify-between gap-3 rounded-md border border-black/10 bg-[#ECE8D6] px-3 py-2.5"
                                            >

                                                <div className="flex min-w-0 items-center gap-3">

                                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#0A0A0A] text-[#FF8F00]">
                                                        <svg
                                                            className="h-3.5 w-3.5"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="1.5"
                                                                d="M4 16l4-4 4 4 3-3 5 5M5 19h14a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v12a1 1 0 001 1z"
                                                            />
                                                        </svg>
                                                    </div>

                                                    <span className="truncate text-xs font-medium">
                                                        {image.name}
                                                    </span>

                                                </div>

                                                <span className="shrink-0 font-mono text-[9px] text-black/35">
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

                        </FormPanel>


                        {/* VEHICLE DETAILS */}

                        <FormPanel
                            number="04"
                            title="Vehicle Details"
                            description="Technical and identification details"
                        >

                            <div className="grid gap-5 md:grid-cols-2">

                                <InputField
                                    label="Series"
                                    placeholder="Hot Wheels Mainline"
                                    value={series}
                                    onChange={(e) =>
                                        setSeries(e.target.value)
                                    }
                                />

                                <InputField
                                    label="Casting"
                                    placeholder="Dodge Charger R/T"
                                    value={casting}
                                    onChange={(e) =>
                                        setCasting(e.target.value)
                                    }
                                />

                                <InputField
                                    label="Manufacturer"
                                    placeholder="Mattel"
                                    value={manufacturer}
                                    onChange={(e) =>
                                        setManufacturer(e.target.value)
                                    }
                                />

                                <InputField
                                    label="Model"
                                    placeholder="Dodge Charger"
                                    value={model}
                                    onChange={(e) =>
                                        setModel(e.target.value)
                                    }
                                />

                                <SelectField
                                    label="Vehicle Type"
                                    value={vehicleType}
                                    onChange={(e) =>
                                        setVehicleType(e.target.value)
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
                                        setColor(e.target.value)
                                    }
                                />

                                <SelectField
                                    label="Scale"
                                    value={scale}
                                    onChange={(e) =>
                                        setScale(e.target.value)
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
                                        setSeriesNumber(e.target.value)
                                    }
                                />

                            </div>

                        </FormPanel>


                        {/* PRODUCT & PACKAGING */}

                        <FormPanel
                            number="05"
                            title="Product & Packaging"
                            description="Collection and packaging information"
                        >

                            <div className="grid gap-5 md:grid-cols-2">

                                <SelectField
                                    label="Category"
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
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
                                        setProductType(e.target.value)
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
                                                Number(e.target.value)
                                            )
                                        )
                                    }
                                />

                                <SelectField
                                    label="Condition"
                                    value={condition}
                                    onChange={(e) =>
                                        setCondition(e.target.value)
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
                                        setPackaging(e.target.value)
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
                                        setStatus(e.target.value)
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

                        </FormPanel>

                    </div>


                    {/* =================================================
                        RIGHT SIDE
                    ================================================= */}

                    <div className="space-y-5 xl:sticky xl:top-5">

                        {/* SUMMARY */}

                        <motion.section
                            initial={{
                                opacity: 0,
                                x: 15,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            transition={{
                                duration: 0.45,
                                delay: 0.15,
                            }}
                            className="border border-black/10 bg-[#F5F5DC]"
                        >

                            <div className="border-b border-black/10 px-5 py-4">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-8 w-8 items-center justify-center rounded bg-[#0A0A0A] font-mono text-[9px] font-semibold text-[#FF8F00]">
                                        06
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-bold uppercase tracking-tight">
                                            Product Summary
                                        </h2>

                                        <p className="mt-1 text-[10px] text-black/40">
                                            Live product overview
                                        </p>
                                    </div>

                                </div>

                            </div>

                            <div className="p-5">

                                <div className="space-y-0">

                                    <SummaryRow
                                        label="Product ID"
                                        value={
                                            productID ||
                                            "Not set"
                                        }
                                    />

                                    <SummaryRow
                                        label="Name"
                                        value={
                                            name ||
                                            "Not set"
                                        }
                                    />

                                    <SummaryRow
                                        label="Category"
                                        value={category}
                                    />

                                    <SummaryRow
                                        label="Product Type"
                                        value={productType}
                                    />

                                    <SummaryRow
                                        label="Car Count"
                                        value={carCount}
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
                                        value={vehicleType}
                                    />

                                    <SummaryRow
                                        label="Scale"
                                        value={scale}
                                    />

                                    <SummaryRow
                                        label="Condition"
                                        value={condition}
                                    />

                                    <SummaryRow
                                        label="Packaging"
                                        value={packaging}
                                    />

                                    <SummaryRow
                                        label="Quantity"
                                        value={quantity}
                                    />

                                    <SummaryRow
                                        label="Images"
                                        value={images.length}
                                    />

                                </div>

                            </div>

                        </motion.section>


                        {/* PRICE CARD */}

                        <motion.section
                            initial={{
                                opacity: 0,
                                x: 15,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            transition={{
                                duration: 0.45,
                                delay: 0.2,
                            }}
                            className="overflow-hidden bg-[#0A0A0A] text-[#F5F5DC]"
                        >

                            <div className="p-6">

                                <div className="flex items-start justify-between gap-3">

                                    <div>

                                        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#F5F5DC]/40">
                                            Pricing
                                        </p>

                                        <p className="mt-3 font-mono text-3xl font-semibold tracking-tight">
                                            Rs.{" "}
                                            {Number(
                                                price || 0
                                            ).toLocaleString()}
                                        </p>

                                    </div>

                                    {discount > 0 && (

                                        <span className="rounded bg-[#FF8F00] px-2 py-1 font-mono text-[9px] font-bold text-[#0A0A0A]">
                                            {discount}% OFF
                                        </span>

                                    )}

                                </div>

                                {Number(labelledPrice) >
                                    Number(price) && (

                                    <div className="mt-2 font-mono text-[10px] text-[#F5F5DC]/35 line-through">
                                        Rs.{" "}
                                        {Number(
                                            labelledPrice
                                        ).toLocaleString()}
                                    </div>

                                )}

                                <div className="mt-6 grid grid-cols-2 border-t border-[#F5F5DC]/10 pt-5">

                                    <div>

                                        <p className="font-mono text-[9px] uppercase tracking-wider text-[#F5F5DC]/35">
                                            Stock
                                        </p>

                                        <p className="mt-2 font-mono text-sm font-semibold">
                                            {quantity} units
                                        </p>

                                    </div>

                                    <div>

                                        <p className="font-mono text-[9px] uppercase tracking-wider text-[#F5F5DC]/35">
                                            Status
                                        </p>

                                        <div className="mt-2 flex items-center gap-2">

                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${
                                                    quantity <= 0
                                                        ? "bg-[#FF3B00]"
                                                        : status === "Active"
                                                            ? "bg-[#2F7A45]"
                                                            : "bg-[#FF8F00]"
                                                }`}
                                            />

                                            <span className="font-mono text-[10px] font-semibold uppercase">
                                                {quantity <= 0
                                                    ? "Out of Stock"
                                                    : status}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </motion.section>


                        {/* OPTIONS */}

                        <motion.section
                            initial={{
                                opacity: 0,
                                x: 15,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            transition={{
                                duration: 0.45,
                                delay: 0.25,
                            }}
                            className="border border-black/10 bg-[#F5F5DC]"
                        >

                            <div className="border-b border-black/10 px-5 py-4">

                                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-black/45">
                                    Product Options
                                </p>

                            </div>

                            <div className="p-5">

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

                                <div className="my-5 h-px bg-black/10" />

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

                            </div>

                        </motion.section>


                        {/* QUICK PREVIEW */}

                        <section className="border border-black/10 bg-[#F5F5DC]">

                            <div className="border-b border-black/10 px-5 py-4">

                                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-black/45">
                                    Listing Preview
                                </p>

                            </div>

                            <div className="p-5">

                                <div className="flex gap-4">

                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#ECE8D6]">

                                        {images.length > 0 ? (

                                            <img
                                                src={URL.createObjectURL(
                                                    images[0]
                                                )}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />

                                        ) : (

                                            <svg
                                                className="h-8 w-8 text-black/15"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.2"
                                                    d="M4 16l4-4 4 4 3-3 5 5M5 19h14a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v12a1 1 0 001 1z"
                                                />
                                            </svg>

                                        )}

                                    </div>

                                    <div className="min-w-0">

                                        <p className="font-mono text-[9px] uppercase tracking-wider text-black/35">
                                            {category}
                                        </p>

                                        <h3 className="mt-1 truncate text-sm font-semibold">
                                            {name || "Product Name"}
                                        </h3>

                                        <p className="mt-2 font-mono text-sm font-semibold">
                                            Rs.{" "}
                                            {Number(
                                                price || 0
                                            ).toLocaleString()}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </section>

                    </div>

                </motion.div>

            </div>


            {/* =================================================
                FOOTER ACTION BAR
            ================================================= */}

            <div className="border-t border-black/10 bg-[#F5F5DC]">

                <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-9">

                    <div>

                        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/35">
                            PRODUCT CREATION
                        </p>

                        <p className="mt-1 text-xs text-black/50">
                            Review the information before saving.
                        </p>

                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">

                        <button
                            type="button"
                            disabled={setloading}
                            onClick={() =>
                                navigate(
                                    "/admin/products"
                                )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-md border border-black/15 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#0A0A0A] transition hover:border-black hover:bg-[#ECE8D6] disabled:cursor-not-allowed disabled:opacity-50"
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
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0A0A0A] px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#F5F5DC] shadow-sm transition hover:bg-[#FF8F00] hover:text-[#0A0A0A] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {setloading
                                ? "Saving Product..."
                                : "Add Product →"
                            }

                        </motion.button>

                    </div>

                </div>

            </div>

        </div>
    );
}


/* =========================================================
   FORM PANEL
========================================================= */

function FormPanel({
    number,
    title,
    description,
    children,
}) {
    return (
        <motion.section
            initial={{
                opacity: 0,
                y: 12,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.35,
            }}
            className="border border-black/10 bg-[#F5F5DC]"
        >

            <div className="border-b border-black/10 px-5 py-4 sm:px-6">

                <div className="flex items-center gap-3">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#0A0A0A] font-mono text-[9px] font-semibold text-[#FF8F00]">
                        {number}
                    </div>

                    <div>

                        <h2 className="text-sm font-bold uppercase tracking-tight">
                            {title}
                        </h2>

                        <p className="mt-1 text-[10px] text-black/40">
                            {description}
                        </p>

                    </div>

                </div>

            </div>

            <div className="p-5 sm:p-6">
                {children}
            </div>

        </motion.section>
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

            <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-black/50">
                {label}
            </label>

            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="h-11 w-full rounded-md border border-black/10 bg-[#ECE8D6] px-3.5 text-sm font-medium text-[#0A0A0A] outline-none placeholder:text-black/30 transition focus:border-[#FF8F00] focus:ring-2 focus:ring-[#FF8F00]/10"
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

            <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-black/50">
                {label}
            </label>

            <input
                type="number"
                min={min}
                value={value}
                onChange={onChange}
                className="h-11 w-full rounded-md border border-black/10 bg-[#ECE8D6] px-3.5 text-sm font-medium text-[#0A0A0A] outline-none transition focus:border-[#FF8F00] focus:ring-2 focus:ring-[#FF8F00]/10"
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

            <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-black/50">
                {label}
            </label>

            <div className="relative">

                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[10px] font-semibold text-black/40">
                    Rs.
                </span>

                <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={value}
                    onChange={onChange}
                    className="h-11 w-full rounded-md border border-black/10 bg-[#ECE8D6] pl-11 pr-3.5 text-sm font-medium text-[#0A0A0A] outline-none placeholder:text-black/30 transition focus:border-[#FF8F00] focus:ring-2 focus:ring-[#FF8F00]/10"
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

            <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-black/50">
                {label}
            </label>

            <select
                value={value}
                onChange={onChange}
                className="h-11 w-full rounded-md border border-black/10 bg-[#ECE8D6] px-3.5 text-sm font-medium text-[#0A0A0A] outline-none transition focus:border-[#FF8F00] focus:ring-2 focus:ring-[#FF8F00]/10"
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
        <div className="flex items-center justify-between gap-4 border-b border-black/[0.07] py-3 last:border-b-0">

            <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-black/40">
                {label}
            </span>

            <span className="max-w-[58%] truncate text-right text-xs font-semibold text-black/75">
                {value}
            </span>

        </div>
    );
}


/* =========================================================
   INFO BADGE
========================================================= */

function InfoBadge({
    label,
    value,
    orange = false,
}) {
    return (
        <div
            className={`rounded-md border px-3 py-2 ${
                orange
                    ? "border-[#FF8F00]/30 bg-[#FF8F00]/10"
                    : "border-black/10 bg-[#ECE8D6]"
            }`}
        >

            <p className="font-mono text-[8px] uppercase tracking-wider text-black/35">
                {label}
            </p>

            <p
                className={`mt-1 font-mono text-[10px] font-semibold ${
                    orange
                        ? "text-[#CC7000]"
                        : "text-black/70"
                }`}
            >
                {value}
            </p>

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

            <div className="min-w-0">

                <p className="text-xs font-semibold text-[#0A0A0A]">
                    {label}
                </p>

                <p className="mt-1 text-[10px] leading-4 text-black/40">
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

                <div className="h-5 w-9 rounded-full border border-black/15 bg-black/10 transition peer-checked:border-[#FF8F00] peer-checked:bg-[#FF8F00]" />

                <div className="absolute left-1 top-1 h-3 w-3 rounded-full bg-white shadow-sm transition peer-checked:translate-x-4" />

            </div>

        </label>
    );
}