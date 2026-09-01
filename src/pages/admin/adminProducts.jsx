import axios from "axios";
import { Loader, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminProductPage() {

    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [isloading, setIsloading] = useState(true);

    useEffect(() => {
        if (isloading) {
            axios
                .get(import.meta.env.VITE_API_URL + "/api/products")
                .then((response) => {
                    setProducts(response.data);
                    setIsloading(false);
                });
        }
    }, [isloading]);

    return (
        <div className="w-full h-full bg-primary p-5">

            {isloading ? (
                <div className="w-full h-full flex items-center justify-center">
                    <Loader className="animate-spin text-accent" />
                </div>
            ) : (
                <div className="w-full overflow-x-auto">

                    <table className="w-full text-left border-collapse">

                        <thead>
                            <tr className="border-b border-accent/20 text-accent">

                                <th className="px-4 py-3 border">
                                    Image
                                </th>

                                <th className="px-4 py-3 border">
                                    Product ID
                                </th>

                                <th className="px-4 py-3 border">
                                    Name
                                </th>

                                <th className="px-4 py-3 border">
                                    Price
                                </th>

                                <th className="px-4 py-3 border">
                                    Labelled Price
                                </th>

                                <th className="px-4 py-3 border">
                                    Category
                                </th>

                                <th className="px-4 py-3 border">
                                    Quantity
                                </th>

                                <th className="px-4 py-3 border text-center">
                                    Actions
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {products.length > 0 ? (

                                products.map((item) => {

                                    return (
                                        <tr
                                            key={item.productID}
                                            className="border-b border-accent/10 hover:bg-accent/5"
                                        >

                                            {/* Image */}
                                            <td className="px-4 py-3 border">

                                                <div className="h-16 w-16 overflow-hidden rounded-lg border border-accent/10 bg-primary">

                                                    {item.images &&
                                                    item.images.length > 0 ? (

                                                        <img
                                                            src={item.images[0]}
                                                            alt={item.name}
                                                            className="h-full w-full object-cover"
                                                        />

                                                    ) : (

                                                        <div className="flex h-full w-full items-center justify-center text-accent/40">
                                                            No Image
                                                        </div>

                                                    )}

                                                </div>

                                            </td>


                                            {/* Product ID */}
                                            <td className="px-4 py-3 border text-accent">
                                                {item.productID}
                                            </td>


                                            {/* Name */}
                                            <td className="px-4 py-3 border text-accent font-medium">
                                                {item.name}
                                            </td>


                                            {/* Price */}
                                            <td className="px-4 py-3 border text-accent">
                                                Rs. {item.price}
                                            </td>


                                            {/* Labelled Price */}
                                            <td className="px-4 py-3 border text-accent">
                                                Rs. {item.labelledPrice}
                                            </td>


                                            {/* Category */}
                                            <td className="px-4 py-3 border text-accent">
                                                {item.category}
                                            </td>


                                            {/* Quantity */}
                                            <td className="px-4 py-3 border text-accent">
                                                {item.quantity}
                                            </td>


                                            {/* Actions */}
                                            <td className="px-4 py-3 border">

                                                <div className="flex items-center justify-center gap-2">

                                                    {/* Edit */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/update-product/${item.productID}`
                                                            )
                                                        }
                                                        className="p-2 rounded-lg text-accent hover:bg-accent/10"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>


                                                    {/* Delete */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            console.log(
                                                                "Delete product:",
                                                                item.productID
                                                            )
                                                        }
                                                        className="p-2 rounded-lg text-red-500 hover:bg-red-500/10"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    );

                                })

                            ) : (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="px-4 py-10 text-center text-accent/50"
                                    >
                                        No products found
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>
            )}

            <button 
                onClick={() => navigate('/admin/add-product')}
            >
                Add new product
            </button>

        </div>
    );
}

