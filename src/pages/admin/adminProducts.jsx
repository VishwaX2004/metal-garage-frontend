import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
    FaRegEdit,
    FaRegTrashAlt,
    FaBoxOpen,
    FaSearch,
    FaBoxes,
    FaExclamationTriangle,
    FaTimesCircle,
    FaPlus,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../../components/loader";

function AdminProductDeleteConfirm({
    productID,
    onClose,
    refresh,
}) {
    const [isDeleting, setIsDeleting] = useState(false);

    function handleDelete() {
        const token = localStorage.getItem("token");

        if (!productID) {
            toast.error("Product ID is required");
            return;
        }

        setIsDeleting(true);

        axios
            .delete(
                `${import.meta.env.VITE_API_URL}/api/products/${encodeURIComponent(
                    productID
                )}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                toast.success(
                    response.data?.message ||
                        "Product deleted successfully"
                );

                refresh();
                onClose();
            })
            .catch((error) => {
                console.error(
                    "Delete product error:",
                    error.response?.data || error
                );

                toast.error(
                    error.response?.data?.message ||
                        "Error deleting product"
                );

                setIsDeleting(false);
            });
    }

    return (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-[#0A0A0A]/[0.62] px-5 backdrop-blur-[4px]">
            <div className="w-full max-w-[620px] overflow-hidden rounded-[14px] border border-black/15 bg-[#F5F5DC] shadow-[0_30px_70px_rgba(0,0,0,.25)]">

                <div className="flex items-center justify-between border-b border-black/[0.14] px-[22px] py-5">
                    <div>
                        <h3 className="text-base font-semibold text-[#0A0A0A]">
                            Delete Product
                        </h3>

                        <p className="mt-1 text-[11px] text-black/40">
                            This action cannot be undone
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-black/50 transition hover:bg-[#ECE8D6] hover:text-[#0A0A0A]"
                    >
                        <FaTimesCircle />
                    </button>
                </div>

                <div className="px-[22px] py-6">
                    <div className="flex items-start gap-4 rounded-lg border border-[#FF3B00]/15 bg-[#FF3B00]/[0.05] p-4">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FF3B00]/10 text-[#FF3B00]">
                            <FaRegTrashAlt />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-[#0A0A0A]">
                                Are you sure you want to delete this
                                product?
                            </p>

                            <p className="mt-2 font-mono text-[10px] text-black/45">
                                PRODUCT ID: {productID}
                            </p>

                            <p className="mt-3 text-[11px] leading-5 text-[#FF3B00]">
                                Deleting this product will permanently
                                remove it from your catalog.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-[9px] border-t border-black/[0.14] px-[22px] py-4">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="rounded-[7px] border border-black/[0.14] bg-[#F5F5DC] px-[18px] py-[11px] text-[12px] font-semibold uppercase tracking-[0.06em] text-[#0A0A0A] transition hover:border-[#0A0A0A] hover:bg-[#ECE8D6]"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-2 rounded-[7px] bg-[#0A0A0A] px-[18px] py-[11px] text-[12px] font-semibold uppercase tracking-[0.06em] text-[#F5F5DC] transition hover:bg-[#FF3B00] hover:text-[#0A0A0A] disabled:opacity-60"
                    >
                        {isDeleting ? (
                            <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#F5F5DC] border-t-transparent" />
                                Deleting
                            </>
                        ) : (
                            <>
                                <FaRegTrashAlt className="text-[11px]" />
                                Delete
                            </>
                        )}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default function AdminProductPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [stockStatus, setStockStatus] = useState("all");

    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] =
        useState(false);

    const [productToDelete, setProductToDelete] =
        useState(null);

    const navigate = useNavigate();

    function fetchProducts() {
        setIsLoading(true);

        axios
            .get(`${import.meta.env.VITE_API_URL}/api/products`)
            .then((response) => {
                setProducts(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );
            })
            .catch((error) => {
                console.error(
                    "Error fetching products:",
                    error.response?.data || error
                );

                toast.error(
                    error.response?.data?.message ||
                        "Failed to load products"
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    /*
    =========================================================
    GET PRODUCT STOCK
    Your Product Schema uses:

        quantity: Number

    NOT:

        variants[].stock

    Therefore stock must come from product.quantity.
    =========================================================
    */

    function getProductStock(product) {
        return Number(product?.quantity || 0);
    }

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const totalStock = getProductStock(product);

            const searchText = search.toLowerCase().trim();

            const matchesSearch =
                !searchText ||
                product.name
                    ?.toLowerCase()
                    .includes(searchText) ||
                product.productID
                    ?.toLowerCase()
                    .includes(searchText);

            const matchesCategory =
                category === "all" ||
                product.category === category;

            let matchesStock = true;

            if (stockStatus === "in-stock") {
                matchesStock = totalStock > 10;
            }

            if (stockStatus === "low") {
                matchesStock =
                    totalStock > 0 && totalStock <= 10;
            }

            if (stockStatus === "out") {
                matchesStock = totalStock <= 0;
            }

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStock
            );
        });
    }, [products, search, category, stockStatus]);

    function resetFilters() {
        setSearch("");
        setCategory("all");
        setStockStatus("all");
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

                .metal-garage-products {
                    font-family: 'Work Sans', sans-serif;
                    -webkit-font-smoothing: antialiased;
                }

                .display-font {
                    font-family: 'Oswald', sans-serif;
                    text-transform: uppercase;
                    letter-spacing: .01em;
                    font-weight: 700;
                    line-height: 1.05;
                }

                .mono-font {
                    font-family: 'JetBrains Mono', monospace;
                    letter-spacing: .03em;
                }

                @keyframes rowIn {
                    from {
                        opacity: 0;
                        transform: translateY(4px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .metal-row {
                    animation: rowIn .2s ease both;
                }
            `}</style>

            <div className="metal-garage-products min-h-screen w-full bg-[#ECE8D6] text-[#0A0A0A]">

                {isDeleteConfirmVisible && (
                    <AdminProductDeleteConfirm
                        productID={productToDelete}
                        refresh={fetchProducts}
                        onClose={() => {
                            setIsDeleteConfirmVisible(false);
                            setProductToDelete(null);
                        }}
                    />
                )}

                <main className="w-full">
                    <section className="px-4 pb-12 pt-6 sm:px-6 lg:px-8 xl:px-10">
                        <div className="mx-auto max-w-[1700px]">

                            {/* HEADER */}

                            <div className="mb-6 flex flex-wrap items-center justify-between gap-5">

                                <div>
                                    <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-black/40">
                                        GARAGE / CATALOG
                                    </div>

                                    <h1 className="display-font text-[30px] sm:text-[34px] lg:text-[38px]">
                                        Product Management
                                    </h1>

                                    <p className="mt-[7px] max-w-[620px] text-[12px] leading-5 text-black/48">
                                        Manage your Metal Garage collection
                                        and monitor inventory.
                                    </p>
                                </div>

                                <Link
                                    to="/admin/add-product"
                                    className="group inline-flex items-center justify-center gap-2 rounded-[7px] bg-[#0A0A0A] px-[18px] py-[11px] text-[12px] font-semibold uppercase tracking-[0.06em] text-[#F5F5DC] transition hover:bg-[#FF8F00] hover:text-[#0A0A0A] max-sm:w-full"
                                >
                                    <FaPlus className="transition-transform duration-200 group-hover:rotate-90" />
                                    Add Product
                                </Link>

                            </div>

                            {/* STAT CARDS */}

                            <div className="mb-[22px] grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-4">

                                <StatCard
                                    title="Total Products"
                                    value={products.length}
                                    description="Active products in store"
                                    icon={<FaBoxOpen />}
                                    iconType="black"
                                />

                                <StatCard
                                    title="Total Inventory"
                                    value={getTotalStock(products)}
                                    description="Units currently available"
                                    icon={<FaBoxes />}
                                    iconType="orange"
                                />

                                <StatCard
                                    title="Low Stock"
                                    value={getLowStockProducts(products)}
                                    description="Products need attention"
                                    icon={<FaExclamationTriangle />}
                                    iconType="orange"
                                />

                                <StatCard
                                    title="Out of Stock"
                                    value={getOutOfStockProducts(products)}
                                    description="Products unavailable"
                                    icon={<FaTimesCircle />}
                                    iconType="red"
                                />

                            </div>

                            {/* FILTERS */}

                            <div className="mb-[18px] flex flex-wrap items-center gap-3 rounded-[12px] border border-black/[0.14] bg-[#F5F5DC] p-[17px]">

                                <div className="flex min-w-[230px] flex-1 items-center gap-2.5 rounded-[7px] border border-black/[0.14] bg-[#ECE8D6] px-[13px] py-[10px]">

                                    <FaSearch className="text-[14px] text-black/40" />

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search product name or ID..."
                                        className="w-full border-none bg-transparent text-[13px] outline-none placeholder:text-black/40"
                                    />

                                </div>

                                <select
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                    className="min-w-[155px] cursor-pointer rounded-[7px] border border-black/[0.14] bg-[#ECE8D6] px-[13px] py-[10px] text-[12px] outline-none"
                                >
                                    <option value="all">
                                        All Categories
                                    </option>

                                    <option value="Main Line">
                                        Main Line
                                    </option>

                                    <option value="Premium">
                                        Premium
                                    </option>

                                    <option value="Silver Series">
                                        Silver Series
                                    </option>

                                    <option value="Fantasy">
                                        Fantasy
                                    </option>
                                </select>

                                <select
                                    value={stockStatus}
                                    onChange={(e) =>
                                        setStockStatus(e.target.value)
                                    }
                                    className="min-w-[155px] cursor-pointer rounded-[7px] border border-black/[0.14] bg-[#ECE8D6] px-[13px] py-[10px] text-[12px] outline-none"
                                >
                                    <option value="all">
                                        All Stock Status
                                    </option>

                                    <option value="in-stock">
                                        In Stock
                                    </option>

                                    <option value="low">
                                        Low Stock
                                    </option>

                                    <option value="out">
                                        Out of Stock
                                    </option>
                                </select>

                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="rounded-[7px] border border-black/[0.14] bg-[#F5F5DC] px-[18px] py-[11px] text-[12px] font-semibold uppercase tracking-[0.06em] transition hover:border-[#0A0A0A] hover:bg-[#ECE8D6]"
                                >
                                    Reset
                                </button>

                            </div>

                            {/* TABLE */}

                            <div className="overflow-hidden rounded-[12px] border border-black/[0.14] bg-[#F5F5DC]">

                                <div className="flex items-center justify-between gap-3 border-b border-black/[0.14] px-[22px] py-5">

                                    <div>
                                        <h2 className="text-[15px] font-semibold">
                                            All Products
                                        </h2>

                                        <p className="mt-1 text-[11.5px] text-black/43">
                                            Product catalog and real-time
                                            inventory levels
                                        </p>
                                    </div>

                                    <div className="mono-font text-[11px] text-black/45">
                                        {filteredProducts.length} PRODUCTS
                                    </div>

                                </div>

                                {isLoading ? (
                                    <div className="flex min-h-[380px] items-center justify-center">
                                        <Loader />
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">

                                        <table className="w-full min-w-[980px] border-collapse">

                                            <thead>
                                                <tr>

                                                    <TableHeader>
                                                        Product
                                                    </TableHeader>

                                                    <TableHeader>
                                                        Category
                                                    </TableHeader>

                                                    <TableHeader>
                                                        Price
                                                    </TableHeader>

                                                    <TableHeader>
                                                        Inventory
                                                    </TableHeader>

                                                    <TableHeader>
                                                        Status
                                                    </TableHeader>

                                                    <TableHeader>
                                                        Actions
                                                    </TableHeader>

                                                </tr>
                                            </thead>

                                            <tbody>

                                                {filteredProducts.length > 0 ? (
                                                    filteredProducts.map(
                                                        (item, index) => {

                                                            const totalStock =
                                                                getProductStock(
                                                                    item
                                                                );

                                                            const inventoryPercent =
                                                                Math.min(
                                                                    (totalStock /
                                                                        50) *
                                                                        100,
                                                                    100
                                                                );

                                                            let currentStockStatus =
                                                                "in-stock";

                                                            let stockText =
                                                                "In Stock";

                                                            if (
                                                                totalStock <=
                                                                0
                                                            ) {
                                                                currentStockStatus =
                                                                    "out-stock";

                                                                stockText =
                                                                    "Out of Stock";
                                                            } else if (
                                                                totalStock <=
                                                                10
                                                            ) {
                                                                currentStockStatus =
                                                                    "low-stock";

                                                                stockText =
                                                                    "Low Stock";
                                                            }

                                                            return (
                                                                <tr
                                                                    key={
                                                                        item.productID ||
                                                                        index
                                                                    }
                                                                    className="metal-row border-b border-black/[0.07] hover:bg-[#ECE8D6]"
                                                                    style={{
                                                                        animationDelay: `${index * 30}ms`,
                                                                    }}
                                                                >

                                                                    {/* PRODUCT */}

                                                                    <td className="px-[18px] py-[15px]">

                                                                        <div className="flex min-w-[200px] items-center gap-3">

                                                                            <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-black/[0.08] bg-[#ECE8D6]">

                                                                                {Array.isArray(
                                                                                    item.images
                                                                                ) &&
                                                                                item
                                                                                    .images
                                                                                    .length >
                                                                                    0 ? (
                                                                                    <img
                                                                                        src={
                                                                                            item
                                                                                                .images[0]
                                                                                        }
                                                                                        alt={
                                                                                            item.name ||
                                                                                            "Product"
                                                                                        }
                                                                                        className="h-full w-full object-contain"
                                                                                    />
                                                                                ) : (
                                                                                    <FaBoxOpen className="text-lg text-black/25" />
                                                                                )}

                                                                            </div>

                                                                            <div className="min-w-0">

                                                                                <div className="max-w-[210px] truncate text-[13px] font-semibold">
                                                                                    {item.name ||
                                                                                        "Unnamed Product"}
                                                                                </div>

                                                                                <div className="mono-font mt-1 text-[9.5px] text-black/38">
                                                                                    {
                                                                                        item.productID
                                                                                    }
                                                                                </div>

                                                                            </div>

                                                                        </div>

                                                                    </td>

                                                                    {/* CATEGORY */}

                                                                    <td className="px-[18px] py-[15px]">

                                                                        <span className="mono-font inline-flex rounded-[5px] bg-black/[0.05] px-[9px] py-[5px] text-[10.5px] text-black/65">
                                                                            {item.category ||
                                                                                "Uncategorized"}
                                                                        </span>

                                                                    </td>

                                                                    {/* PRICE */}

                                                                    <td className="px-[18px] py-[15px]">

                                                                        <span className="mono-font text-[12.5px] font-semibold">
                                                                            Rs.{" "}
                                                                            {Number(
                                                                                item.price ||
                                                                                    0
                                                                            ).toLocaleString()}
                                                                        </span>

                                                                        {item.labelledPrice &&
                                                                            Number(
                                                                                item.labelledPrice
                                                                            ) >
                                                                                Number(
                                                                                    item.price ||
                                                                                        0
                                                                                ) && (
                                                                                <div className="mono-font mt-1 text-[9px] text-black/35 line-through">
                                                                                    Rs.{" "}
                                                                                    {Number(
                                                                                        item.labelledPrice
                                                                                    ).toLocaleString()}
                                                                                </div>
                                                                            )}

                                                                    </td>

                                                                    {/* INVENTORY */}

                                                                    <td className="px-[18px] py-[15px]">

                                                                        <div className="min-w-[160px]">

                                                                            <div className="mb-[7px] flex justify-between">

                                                                                <span className="mono-font text-[12px] font-semibold">
                                                                                    {
                                                                                        totalStock
                                                                                    }{" "}
                                                                                    units
                                                                                </span>

                                                                                <span className="mono-font text-[9px] text-black/40">
                                                                                    {Math.round(
                                                                                        inventoryPercent
                                                                                    )}
                                                                                    %
                                                                                </span>

                                                                            </div>

                                                                            <div className="h-[6px] overflow-hidden rounded-full bg-[#ECE8D6]">

                                                                                <div
                                                                                    className={`h-full rounded-full ${
                                                                                        totalStock <=
                                                                                        0
                                                                                            ? "bg-black/25"
                                                                                            : totalStock <=
                                                                                              10
                                                                                            ? "bg-[#FF3B00]"
                                                                                            : totalStock <=
                                                                                              20
                                                                                            ? "bg-[#FF8F00]"
                                                                                            : "bg-[#2F7A45]"
                                                                                    }`}
                                                                                    style={{
                                                                                        width: `${inventoryPercent}%`,
                                                                                    }}
                                                                                />

                                                                            </div>

                                                                        </div>

                                                                    </td>

                                                                    {/* STATUS */}

                                                                    <td className="px-[18px] py-[15px]">

                                                                        <span
                                                                            className={`mono-font inline-flex items-center gap-[6px] rounded-full px-[9px] py-[5px] text-[9.5px] font-semibold uppercase ${
                                                                                currentStockStatus ===
                                                                                "in-stock"
                                                                                    ? "bg-[#2F7A45]/10 text-[#2F7A45]"
                                                                                    : currentStockStatus ===
                                                                                      "low-stock"
                                                                                    ? "bg-[#FF8F00]/12 text-[#CC7000]"
                                                                                    : "bg-[#FF3B00]/[0.08] text-[#FF3B00]"
                                                                            }`}
                                                                        >

                                                                            <span
                                                                                className={`h-[6px] w-[6px] rounded-full ${
                                                                                    currentStockStatus ===
                                                                                    "in-stock"
                                                                                        ? "bg-[#2F7A45]"
                                                                                        : currentStockStatus ===
                                                                                          "low-stock"
                                                                                        ? "bg-[#FF8F00]"
                                                                                        : "bg-[#FF3B00]"
                                                                                }`}
                                                                            />

                                                                            {
                                                                                stockText
                                                                            }

                                                                        </span>

                                                                    </td>

                                                                    {/* ACTIONS */}

                                                                    <td className="px-[18px] py-[15px]">

                                                                        <div className="flex items-center gap-[5px]">

                                                                            <button
                                                                                type="button"
                                                                                title="Edit product"
                                                                                onClick={() =>
                                                                                    navigate(
                                                                                        "/admin/update-product",
                                                                                        {
                                                                                            state: item,
                                                                                        }
                                                                                    )
                                                                                }
                                                                                className="flex h-[31px] w-[31px] items-center justify-center rounded-[6px] text-black/45 hover:bg-[#ECE8D6] hover:text-[#0A0A0A]"
                                                                            >
                                                                                <FaRegEdit />
                                                                            </button>

                                                                            <button
                                                                                type="button"
                                                                                title="Delete product"
                                                                                onClick={() => {

                                                                                    if (
                                                                                        !item.productID
                                                                                    ) {
                                                                                        toast.error(
                                                                                            "Product ID is required"
                                                                                        );
                                                                                        return;
                                                                                    }

                                                                                    setProductToDelete(
                                                                                        item.productID
                                                                                    );

                                                                                    setIsDeleteConfirmVisible(
                                                                                        true
                                                                                    );
                                                                                }}
                                                                                className="flex h-[31px] w-[31px] items-center justify-center rounded-[6px] text-black/45 hover:bg-[#ECE8D6] hover:text-[#FF3B00]"
                                                                            >
                                                                                <FaRegTrashAlt />
                                                                            </button>

                                                                        </div>

                                                                    </td>

                                                                </tr>
                                                            );
                                                        }
                                                    )
                                                ) : (
                                                    <tr>

                                                        <td
                                                            colSpan="6"
                                                            className="px-6 py-20 text-center"
                                                        >

                                                            <div className="flex flex-col items-center">

                                                                <FaBoxOpen className="mb-4 text-3xl text-black/25" />

                                                                <p className="text-sm font-semibold">
                                                                    No products
                                                                    found
                                                                </p>

                                                                <p className="mt-1 text-[11px] text-black/40">
                                                                    Add your
                                                                    first
                                                                    product to
                                                                    get
                                                                    started.
                                                                </p>

                                                            </div>

                                                        </td>

                                                    </tr>
                                                )}

                                            </tbody>

                                        </table>

                                    </div>
                                )}

                                {!isLoading && (
                                    <div className="flex items-center justify-between border-t border-black/[0.14] px-[18px] py-[15px]">

                                        <div className="text-[11px] text-black/43">
                                            Showing{" "}
                                            <span className="font-semibold">
                                                {
                                                    filteredProducts.length
                                                }
                                            </span>{" "}
                                            product
                                            {filteredProducts.length !==
                                            1
                                                ? "s"
                                                : ""}
                                        </div>

                                        <div className="flex gap-[5px]">

                                            <button
                                                type="button"
                                                disabled
                                                className="flex h-[31px] w-[31px] items-center justify-center rounded-[6px] border border-black/[0.14] text-black/30"
                                            >
                                                <FaChevronLeft className="text-[9px]" />
                                            </button>

                                            <button
                                                type="button"
                                                className="flex h-[31px] w-[31px] items-center justify-center rounded-[6px] bg-[#0A0A0A] font-mono text-[10px] text-[#F5F5DC]"
                                            >
                                                1
                                            </button>

                                            <button
                                                type="button"
                                                disabled
                                                className="flex h-[31px] w-[31px] items-center justify-center rounded-[6px] border border-black/[0.14] text-black/30"
                                            >
                                                <FaChevronRight className="text-[9px]" />
                                            </button>

                                        </div>

                                    </div>
                                )}

                            </div>

                            <div className="mt-5 flex items-center justify-between text-[10px] text-black/35">

                                <span className="mono-font">
                                    METAL GARAGE / PRODUCT MANAGEMENT
                                </span>

                                <span className="mono-font">
                                    {products.length} PRODUCTS
                                </span>

                            </div>

                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
    title,
    value,
    description,
    icon,
    iconType,
}) {
    const iconClasses = {
        black: "bg-black/[0.06] text-[#0A0A0A]",
        orange: "bg-[#FF8F00]/[0.12] text-[#CC7000]",
        red: "bg-[#FF3B00]/10 text-[#FF3B00]",
        green: "bg-[#2F7A45]/[0.12] text-[#2F7A45]",
    };

    return (
        <div className="rounded-[12px] border border-black/[0.14] bg-[#F5F5DC] px-[21px] py-[19px] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(10,10,10,.07)]">

            <div className="mb-[14px]">
                <div
                    className={`flex h-[38px] w-[38px] items-center justify-center rounded-[9px] ${iconClasses[iconType]}`}
                >
                    {icon}
                </div>
            </div>

            <div className="mb-[5px] text-[12px] text-black/50">
                {title}
            </div>

            <div className="mono-font text-[25px] font-semibold">
                {value}
            </div>

            <div className="mt-[5px] text-[11px] text-black/40">
                {description}
            </div>

        </div>
    );
}


/* =========================================================
   TABLE HEADER
========================================================= */

function TableHeader({ children }) {
    return (
        <th className="whitespace-nowrap border-b border-black/[0.14] px-[18px] py-[13px] text-left font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-black/42">
            {children}
        </th>
    );
}


/* =========================================================
   TOTAL INVENTORY
   USES product.quantity
========================================================= */

function getTotalStock(products) {
    return products.reduce((total, product) => {
        return total + Number(product?.quantity || 0);
    }, 0);
}


/* =========================================================
   LOW STOCK PRODUCTS
   1 - 10 UNITS
========================================================= */

function getLowStockProducts(products) {
    return products.filter((product) => {
        const totalStock = getProductStockValue(product);

        return totalStock > 0 && totalStock <= 10;
    }).length;
}


/* =========================================================
   OUT OF STOCK PRODUCTS
========================================================= */

function getOutOfStockProducts(products) {
    return products.filter((product) => {
        return getProductStockValue(product) <= 0;
    }).length;
}


/* =========================================================
   PRODUCT STOCK VALUE
   USES product.quantity FROM YOUR SCHEMA
========================================================= */

function getProductStockValue(product) {
    return Number(product?.quantity || 0);
}

