import ProductImageUploader from "../components/ProductImageUploader";
import ProductInfoForm from "../components/ProductInfoForm";

export const CategoryAndProductPage = () => {
  return (
    <>
      <div className="flex flex-col gap-6 justify-between">
        <div className="head">
          <p className="text-lg mb-5 text-gray-600 cursor-pointer">
          {" "}
          <span className="font-semibold text-lg text-gray-900">Categories & Products</span> /
          Create New Products
        </p>
        <h2 className="text-2xl font-semibold">Description</h2>
        </div>
          <div className="flex gap-4">
        <ProductInfoForm />
        <ProductImageUploader/>
        </div>
      </div>
    </>
  );
};
