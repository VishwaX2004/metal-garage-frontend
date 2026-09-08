import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CiCirclePlus } from "react-icons/ci";
import {
    FaRegEdit,
    FaRegTrashAlt,
    FaBoxOpen,
    FaSearch,
    FaLayerGroup,
    FaPalette,
    FaBoxes,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../../components/loader";


/* =========================================================
   DELETE CONFIRMATION
========================================================= */

function AdminProductDeleteConfirm(props) {

    const productID = props.productID;
    const onClose = props.onClose;
    const refresh = props.refresh;

    const [isDeleting, setIsDeleting] = useState(false);

    function handleDelete() {

        const token = localStorage.getItem("token");

        setIsDeleting(true);

        axios.delete(
            import.meta.env.VITE_API_URL + "/api/products/" + productID,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then((response) => {

                console.log(
                    "Product deleted successfully:",
                    response.data
                );

                toast.success("Product deleted successfully");

                refresh();
                onClose();

            })
            .catch((error) => {

                console.error(
                    "Error deleting product:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Error deleting product"
                );

                setIsDeleting(false);

            });
    }

    return (
        <div className="fixed inset-0 z-[100] flex h-screen w-full items-center justify-center bg-black/50 px-4">

            <div className="relative flex w-full max-w-[450px] flex-col items-center justify-center gap-6 rounded-2xl bg-primary p-8 shadow-2xl">

                {/* Close button */}

                <button
                    type="button"
                    onClick={onClose}
                    disabled={isDeleting}
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-red-600 font-bold text-white transition-all hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    ×
                </button>


                {/* Icon */}

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <FaRegTrashAlt className="text-xl" />
                </div>


                {/* Message */}

                <div className="text-center">

                    <h2 className="text-lg font-bold text-accent">
                        Delete Product?
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-accent/60">
                        Are you sure you want to delete this product?
                    </p>

                    <p className="mt-1 font-mono text-xs font-bold text-accent/80">
                        {productID}
                    </p>

                    <p className="mt-2 text-xs text-red-500">
                        This action cannot be undone.
                    </p>

                </div>


                {/* Buttons */}

                <div className="flex w-full gap-3">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 rounded-xl border border-accent/15 bg-primary px-4 py-3 text-sm font-semibold text-accent transition-all hover:bg-accent/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        {isDeleting ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <FaRegTrashAlt />
                                Delete
                            </>
                        )}

                    </button>

                </div>

            </div>

        </div>
    );
}


/* =========================================================
   ADMIN PRODUCT PAGE
========================================================= */

export default function AdminProductPage() {

    const [products, setProducts] = useState([]);

    const navigate = useNavigate();

    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] =
        useState(false);

    const [productToDelete, setProductToDelete] =
        useState(null);

    const [isLoading, setIsLoading] =
        useState(true);


    /* =====================================================
       GET PRODUCTS
    ===================================================== */

    useEffect(() => {

        if (!isLoading) {
            return;
        }

        axios
            .get(
                import.meta.env.VITE_API_URL +
                "/api/products"
            )
            .then((response) => {

                setProducts(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

                setIsLoading(false);

            })
            .catch((error) => {

                console.error(
                    "Error fetching products:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load products"
                );

                setIsLoading(false);

            });

    }, [isLoading]);


    /* =====================================================
       DELETE REFRESH
    ===================================================== */

    function refreshProducts() {
        setIsLoading(true);
    }


    return (

        <div className="min-h-full w-full bg-primary p-4 text-accent sm:p-6 lg:p-8">


            {/* =================================================
                DELETE MODAL
            ================================================= */}

            {isDeleteConfirmVisible && (

                <AdminProductDeleteConfirm
                    productID={productToDelete}
                    refresh={refreshProducts}
                    onClose={() => {
                        setIsDeleteConfirmVisible(false);
                        setProductToDelete(null);
                    }}
                />

            )}


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mx-auto mb-8 max-w-[1700px]">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                        <div className="mb-3 flex items-center gap-3">

                            <span className="h-px w-8 bg-accent/50" />

                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/65">
                                METAL GARAGE / ADMIN
                            </p>

                        </div>


                        <h1 className="text-3xl font-bold tracking-tight text-accent sm:text-4xl">
                            Products
                        </h1>


                        <p className="mt-2 max-w-2xl text-sm leading-6 text-accent/65">
                            Manage your product collection, variants,
                            pricing, colors, sizes and inventory.
                        </p>

                    </div>


                    {/* Add product */}

                    <Link
                        to="/admin/add-product"
                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-primary shadow-lg shadow-accent/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
                    >

                        <CiCirclePlus className="text-2xl transition-transform duration-300 group-hover:rotate-90" />

                        <span>
                            Add Product
                        </span>

                    </Link>

                </div>

            </div>


            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div className="mx-auto mb-8 grid max-w-[1700px] grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">


                <SummaryCard
                    title="Total Products"
                    value={products.length}
                    icon={<FaBoxOpen />}
                    description="Products in catalog"
                />


                <SummaryCard
                    title="Total Variants"
                    value={getTotalVariants(products)}
                    icon={<FaLayerGroup />}
                    description="Size & color combinations"
                />


                <SummaryCard
                    title="Total Stock"
                    value={getTotalStock(products)}
                    icon={<FaBoxes />}
                    description="Units currently recorded"
                />


                <SummaryCard
                    title="Categories"
                    value={getCategories(products)}
                    icon={<FaPalette />}
                    description="Product categories"
                />

            </div>


            {/* =================================================
                PRODUCT CATALOG
            ================================================= */}

            <div className="mx-auto max-w-[1700px] overflow-hidden rounded-3xl border border-accent/15 bg-white/45 shadow-[0_20px_70px_-35px_rgba(8,6,22,0.35)] backdrop-blur-xl">


                {/* Catalog header */}

                <div className="border-b border-accent/10 p-5 sm:p-6">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">


                        <div>

                            <h2 className="text-xl font-bold text-accent">
                                Product Catalog
                            </h2>

                            <p className="mt-1.5 text-xs font-medium text-accent/55">

                                {products.length} product
                                {products.length !== 1 ? "s" : ""} in your catalog

                            </p>

                        </div>


                        {/* Search UI */}

                        <div className="flex w-full items-center gap-3 rounded-xl border border-accent/15 bg-primary px-4 py-3 lg:w-[300px]">

                            <FaSearch className="shrink-0 text-sm text-accent/55" />

                            <span className="text-sm font-medium text-accent/50">
                                Search products...
                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    LOADING
                ================================================= */}

                {isLoading ? (

                    <div className="flex min-h-[300px] items-center justify-center">

                        <Loader />

                    </div>

                ) : (

                    /* =================================================
                       TABLE
                    ================================================= */

                    <div className="w-full overflow-x-auto">

                        <table className="w-full min-w-[1200px] border-collapse">


                            {/* =================================================
                                TABLE HEAD
                            ================================================= */}

                            <thead>

                                <tr className="border-b border-accent/10 bg-accent/[0.035]">

                                    <TableHeader>
                                        Product
                                    </TableHeader>

                                    <TableHeader>
                                        Product ID
                                    </TableHeader>

                                    <TableHeader>
                                        Pricing
                                    </TableHeader>

                                    <TableHeader>
                                        Variants
                                    </TableHeader>

                                    <TableHeader>
                                        Sizes
                                    </TableHeader>

                                    <TableHeader>
                                        Colors
                                    </TableHeader>

                                    <TableHeader>
                                        Stock
                                    </TableHeader>

                                    <TableHeader>
                                        Category
                                    </TableHeader>

                                    <TableHeader center>
                                        Actions
                                    </TableHeader>

                                </tr>

                            </thead>


                            {/* =================================================
                                TABLE BODY
                            ================================================= */}

                            <tbody>

                                {products.length > 0 ? (

                                    products.map((item) => {


                                        /* -----------------------------------------
                                           VARIANTS
                                        ----------------------------------------- */

                                        const variants =
                                            Array.isArray(item.variants)
                                                ? item.variants
                                                : [];


                                        /* -----------------------------------------
                                           TOTAL STOCK
                                        ----------------------------------------- */

                                        const totalStock =
                                            variants.reduce(
                                                (total, variant) =>
                                                    total +
                                                    Number(
                                                        variant.stock || 0
                                                    ),
                                                0
                                            );


                                        /* -----------------------------------------
                                           AVAILABLE VARIANTS
                                        ----------------------------------------- */

                                        const availableVariants =
                                            variants.filter(
                                                (variant) =>
                                                    variant.isAvailable &&
                                                    Number(
                                                        variant.stock || 0
                                                    ) > 0
                                            );


                                        /* -----------------------------------------
                                           SIZES
                                        ----------------------------------------- */

                                        const sizes = [
                                            ...new Set(
                                                variants
                                                    .map(
                                                        (variant) =>
                                                            variant.size
                                                    )
                                                    .filter(Boolean)
                                            ),
                                        ];


                                        /* -----------------------------------------
                                           COLORS
                                        ----------------------------------------- */

                                        const colors = [
                                            ...new Set(
                                                variants
                                                    .map(
                                                        (variant) =>
                                                            variant.color
                                                    )
                                                    .filter(Boolean)
                                            ),
                                        ];


                                        return (

                                            <tr
                                                key={item.productID}
                                                className="group border-b border-accent/[0.08] transition-all duration-200 hover:bg-accent/[0.025]"
                                            >


                                                {/* =================================================
                                                    PRODUCT
                                                ================================================= */}

                                                <td className="px-6 py-5">

                                                    <div className="flex min-w-[270px] items-center gap-4">


                                                        {/* Image */}

                                                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-accent/10 bg-primary shadow-sm">

                                                            {item.images &&
                                                            item.images.length > 0 ? (

                                                                <img
                                                                    src={item.images[0]}
                                                                    alt={item.name || "Product"}
                                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                                />

                                                            ) : (

                                                                <div className="flex h-full w-full items-center justify-center text-accent/30">

                                                                    <FaBoxOpen className="text-xl" />

                                                                </div>

                                                            )}

                                                        </div>


                                                        {/* Product details */}

                                                        <div className="min-w-0">

                                                            <p className="truncate text-sm font-bold text-accent">
                                                                {item.name || "Unnamed Product"}
                                                            </p>

                                                            <p className="mt-1.5 text-xs font-semibold text-accent/60">
                                                                {item.brand || "No brand"}
                                                            </p>

                                                            <div className="mt-2 flex items-center gap-2">

                                                                <span className="rounded-full bg-accent/[0.06] px-2.5 py-1 text-[10px] font-semibold text-accent/60">
                                                                    {item.gender || "Unisex"}
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* =================================================
                                                    PRODUCT ID
                                                ================================================= */}

                                                <td className="px-6 py-5">

                                                    <div className="min-w-[130px]">

                                                        <span className="inline-flex rounded-lg border border-accent/10 bg-primary px-3 py-2 font-mono text-xs font-bold text-accent/75">

                                                            {item.productID}

                                                        </span>

                                                    </div>

                                                </td>


                                                {/* =================================================
                                                    PRICING
                                                ================================================= */}

                                                <td className="px-6 py-5">

                                                    <div className="min-w-[125px]">

                                                        <p className="text-base font-bold text-accent">

                                                            Rs.{" "}

                                                            {Number(
                                                                item.price || 0
                                                            ).toLocaleString()}

                                                        </p>


                                                        <p className="mt-1.5 text-xs font-medium text-accent/40 line-through">

                                                            Rs.{" "}

                                                            {Number(
                                                                item.labelledPrice || 0
                                                            ).toLocaleString()}

                                                        </p>

                                                    </div>

                                                </td>


                                                {/* =================================================
                                                    VARIANTS
                                                ================================================= */}

                                                <td className="px-6 py-5">

                                                    <div className="min-w-[100px]">

                                                        <div className="flex items-center gap-2">

                                                            <span className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-accent px-2 text-xs font-bold text-primary">

                                                                {variants.length}

                                                            </span>


                                                            <div>

                                                                <p className="text-xs font-bold text-accent">
                                                                    Variants
                                                                </p>

                                                                <p className="mt-0.5 text-[10px] font-medium text-accent/45">

                                                                    {availableVariants.length} available

                                                                </p>

                                                            </div>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* =================================================
                                                    SIZES
                                                ================================================= */}

                                                <td className="px-6 py-5">

                                                    <div className="min-w-[140px]">

                                                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-accent/40">
                                                            Available sizes
                                                        </p>


                                                        <div className="flex flex-wrap gap-1.5">

                                                            {sizes.length > 0 ? (

                                                                sizes.map((size) => (

                                                                    <span
                                                                        key={size}
                                                                        className="inline-flex min-w-8 items-center justify-center rounded-lg border border-accent/15 bg-primary px-2.5 py-1.5 text-[10px] font-bold text-accent/75"
                                                                    >
                                                                        {size}
                                                                    </span>

                                                                ))

                                                            ) : (

                                                                <span className="text-xs font-medium text-accent/35">
                                                                    No sizes
                                                                </span>

                                                            )}

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* =================================================
                                                    COLORS
                                                ================================================= */}

                                                <td className="px-6 py-5">

                                                    <div className="min-w-[160px]">

                                                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-accent/40">
                                                            Available colors
                                                        </p>


                                                        <div className="flex max-w-[190px] flex-wrap gap-1.5">

                                                            {colors.length > 0 ? (

                                                                colors.map((color) => (

                                                                    <span
                                                                        key={color}
                                                                        className="rounded-full border border-accent/15 bg-primary px-3 py-1.5 text-[10px] font-semibold text-accent/70"
                                                                    >
                                                                        {color}
                                                                    </span>

                                                                ))

                                                            ) : (

                                                                <span className="text-xs font-medium text-accent/35">
                                                                    No colors
                                                                </span>

                                                            )}

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* =================================================
                                                    STOCK
                                                ================================================= */}

                                                <td className="px-6 py-5">

                                                    <div className="min-w-[120px]">

                                                        <span
                                                            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${
                                                                totalStock > 0
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-700"
                                                            }`}
                                                        >

                                                            <span
                                                                className={`h-2 w-2 rounded-full ${
                                                                    totalStock > 0
                                                                        ? "bg-green-600"
                                                                        : "bg-red-500"
                                                                }`}
                                                            />

                                                            {totalStock > 0
                                                                ? `${totalStock} units`
                                                                : "Out of stock"}

                                                        </span>

                                                    </div>

                                                </td>


                                                {/* =================================================
                                                    CATEGORY
                                                ================================================= */}

                                                <td className="px-6 py-5">

                                                    <div className="min-w-[120px]">

                                                        <span className="inline-flex rounded-xl border border-accent/15 bg-primary px-3 py-2 text-xs font-bold text-accent/70">

                                                            {item.category ||
                                                                "Uncategorized"}

                                                        </span>


                                                        {item.material && (

                                                            <p className="mt-2 text-[10px] font-medium text-accent/40">
                                                                {item.material}
                                                            </p>

                                                        )}

                                                    </div>

                                                </td>


                                                {/* =================================================
                                                    ACTIONS
                                                ================================================= */}

                                                <td className="px-6 py-5">

                                                    <div className="flex min-w-[90px] items-center justify-center gap-2">


                                                        {/* EDIT */}

                                                        <button
                                                            type="button"
                                                            title="Edit product"
                                                            onClick={() => {

                                                                navigate(
                                                                    "/admin/update-product",
                                                                    {
                                                                        state: item,
                                                                    }
                                                                );

                                                            }}
                                                            className="group/edit flex h-10 w-10 items-center justify-center rounded-xl border border-accent/15 bg-primary text-accent/65 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-primary hover:shadow-md"
                                                        >

                                                            <FaRegEdit className="text-sm transition-transform duration-200 group-hover/edit:scale-110" />

                                                        </button>


                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            title="Delete product"
                                                            onClick={() => {

                                                                setProductToDelete(
                                                                    item.productID
                                                                );

                                                                setIsDeleteConfirmVisible(
                                                                    true
                                                                );

                                                            }}
                                                            className="group/delete flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-500 hover:text-white hover:shadow-md"
                                                        >

                                                            <FaRegTrashAlt className="text-sm transition-transform duration-200 group-hover/delete:scale-110" />

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    })

                                ) : (

                                    /* =================================================
                                       NO PRODUCTS
                                    ================================================= */

                                    <tr>

                                        <td
                                            colSpan="9"
                                            className="px-6 py-16 text-center"
                                        >

                                            <div className="flex flex-col items-center justify-center">

                                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/5 text-accent/30">

                                                    <FaBoxOpen className="text-2xl" />

                                                </div>

                                                <p className="text-sm font-bold text-accent">
                                                    No products found
                                                </p>

                                                <p className="mt-1 text-xs text-accent/50">
                                                    Add your first product to get started.
                                                </p>

                                            </div>

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="mx-auto mt-5 flex max-w-[1700px] flex-col gap-2 text-xs font-medium text-accent/45 sm:flex-row sm:items-center sm:justify-between">

                <p>
                    Metal Garage Product Management
                </p>

                <p>

                    Showing {products.length} product
                    {products.length !== 1 ? "s" : ""}

                </p>

            </div>

        </div>
    );
}


/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
    title,
    value,
    icon,
    description,
}) {

    return (

        <div className="group rounded-2xl border border-accent/15 bg-white/45 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-start justify-between gap-4">

                <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent/60">
                        {title}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-accent">
                        {value}
                    </h2>

                    <p className="mt-1 text-xs font-medium text-accent/50">
                        {description}
                    </p>

                </div>


                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary shadow-md transition-transform duration-300 group-hover:scale-105">

                    {icon}

                </div>

            </div>

        </div>
    );
}


/* =========================================================
   TABLE HEADER
========================================================= */

function TableHeader({
    children,
    center = false,
}) {

    return (

        <th
            className={`px-6 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-accent/65 ${
                center
                    ? "text-center"
                    : "text-left"
            }`}
        >
            {children}
        </th>

    );
}


/* =========================================================
   TOTAL VARIANTS
========================================================= */

function getTotalVariants(products) {

    return products.reduce(
        (total, product) =>

            total +
            (
                Array.isArray(product.variants)
                    ? product.variants.length
                    : 0
            ),

        0
    );
}


/* =========================================================
   TOTAL STOCK
========================================================= */

function getTotalStock(products) {

    return products.reduce(
        (total, product) => {

            if (!Array.isArray(product.variants)) {
                return total;
            }

            return (
                total +
                product.variants.reduce(
                    (variantTotal, variant) =>

                        variantTotal +
                        Number(
                            variant.stock || 0
                        ),

                    0
                )
            );

        },

        0
    );
}


/* =========================================================
   CATEGORY COUNT
========================================================= */

function getCategories(products) {

    return new Set(
        products
            .map(
                (product) =>
                    product.category
            )
            .filter(Boolean)
    ).size;
}

