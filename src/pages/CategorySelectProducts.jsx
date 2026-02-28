import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RxBookmark } from "react-icons/rx";
import { getAllProducts, getProductById, updateProduct } from "../api/productApi";
import SearchableProductDropdown from "../components/SearchableProductDropdown";
import toast from "react-hot-toast";

function CategorySelectProducts() {
    const navigate = useNavigate();
    const { id: categoryId } = useParams();

    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [initialSelected, setInitialSelected] = useState([]);
    const [selectedProductDetails, setSelectedProductDetails] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        const savedName = localStorage.getItem("selectedCategoryName");
        if (savedName) setCategoryName(savedName);
        fetchProducts();
        fetchCategoryProducts();
    }, [categoryId]);

    const fetchProducts = async () => {
        try {
            const data = await getAllProducts({ page: 1, limit: 1000 });
            setProducts(data.data || []);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        }
    };

    const fetchCategoryProducts = async () => {
        try {
            const { data } = await getAllProducts({ category: categoryId, page: 1, limit: 500 });
            const ids = (data || []).map(p => p._id);
            setSelectedProducts(ids);
            setInitialSelected(ids);
        } catch (err) {
            console.error("Failed to fetch category products:", err);
        }
    };

    useEffect(() => {
        const loadSelectedProductDetails = async () => {
            for (let id of selectedProducts) {
                if (!selectedProductDetails[id]) {
                    try {
                        const product = await getProductById(id);
                        setSelectedProductDetails((prev) => ({
                            ...prev,
                            [id]: product,
                        }));
                    } catch (err) {
                        console.error("Failed to fetch product details:", id, err);
                    }
                }
            }
        };
        loadSelectedProductDetails();
    }, [selectedProducts]);

    const handleSave = async () => {
        setIsSaving(true);
        const loadingToastId = toast.loading("Updating category for products...");

        try {
            const added = selectedProducts.filter(id => !initialSelected.includes(id));
            const removed = initialSelected.filter(id => !selectedProducts.includes(id));

            const updatePromises = [];

            added.forEach(id => {
                updatePromises.push(updateProduct(id, { category: categoryId }));
            });

            removed.forEach(id => {
                updatePromises.push(updateProduct(id, { category: null }));
            });

            await Promise.all(updatePromises);

            toast.success("Products updated successfully!", { id: loadingToastId });
            navigate("/categories-products/category");
        } catch (err) {
            console.error("Error saving products:", err);
            toast.error("Failed to update products.", { id: loadingToastId });
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemoveProduct = (id) => {
        setSelectedProducts(selectedProducts.filter((p) => p !== id));
    };

    return (
        <div className="pe-16 ps-8 py-6 space-y-6 font-inter text-sm text-[#1c1c1c]">
            <div className="flex items-center gap-1 p-4">
                <h2 className="text-lg font-semibold cursor-pointer text-gray-900">
                    Categories & Products / Select Products for <span className="text-gray-500">{categoryName}</span>
                </h2>
            </div>

            <div className="grid gap-4 my-6 bg-white border border-gray-200 p-6 rounded-md shadow-sm">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                    Select Existing Products to Assign to this Category
                </label>

                <SearchableProductDropdown
                    products={products}
                    multiple={true}
                    selectedProductIds={selectedProducts}
                    onSelectProduct={setSelectedProducts}
                />

                {selectedProducts.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {selectedProducts.map((id) => {
                            const product = selectedProductDetails[id] || products.find(p => p._id === id);

                            return (
                                <div
                                    key={id}
                                    className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-full px-4 py-1.5 text-sm"
                                >
                                    <div className="rounded-full bg-white overflow-hidden my-1 flex-shrink-0">
                                        <img
                                            src={product?.images?.[0] || "https://placehold.co/40x40?text=No+Img"}
                                            className="h-8 w-8 object-contain"
                                            alt=""
                                        />
                                    </div>
                                    <span>{product?.name || "Loading..."}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveProduct(id)}
                                        className="text-gray-500 hover:text-red-600 transition"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="flex gap-4 mt-6">
                <Link
                    to={"/categories-products/category"}
                    className="px-6 py-2 text-sm bg-white border border-black text-black rounded flex items-center justify-center gap-2"
                >
                    <X className="inline" size={18} /> Cancel
                </Link>

                <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleSave}
                    className="px-6 py-2 text-sm bg-black text-white rounded flex items-center justify-center gap-2"
                >
                    <RxBookmark className="inline" size={18} /> {isSaving ? "Saving..." : "Save Products"}
                </button>
            </div>
        </div>
    );
}

export default CategorySelectProducts;
