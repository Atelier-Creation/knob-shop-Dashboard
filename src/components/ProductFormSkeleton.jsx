import React from "react";

function SkeletonBox({ className }) {
  return React.createElement("div", {
    className: `animate-pulse bg-gray-200 rounded ${className}`,
  });
}

export default function ProductFormSkeleton() {
  return (
    <div className="p-8 space-y-6 cursor-wait">
      {/* Title */}
      {SkeletonBox({ className: "h-6 w-2/3" })}

      {/* Name and Brand */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SkeletonBox({ className: "h-10 w-full" })}
        {SkeletonBox({ className: "h-10 w-full" })}
      </div>

      {/* Product ID */}
      {SkeletonBox({ className: "h-10 w-1/2" })}

      {/* Dimensions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["h-10", "h-10", "h-10", "h-10"].map((h, i) =>
          SkeletonBox({ className: `${h} w-full`, key: i })
        )}
      </div>

      {/* Color Variants */}
      {SkeletonBox({ className: "h-64 w-full" })}

      {/* Video URL & Preview */}
      {SkeletonBox({ className: "h-10 w-full" })}
      {SkeletonBox({ className: "h-48 w-full md:w-2/3" })}

      {/* Features */}
      <div className="space-y-3">
        {SkeletonBox({ className: "h-10 w-1/2" })}
        <div className="grid grid-cols-2 gap-2">
          {SkeletonBox({ className: "h-12 w-full" })}
          {SkeletonBox({ className: "h-12 w-full" })}
        </div>
      </div>

      {/* Description */}
      {SkeletonBox({ className: "h-28 w-full" })}

      {/* Brochure */}
      {SkeletonBox({ className: "h-10 w-1/2" })}
      {SkeletonBox({ className: "h-[400px] w-[400px]" })}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end mt-4">
        {SkeletonBox({ className: "h-10 w-32" })}
        {SkeletonBox({ className: "h-10 w-32" })}
      </div>
    </div>
  );
}
