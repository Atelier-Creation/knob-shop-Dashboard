import { ProductCard } from "./ProductCard";

export default function ProductGrid({
  products,
  category,
  onProductClick,
  activeProduct,
}) {
  const filtered =
    category === "All Products"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <div
      className={`grid gap-4 ${
        activeProduct
          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
      }`}
    >
      {filtered.length > 0 ? (
        filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={onProductClick}
          />
        ))
      ) : (
        <div className="col-span-full text-center text-gray-400 py-10">
          No products found in this category.
        </div>
      )}
    </div>
  );
}
