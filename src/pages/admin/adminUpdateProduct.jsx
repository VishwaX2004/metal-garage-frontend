import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
    FaArrowLeft,
    FaBox,
    FaCalendarAlt,
    FaCar,
    FaCheck,
    FaCloudUploadAlt,
    FaCubes,
    FaEdit,
    FaImage,
    FaInfoCircle,
    FaLayerGroup,
    FaPalette,
    FaSave,
    FaTag,
    FaTimes,
    FaTrash,
    FaTruck,
} from "react-icons/fa";

import mediaUpload from "../../utils/mediaUpload";


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AdminUpdateProductPage() {

    const location = useLocation();
    const navigate = useNavigate();

    const fileInputRef = useRef(null);

    /*
     * Product received from product list
     */
    const product = location.state || null;


    /* =====================================================
       BASIC PRODUCT INFORMATION
    ===================================================== */

    const [productID, setProductID] = useState(
        product?.productID || ""
    );

    const [name, setName] = useState(
        product?.name || ""
    );

    const [altNames, setAltNames] = useState(
        Array.isArray(product?.altNames)
            ? product.altNames.join(", ")
            : product?.altNames || ""
    );

    const [description, setDescription] = useState(
        product?.description || ""
    );


    /* =====================================================
       PRICING
    ===================================================== */

    const [price, setPrice] = useState(
        product?.price ?? ""
    );

    const [labelledPrice, setLabelledPrice] = useState(
        product?.labelledPrice ?? ""
    );


    /* =====================================================
       PRODUCT CLASSIFICATION
    ===================================================== */

    const [category, setCategory] = useState(
        product?.category || ""
    );

    const [productType, setProductType] = useState(
        product?.productType || ""
    );

    const [carCount, setCarCount] = useState(
        product?.carCount ?? 1
    );


    /* =====================================================
       INVENTORY
    ===================================================== */

    const [quantity, setQuantity] = useState(
        product?.quantity ?? 0
    );


    /* =====================================================
       CAR INFORMATION
    ===================================================== */

    const [year, setYear] = useState(
        product?.year ?? ""
    );

    const [series, setSeries] = useState(
        product?.series || ""
    );

    const [casting, setCasting] = useState(
        product?.casting || ""
    );

    const [manufacturer, setManufacturer] = useState(
        product?.manufacturer || ""
    );

    const [model, setModel] = useState(
        product?.model || ""
    );

    const [vehicleType, setVehicleType] = useState(
        product?.vehicleType || "Other"
    );

    const [color, setColor] = useState(
        product?.color || ""
    );

    const [scale, setScale] = useState(
        product?.scale || "1:64"
    );

    const [seriesNumber, setSeriesNumber] = useState(
        product?.seriesNumber || ""
    );


    /* =====================================================
       CONDITION / PACKAGING
    ===================================================== */

    const [condition, setCondition] = useState(
        product?.condition || "New"
    );

    const [packaging, setPackaging] = useState(
        product?.packaging || "Carded"
    );


    /* =====================================================
       STATUS
    ===================================================== */

    const [featured, setFeatured] = useState(
        Boolean(product?.featured)
    );

    const [status, setStatus] = useState(
        product?.status || "Active"
    );


    /* =====================================================
       IMAGES
    ===================================================== */

    const [existingImages, setExistingImages] = useState(
        Array.isArray(product?.images)
            ? product.images.filter(
                  (image) =>
                      typeof image === "string" &&
                      image.trim()
              )
            : []
    );

    const [newImages, setNewImages] = useState([]);


    /* =====================================================
       LOADING
    ===================================================== */

    const [loading, setLoading] = useState(false);


    /* =====================================================
       CONSTANTS
    ===================================================== */

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

    const scales = [
        "1:18",
        "1:24",
        "1:32",
        "1:43",
        "1:64",
        "1:72",
        "1:87",
        "Other",
    ];

    const statuses = [
        "Active",
        "Inactive",
        "Out of Stock",
        "Coming Soon",
    ];


    /* =====================================================
       SAFETY CHECK
    ===================================================== */

    useEffect(() => {

        if (!product?.productID) {

            toast.error(
                "Product information is missing."
            );

            navigate("/admin/products");
        }

    }, [product, navigate]);


    /* =====================================================
       AUTOMATIC INVENTORY STATUS
    ===================================================== */

    useEffect(() => {

        const numericQuantity =
            Number(quantity) || 0;

        if (numericQuantity <= 0) {

            setStatus("Out of Stock");

        } else if (status === "Out of Stock") {

            setStatus("Active");

        }

    }, [quantity]);


    /* =====================================================
       IMAGE SELECTION
    ===================================================== */

    function handleImageSelect(event) {

        const files = Array.from(
            event.target.files || []
        );

        if (files.length === 0) {
            return;
        }


        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];


        const invalidFiles = files.filter(
            (file) =>
                !allowedTypes.includes(
                    file.type
                )
        );


        if (invalidFiles.length > 0) {

            toast.error(
                "Only JPG, PNG and WEBP images are allowed."
            );

            event.target.value = "";

            return;
        }


        /*
         * Maximum 5 MB per image
         */

        const oversizedFiles = files.filter(
            (file) =>
                file.size >
                5 * 1024 * 1024
        );


        if (oversizedFiles.length > 0) {

            toast.error(
                "Each image must be smaller than 5 MB."
            );

            event.target.value = "";

            return;
        }


        /*
         * Prevent duplicate file selection
         */

        setNewImages((current) => {

            const existingKeys = new Set(
                current.map(
                    (file) =>
                        `${file.name}-${file.size}-${file.lastModified}`
                )
            );

            const uniqueFiles = files.filter(
                (file) =>
                    !existingKeys.has(
                        `${file.name}-${file.size}-${file.lastModified}`
                    )
            );

            return [
                ...current,
                ...uniqueFiles,
            ];
        });


        event.target.value = "";
    }


    /* =====================================================
       REMOVE NEW IMAGE
    ===================================================== */

    function removeNewImage(index) {

        setNewImages((current) =>
            current.filter(
                (_, i) =>
                    i !== index
            )
        );
    }


    /* =====================================================
       REMOVE EXISTING IMAGE
    ===================================================== */

    function removeExistingImage(index) {

        setExistingImages((current) =>
            current.filter(
                (_, i) =>
                    i !== index
            )
        );
    }


    /* =====================================================
       VALIDATION
    ===================================================== */

    function validateProduct() {

        if (!productID.trim()) {

            toast.error(
                "Product ID is required."
            );

            return false;
        }


        if (!name.trim()) {

            toast.error(
                "Product name is required."
            );

            return false;
        }


        if (!description.trim()) {

            toast.error(
                "Product description is required."
            );

            return false;
        }


        if (
            price === "" ||
            Number.isNaN(Number(price)) ||
            Number(price) < 0
        ) {

            toast.error(
                "Enter a valid selling price."
            );

            return false;
        }


        if (
            labelledPrice === "" ||
            Number.isNaN(
                Number(labelledPrice)
            ) ||
            Number(labelledPrice) < 0
        ) {

            toast.error(
                "Enter a valid labelled price."
            );

            return false;
        }


        if (!category) {

            toast.error(
                "Select a product category."
            );

            return false;
        }


        if (!productType) {

            toast.error(
                "Select a product type."
            );

            return false;
        }


        if (
            carCount === "" ||
            Number(carCount) < 1
        ) {

            toast.error(
                "Car count must be at least 1."
            );

            return false;
        }


        if (
            quantity === "" ||
            Number(quantity) < 0
        ) {

            toast.error(
                "Quantity cannot be negative."
            );

            return false;
        }


        if (!year || Number(year) < 1900) {

            toast.error(
                "Enter a valid vehicle year."
            );

            return false;
        }


        if (!series.trim()) {

            toast.error(
                "Series is required."
            );

            return false;
        }


        if (!casting.trim()) {

            toast.error(
                "Casting is required."
            );

            return false;
        }


        if (
            existingImages.length === 0 &&
            newImages.length === 0
        ) {

            toast.error(
                "Product must have at least one image."
            );

            return false;
        }


        return true;
    }


    /* =====================================================
       UPDATE PRODUCT
    ===================================================== */

    async function updateProduct() {

        if (loading) {
            return;
        }


        const token =
            localStorage.getItem("token");


        if (!token) {

            toast.error(
                "Your session has expired. Please login again."
            );

            navigate("/login");

            return;
        }


        if (!validateProduct()) {
            return;
        }


        try {

            setLoading(true);


            /* =============================================
               IMAGE UPLOAD
            ============================================= */

            let uploadedImageUrls = [];


            if (newImages.length > 0) {

                toast.loading(
                    "Uploading new images...",
                    {
                        id: "image-upload",
                    }
                );


                const uploadResults =
                    await Promise.all(
                        newImages.map(
                            async (file) => {

                                try {

                                    const result =
                                        await mediaUpload(
                                            file
                                        );

                                    return result;

                                } catch (uploadError) {

                                    console.error(
                                        `Failed to upload ${file.name}:`,
                                        uploadError
                                    );

                                    throw new Error(
                                        `Failed to upload ${file.name}: ${
                                            uploadError?.message ||
                                            "Unknown upload error"
                                        }`
                                    );
                                }
                            }
                        )
                    );


                /*
                 * mediaUpload should normally return
                 * a string URL.
                 */

                uploadedImageUrls =
                    uploadResults.map(
                        (result) => {

                            if (
                                typeof result ===
                                "string"
                            ) {

                                return result;
                            }


                            if (
                                result?.publicUrl &&
                                typeof result.publicUrl ===
                                    "string"
                            ) {

                                return result.publicUrl;
                            }


                            if (
                                result?.url &&
                                typeof result.url ===
                                    "string"
                            ) {

                                return result.url;
                            }


                            return null;
                        }
                    );


                const invalidUpload =
                    uploadedImageUrls.some(
                        (url) =>
                            typeof url !==
                                "string" ||
                            !url.trim()
                    );


                if (invalidUpload) {

                    throw new Error(
                        "Image upload returned an invalid URL."
                    );
                }


                toast.success(
                    "Images uploaded successfully.",
                    {
                        id: "image-upload",
                    }
                );
            }


            /* =============================================
               FINAL IMAGE LIST
            ============================================= */

            const finalImages = [
                ...existingImages,
                ...uploadedImageUrls,
            ];


            if (finalImages.length === 0) {

                throw new Error(
                    "At least one product image is required."
                );
            }


            /* =============================================
               ALT NAMES
            ============================================= */

            const altNameList =
                altNames
                    .split(",")
                    .map(
                        (item) =>
                            item.trim()
                    )
                    .filter(Boolean);


            /* =============================================
               QUANTITY
            ============================================= */

            const finalQuantity =
                Math.max(
                    0,
                    Number(quantity) || 0
                );


            /* =============================================
               INVENTORY STATUS
            ============================================= */

            const finalInStock =
                finalQuantity > 0;


            let finalStatus = status;


            if (finalQuantity <= 0) {

                finalStatus =
                    "Out of Stock";

            } else if (
                finalStatus ===
                "Out of Stock"
            ) {

                finalStatus =
                    "Active";
            }


            /* =============================================
               PRODUCT DATA
            ============================================= */

            const productData = {

                productID:
                    productID.trim(),

                name:
                    name.trim(),

                altNames:
                    altNameList,

                description:
                    description.trim(),

                images:
                    finalImages,

                category,

                productType,

                carCount:
                    Math.max(
                        1,
                        Number(carCount) || 1
                    ),

                price:
                    Number(price),

                labelledPrice:
                    Number(labelledPrice),

                quantity:
                    finalQuantity,

                year:
                    Number(year),

                series:
                    series.trim(),

                casting:
                    casting.trim(),

                manufacturer:
                    manufacturer.trim(),

                model:
                    model.trim(),

                vehicleType,

                color:
                    color.trim(),

                scale,

                seriesNumber:
                    seriesNumber.trim(),

                condition,

                packaging,

                inStock:
                    finalInStock,

                featured:
                    Boolean(featured),

                status:
                    finalStatus,
            };


            console.log(
                "Updating Metal-Garage product:",
                productData
            );


            /* =============================================
               API URL
            ============================================= */

            const apiUrl =
                import.meta.env.VITE_API_URL;


            if (!apiUrl) {

                throw new Error(
                    "VITE_API_URL is not configured."
                );
            }


            /*
             * IMPORTANT:
             * Product ID in URL is the original ID.
             */

            const updateUrl =
                `${apiUrl.replace(/\/$/, "")}/api/products/${encodeURIComponent(
                    productID.trim()
                )}`;


            console.log(
                "PUT URL:",
                updateUrl
            );


            /* =============================================
               API REQUEST
            ============================================= */

            await axios.put(
                updateUrl,
                productData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json",
                    },
                }
            );


            toast.success(
                "Product updated successfully!"
            );


            navigate(
                "/admin/products"
            );

        } catch (error) {

            console.error(
                "Error updating product:",
                error
            );


            console.error(
                "Server response:",
                error?.response?.data
            );


            if (
                error?.response?.status ===
                    401 ||
                error?.response?.status ===
                    403
            ) {

                toast.error(
                    error?.response?.data
                        ?.message ||
                        "You are not authorized. Please login again."
                );

                return;
            }


            if (
                error?.response?.status ===
                404
            ) {

                toast.error(
                    error?.response?.data
                        ?.message ||
                        "Product not found."
                );

                return;
            }


            if (
                error?.response?.status ===
                409
            ) {

                toast.error(
                    error?.response?.data
                        ?.message ||
                        "Product ID already exists."
                );

                return;
            }


            const message =
                error?.response?.data
                    ?.message ||
                error?.response?.data
                    ?.error ||
                error?.message ||
                "Error updating product.";


            toast.error(message);

        } finally {

            setLoading(false);
        }
    }


    /* =====================================================
       CALCULATED DATA
    ===================================================== */

    const discountPercentage =
        useMemo(() => {

            const labelled =
                Number(labelledPrice);

            const selling =
                Number(price);

            if (
                labelled <= 0 ||
                selling < 0 ||
                selling >= labelled
            ) {

                return 0;
            }

            return Math.round(
                ((labelled - selling) /
                    labelled) *
                    100
            );

        }, [
            labelledPrice,
            price,
        ]);


    const finalImageCount =
        existingImages.length +
        newImages.length;


    const stockStatus =
        Number(quantity) > 0
            ? "In Stock"
            : "Out of Stock";


    /* =====================================================
       PRODUCT NOT FOUND
    ===================================================== */

    if (!product?.productID) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-primary px-5 text-accent">

                <div className="w-full max-w-md rounded-[28px] border border-accent/10 bg-white p-8 text-center shadow-[0_25px_80px_-35px_rgba(8,6,22,0.45)]">

                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-primary">

                        <FaTimes className="text-xl" />

                    </div>


                    <h1 className="text-2xl font-semibold">

                        Product Not Found

                    </h1>


                    <p className="mt-3 text-sm leading-6 text-accent/55">

                        Product information is missing.
                        Please return to the product
                        list and select a product again.

                    </p>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/products"
                            )
                        }
                        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary transition hover:-translate-y-0.5 hover:shadow-lg"
                    >

                        <FaArrowLeft />

                        Back to Products

                    </button>

                </div>

            </div>
        );
    }


    /* =====================================================
       UI
    ===================================================== */

    return (

        <div className="min-h-full w-full bg-primary px-4 py-6 text-accent sm:px-6 lg:px-8">

            <div className="mx-auto max-w-7xl">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-8">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/products"
                            )
                        }
                        disabled={loading}
                        className="mb-6 inline-flex items-center gap-2 rounded-xl border border-accent/15 bg-white/50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-accent transition hover:border-accent/30 hover:bg-white disabled:opacity-50"
                    >

                        <FaArrowLeft />

                        Back to Products

                    </button>


                    <div className="mb-3 flex items-center gap-3">

                        <span className="h-px w-10 bg-accent/40" />

                        <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-accent/60">

                            METAL-GARAGE / ADMIN

                        </span>

                    </div>


                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

                        <div>

                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">

                                Update Product

                            </h1>


                            <p className="mt-2 max-w-2xl text-sm leading-6 text-accent/60">

                                Update your die-cast product
                                information, pricing,
                                inventory, vehicle details,
                                images and collection status.

                            </p>

                        </div>


                        <div className="flex items-center gap-2 rounded-full border border-accent/10 bg-white/60 px-4 py-2">

                            <span
                                className={`h-2 w-2 rounded-full ${
                                    Number(quantity) > 0
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                }`}
                            />

                            <span className="text-[10px] font-bold uppercase tracking-wider">

                                {stockStatus}

                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    MAIN CARD
                ================================================= */}

                <div className="overflow-hidden rounded-[28px] border border-accent/15 bg-white/40 shadow-[0_25px_80px_-35px_rgba(8,6,22,0.35)]">


                    <div className="p-5 sm:p-7 lg:p-9">

                        <div className="grid grid-cols-1 gap-10 xl:grid-cols-12">


                            {/* =================================================
                                LEFT SIDE
                            ================================================= */}

                            <div className="space-y-9 xl:col-span-8">


                                {/* =================================================
                                    01 BASIC INFORMATION
                                ================================================= */}

                                <section>

                                    <SectionTitle
                                        number="01"
                                        title="Basic Information"
                                        description="Core product information"
                                        icon={<FaInfoCircle />}
                                    />


                                    <div className="grid gap-5 md:grid-cols-2">

                                        <InputField
                                            label="Product ID"
                                            placeholder="MG-001"
                                            value={productID}
                                            onChange={(e) =>
                                                setProductID(
                                                    e.target.value
                                                )
                                            }
                                            disabled
                                        />


                                        <InputField
                                            label="Product Name"
                                            placeholder="1969 Dodge Charger R/T"
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
                                            placeholder="Dodge Charger, Charger R/T"
                                            value={altNames}
                                            onChange={(e) =>
                                                setAltNames(
                                                    e.target.value
                                                )
                                            }
                                        />


                                        <p className="mt-1 text-[10px] text-accent/40">

                                            Separate multiple names
                                            with commas.

                                        </p>

                                    </div>


                                    <div className="mt-5">

                                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-accent/65">

                                            Description

                                        </label>


                                        <textarea
                                            rows="6"
                                            placeholder="Describe the die-cast car, casting details, special features and collection information..."
                                            value={description}
                                            onChange={(e) =>
                                                setDescription(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full resize-none rounded-2xl border border-accent/15 bg-primary px-4 py-3.5 text-sm leading-6 text-accent outline-none placeholder:text-accent/35 transition focus:border-accent/35 focus:ring-4 focus:ring-accent/10"
                                        />

                                    </div>

                                </section>


                                {/* =================================================
                                    02 PRICING
                                ================================================= */}

                                <section>

                                    <SectionTitle
                                        number="02"
                                        title="Pricing"
                                        description="Set product selling and labelled prices"
                                        icon={<FaTag />}
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


                                    {discountPercentage > 0 && (

                                        <div className="mt-4 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                                            <span className="text-xs font-semibold text-green-700">

                                                Current Discount

                                            </span>


                                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">

                                                {discountPercentage}%

                                            </span>

                                        </div>

                                    )}

                                </section>


                                {/* =================================================
                                    03 IMAGES
                                ================================================= */}

                                <section>

                                    <SectionTitle
                                        number="03"
                                        title="Product Images"
                                        description="Manage existing and new product photographs"
                                        icon={<FaImage />}
                                    />


                                    {/* EXISTING */}

                                    {existingImages.length > 0 && (

                                        <div className="mb-6">

                                            <div className="mb-3 flex items-center justify-between">

                                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent/65">

                                                    Existing Images

                                                </p>


                                                <span className="text-[10px] text-accent/40">

                                                    {existingImages.length}
                                                    {" "}
                                                    saved

                                                </span>

                                            </div>


                                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">

                                                {existingImages.map(
                                                    (
                                                        image,
                                                        index
                                                    ) => (

                                                        <div
                                                            key={`${image}-${index}`}
                                                            className="group relative aspect-square overflow-hidden rounded-2xl border border-accent/10 bg-white shadow-sm"
                                                        >

                                                            <img
                                                                src={image}
                                                                alt={`Product ${index + 1}`}
                                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display =
                                                                        "none";
                                                                }}
                                                            />


                                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-10">

                                                                <span className="text-[9px] font-bold uppercase tracking-wider text-white">

                                                                    Image{" "}
                                                                    {index + 1}

                                                                </span>

                                                            </div>


                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeExistingImage(
                                                                        index
                                                                    )
                                                                }
                                                                disabled={loading}
                                                                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-xs text-red-600 shadow-lg transition hover:scale-105 hover:bg-red-50 disabled:opacity-50"
                                                                title="Remove image"
                                                            >

                                                                <FaTrash />

                                                            </button>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                    )}


                                    {/* UPLOAD AREA */}

                                    <label
                                        htmlFor="product-images"
                                        className="group flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-accent/20 bg-primary/60 p-8 text-center transition duration-300 hover:border-accent/40 hover:bg-white/60"
                                    >

                                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary shadow-lg transition duration-300 group-hover:-translate-y-1 group-hover:scale-105">

                                            <FaCloudUploadAlt className="text-xl" />

                                        </div>


                                        <p className="text-sm font-bold">

                                            Add New Images

                                        </p>


                                        <p className="mt-1 text-xs text-accent/50">

                                            Existing images will remain
                                            unless you remove them.

                                        </p>


                                        <p className="mt-2 text-[10px] text-accent/40">

                                            JPG, PNG or WEBP •
                                            Maximum 5 MB each

                                        </p>


                                        <input
                                            ref={fileInputRef}
                                            id="product-images"
                                            type="file"
                                            multiple
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={
                                                handleImageSelect
                                            }
                                            className="hidden"
                                        />

                                    </label>


                                    {/* NEW IMAGES */}

                                    {newImages.length > 0 && (

                                        <div className="mt-5">

                                            <div className="mb-3 flex items-center justify-between">

                                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent/65">

                                                    New Images

                                                </p>


                                                <span className="text-[10px] text-accent/40">

                                                    {newImages.length}
                                                    {" "}
                                                    selected

                                                </span>

                                            </div>


                                            <div className="space-y-2">

                                                {newImages.map(
                                                    (
                                                        image,
                                                        index
                                                    ) => (

                                                        <div
                                                            key={`${image.name}-${image.lastModified}-${index}`}
                                                            className="flex items-center gap-3 rounded-xl border border-accent/10 bg-primary px-3 py-2 transition hover:border-accent/20"
                                                        >

                                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">

                                                                <img
                                                                    src={URL.createObjectURL(
                                                                        image
                                                                    )}
                                                                    alt={image.name}
                                                                    className="h-full w-full object-cover"
                                                                />

                                                            </div>


                                                            <div className="min-w-0 flex-1">

                                                                <p className="truncate text-xs font-semibold">

                                                                    {image.name}

                                                                </p>


                                                                <p className="mt-0.5 text-[10px] text-accent/40">

                                                                    {(
                                                                        image.size /
                                                                        1024 /
                                                                        1024
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                    {" "}
                                                                    MB

                                                                </p>

                                                            </div>


                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeNewImage(
                                                                        index
                                                                    )
                                                                }
                                                                disabled={loading}
                                                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                                            >

                                                                <FaTimes />

                                                            </button>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                    )}

                                </section>


                                {/* =================================================
                                    04 VEHICLE INFORMATION
                                ================================================= */}

                                <section>

                                    <SectionTitle
                                        number="04"
                                        title="Vehicle Information"
                                        description="Detailed die-cast vehicle information"
                                        icon={<FaCar />}
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
                                            placeholder="Charger R/T"
                                            value={model}
                                            onChange={(e) =>
                                                setModel(
                                                    e.target.value
                                                )
                                            }
                                        />


                                        <InputField
                                            label="Vehicle Color"
                                            placeholder="Black"
                                            value={color}
                                            onChange={(e) =>
                                                setColor(
                                                    e.target.value
                                                )
                                            }
                                        />


                                        <InputField
                                            label="Series Number"
                                            placeholder="123/250"
                                            value={seriesNumber}
                                            onChange={(e) =>
                                                setSeriesNumber(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </section>


                                {/* =================================================
                                    05 COLLECTION DETAILS
                                ================================================= */}

                                <section>

                                    <SectionTitle
                                        number="05"
                                        title="Collection Details"
                                        description="Configure scale, condition and packaging"
                                        icon={<FaLayerGroup />}
                                    />


                                    <div className="grid gap-5 md:grid-cols-2">


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


                                        <SelectField
                                            label="Scale"
                                            value={scale}
                                            onChange={(e) =>
                                                setScale(
                                                    e.target.value
                                                )
                                            }
                                        >

                                            {scales.map(
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

                                    </div>

                                </section>

                            </div>


                            {/* =================================================
                                RIGHT SIDE
                            ================================================= */}

                            <div className="space-y-6 xl:col-span-4">


                                {/* =================================================
                                    CLASSIFICATION
                                ================================================= */}

                                <section className="rounded-2xl border border-accent/15 bg-primary/70 p-5 sm:p-6">

                                    <SectionTitle
                                        number="06"
                                        title="Classification"
                                        description="Organize this product"
                                        icon={<FaCubes />}
                                    />


                                    <div className="space-y-5">


                                        <SelectField
                                            label="Category"
                                            value={category}
                                            onChange={(e) =>
                                                setCategory(
                                                    e.target.value
                                                )
                                            }
                                        >

                                            <option value="">
                                                Select category
                                            </option>


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

                                            <option value="">
                                                Select product type
                                            </option>


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


                                        <NumberField
                                            label="Car Count"
                                            min="1"
                                            value={carCount}
                                            onChange={(e) =>
                                                setCarCount(
                                                    e.target.value
                                                )
                                            }
                                        />


                                        <NumberField
                                            label="Release Year"
                                            min="1900"
                                            max="2100"
                                            value={year}
                                            onChange={(e) =>
                                                setYear(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </section>


                                {/* =================================================
                                    INVENTORY
                                ================================================= */}

                                <section className="rounded-2xl border border-accent/15 bg-white/60 p-5 sm:p-6">

                                    <SectionTitle
                                        number="07"
                                        title="Inventory"
                                        description="Manage available stock"
                                        icon={<FaBox />}
                                    />


                                    <NumberField
                                        label="Available Quantity"
                                        min="0"
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(
                                                e.target.value
                                            )
                                        }
                                    />


                                    <div className="mt-4 rounded-xl border border-accent/10 bg-primary p-4">

                                        <div className="flex items-center justify-between">

                                            <span className="text-[10px] font-bold uppercase tracking-wider text-accent/50">

                                                Stock Status

                                            </span>


                                            <span
                                                className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                                                    Number(quantity) >
                                                    0
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >

                                                {Number(quantity) >
                                                0
                                                    ? "IN STOCK"
                                                    : "OUT OF STOCK"}

                                            </span>

                                        </div>


                                        <p className="mt-3 text-xs leading-5 text-accent/50">

                                            Stock status is automatically
                                            calculated from the available
                                            quantity.

                                        </p>

                                    </div>

                                </section>


                                {/* =================================================
                                    STATUS
                                ================================================= */}

                                <section className="rounded-2xl border border-accent/15 bg-accent p-6 text-primary shadow-xl">

                                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary/50">

                                        Product Status

                                    </p>


                                    <div className="mt-5">

                                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-primary/60">

                                            Status

                                        </label>


                                        <select
                                            value={status}
                                            onChange={(e) =>
                                                setStatus(
                                                    e.target.value
                                                )
                                            }
                                            disabled={
                                                Number(quantity) <= 0
                                            }
                                            className="h-12 w-full rounded-xl border border-primary/20 bg-primary/10 px-4 text-sm font-semibold text-primary outline-none transition focus:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                                        >

                                            {statuses.map(
                                                (item) => (

                                                    <option
                                                        key={item}
                                                        value={item}
                                                        className="text-accent"
                                                    >
                                                        {item}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    {/* FEATURED */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFeatured(
                                                (current) =>
                                                    !current
                                            )
                                        }
                                        disabled={loading}
                                        className={`mt-5 flex w-full items-center justify-between rounded-xl border px-4 py-3 transition ${
                                            featured
                                                ? "border-primary/30 bg-primary/15"
                                                : "border-primary/10 bg-primary/5"
                                        }`}
                                    >

                                        <div className="text-left">

                                            <p className="text-xs font-bold">

                                                Featured Product

                                            </p>


                                            <p className="mt-1 text-[9px] text-primary/50">

                                                Show this product in
                                                featured collections.

                                            </p>

                                        </div>


                                        <div
                                            className={`flex h-6 w-11 items-center rounded-full p-1 transition ${
                                                featured
                                                    ? "bg-primary"
                                                    : "bg-primary/20"
                                            }`}
                                        >

                                            <div
                                                className={`h-4 w-4 rounded-full transition ${
                                                    featured
                                                        ? "translate-x-5 bg-accent"
                                                        : "translate-x-0 bg-primary/70"
                                                }`}
                                            />

                                        </div>

                                    </button>

                                </section>


                                {/* =================================================
                                    SUMMARY
                                ================================================= */}

                                <section className="rounded-2xl bg-accent p-6 text-primary shadow-xl">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">

                                            <FaCar />

                                        </div>


                                        <div>

                                            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary/50">

                                                Product Summary

                                            </p>

                                        </div>

                                    </div>


                                    <h3 className="mt-5 break-words text-2xl font-light">

                                        {name ||
                                            "Your product"}

                                    </h3>


                                    <div className="mt-6 space-y-3 border-t border-primary/10 pt-5">


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
                                                category ||
                                                "Not selected"
                                            }
                                        />


                                        <SummaryRow
                                            label="Type"
                                            value={
                                                productType ||
                                                "Not selected"
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
                                                vehicleType ||
                                                "Other"
                                            }
                                        />


                                        <SummaryRow
                                            label="Scale"
                                            value={
                                                scale ||
                                                "1:64"
                                            }
                                        />


                                        <SummaryRow
                                            label="Year"
                                            value={
                                                year ||
                                                "Not set"
                                            }
                                        />


                                        <SummaryRow
                                            label="Condition"
                                            value={
                                                condition ||
                                                "New"
                                            }
                                        />


                                        <SummaryRow
                                            label="Quantity"
                                            value={
                                                quantity || 0
                                            }
                                        />


                                        <SummaryRow
                                            label="Images"
                                            value={
                                                finalImageCount
                                            }
                                        />


                                        <SummaryRow
                                            label="Featured"
                                            value={
                                                featured
                                                    ? "Yes"
                                                    : "No"
                                            }
                                        />

                                    </div>

                                </section>


                                {/* =================================================
                                    UPDATE NOTE
                                ================================================= */}

                                <div className="rounded-2xl border border-accent/10 bg-white/60 p-5">

                                    <div className="flex items-center gap-2">

                                        <FaInfoCircle className="text-xs text-accent/50" />

                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent/60">

                                            Update Note

                                        </p>

                                    </div>


                                    <p className="mt-3 text-xs leading-5 text-accent/55">

                                        Existing images are preserved
                                        automatically. Only images
                                        removed from this page will
                                        be removed from the product
                                        record. Newly selected images
                                        are uploaded to Supabase when
                                        you save the product.

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="border-t border-accent/15 bg-white/20 px-5 py-5 sm:px-7 lg:px-9">

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">


                            <button
                                type="button"
                                disabled={loading}
                                onClick={() =>
                                    navigate(
                                        "/admin/products"
                                    )
                                }
                                className="rounded-xl border border-accent/20 bg-primary px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-accent transition hover:border-accent/40 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                Cancel

                            </button>


                            <button
                                type="button"
                                disabled={loading}
                                onClick={
                                    updateProduct
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {loading ? (

                                    <>

                                        <Spinner />

                                        Updating Product...

                                    </>

                                ) : (

                                    <>

                                        <FaSave />

                                        Update Product

                                    </>
                                )}

                            </button>

                        </div>

                    </div>

                </div>

            </div>

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
    icon,
}) {

    return (

        <div className="mb-5 flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-[10px] text-primary">

                {icon || number}

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
   INPUT FIELD
========================================================= */

function InputField({
    label,
    placeholder,
    value,
    onChange,
    disabled = false,
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
                disabled={disabled}
                className={`h-12 w-full rounded-xl border border-accent/15 px-4 text-sm font-medium text-accent outline-none placeholder:text-accent/35 transition focus:border-accent/40 focus:ring-4 focus:ring-accent/10 ${
                    disabled
                        ? "cursor-not-allowed bg-accent/5 text-accent/50"
                        : "bg-primary"
                }`}
            />

        </div>
    );
}


/* =========================================================
   NUMBER FIELD
========================================================= */

function NumberField({
    label,
    value,
    onChange,
    min = "0",
    max,
}) {

    return (

        <div>

            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-accent/70">

                {label}

            </label>


            <input
                type="number"
                min={min}
                max={max}
                value={value}
                onChange={onChange}
                className="h-12 w-full rounded-xl border border-accent/15 bg-primary px-4 text-sm font-medium text-accent outline-none transition placeholder:text-accent/35 focus:border-accent/40 focus:ring-4 focus:ring-accent/10"
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
                    className="h-12 w-full rounded-xl border border-accent/15 bg-primary pl-11 pr-4 text-sm font-medium text-accent outline-none placeholder:text-accent/35 transition focus:border-accent/40 focus:ring-4 focus:ring-accent/10"
                />

            </div>

        </div>
    );
}


/* =========================================================
   SELECT FIELD
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
                className="h-12 w-full rounded-xl border border-accent/15 bg-primary px-4 text-sm font-medium text-accent outline-none transition focus:border-accent/40 focus:ring-4 focus:ring-accent/10"
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


            <span className="max-w-[65%] truncate text-right text-xs font-medium text-primary/85">

                {value}

            </span>

        </div>
    );
}


/* =========================================================
   SPINNER
========================================================= */

function Spinner() {

    return (

        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />

    );
}