import { Check, DraftingCompass, Save } from "lucide-react";
import ProductDetailsForm from "../components/ProductDetailsForm";
import ProductImageUploader from "../components/ProductImageUploader";
import ProductInfoForm from "../components/ProductInfoForm";

export const CategoryAndProductPage = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      
      <div className="head">
        <p className="text-lg mb-5 text-gray-600 cursor-pointer">
          <span className="font-semibold text-lg text-gray-900">
            Categories & Products
          </span>{" "}
          / Create New Products
        </p>
        </div>
        <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">Description</h2>
      
      <div className="md:flex gap-2 hidden">
        <button className="bg-black text-white cursor-pointer px-3 py-2 rounded-sm text-xs md:text-sm "> <Save className="inline-block" size={16}/> Save Draft</button>
        <button className="border border-gray-800 text-black cursor-pointer px-3 py-2 rounded-sm text-xs md:text-sm"> <Check className="inline-block"size={16}/> Add Product</button>
      </div>
      </div>

      {/* Forms Grid */}
      <div className="flex flex-col md:flex-row gap-4">
        <ProductInfoForm />
        {/* Optional: Uncomment if needed */}
        {/* <ProductImageUploader /> */}
        <ProductDetailsForm />
        <div className="md:hidden gap-2 flex justify-center mt-4">
        <button className="bg-black text-white cursor-pointer px-2 py-2 rounded-sm text-sm md:text-sm w-1/2 "> <Save className="inline-block" size={22}/> Save Draft</button>
        <button className="border border-gray-800 text-black cursor-pointer px-2 py-2 rounded-sm text-sm md:text-sm w-1/2"> <Check className="inline-block"size={22}/> Add Product</button>
      </div>
      </div>
    </div>
  );
};
