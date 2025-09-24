import React, { useEffect, useState } from "react";
import { getProductById, updateProduct } from "../api/productApi";
import toast from "react-hot-toast";
import AddProduct from "../components/AddProduct";
import { useParams } from "react-router-dom";
import ProductFormSkeleton from "../components/ProductFormSkeleton";

export default function ViewEditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getProductById(id);    
      setProduct(data);
    }
    load();
    console.log(localStorage.getItem("selectedCategoryId")+ localStorage.getItem("selectedCategoryName"))
  }, [id]);

  const handleSave = async (finalPayload) => {
    try {
      await updateProduct(product._id, finalPayload);
      toast.success("Product updated!");
      window.history.back()      
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update product");
    }
  };

  if (!product) {
    return <ProductFormSkeleton />;
  }

  return (
    <AddProduct
      mode="edit"
      initialData={product}
      onSave={handleSave}
      onCancel={() => window.history.back()}
    />
  );
}
