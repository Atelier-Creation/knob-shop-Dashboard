import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getReviewsByProduct } from "../api/reviewApi";
import { getProductById } from "../api/productApi";
import { Search, Star, Trash } from "lucide-react";
import { getUserById } from "../api/frontUserApi";
import moment from "moment";
function ReviewDetailsPage() {
  const { productId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetch product details
        const productData = await getProductById(productId);
        setProduct(productData);

        // ✅ Fetch reviews for product
        const data = await getReviewsByProduct(productId);
                // Fetch full user details for each review
                const reviewsWithUserDetails = await Promise.all(
                    data.reviews.map(async (r) => {
                      const userDetails = await getUserById(r.user._id);
                      return {
                        ...r,
                        user: userDetails.user || r.user,
                      };
                    })
                  );
                  console.log("user data : ",reviewsWithUserDetails)
        const grouped = transformReviews(reviewsWithUserDetails);
        console.log("grouped data : ",grouped)
        setReviews(grouped);
      } catch (error) {
        console.error("Error fetching product/reviews:", error);
      }
    };

    if (productId) fetchData();
  }, [productId]);

  // Group reviews by product (not strictly necessary anymore)
  const transformReviews = (reviews) => {
    if (!reviews || reviews.length === 0) return [];
    return [
      {
        _id: reviews[0].product,
        product: reviews[0].product,
        user: reviews.map((r) => ({
          _id: r.user._id,
          name: r.user.name,
          email: r.user.email,
          rating: r.rating,
          comment: r.comment,
          image: r.user.profileUrl,
          createdAt: r.createdAt,
          __v: r.__v,
        })),
      },
    ];
  };

  return (
    <div className="container my-4 space-y-6">
    <h2 className="text-xl font-semibold">Reviews & Ratings</h2>
      {/* Product Details */}
      {product && (
        <div className="row mb-4 align-items-center">
          <div className="col-md-4 mb-3 mb-md-0 flex items-center gap-4">
            <img
              src={
                product.images?.[0] ||
                "https://via.placeholder.com/150x150.png?text=No+Image"
              }
              alt={product.name}
              className="w-40 h-40 rounded-md object-contain border border-gray-200"
            />
            <div className="col-md-8">
            <h2><strong>Name :</strong>{product.name.slice(0,100)}</h2>
            <p><strong>Product ID:</strong> {product.productId}</p>
            <p><strong>Brand :</strong> {product.brand}</p>
            <p><strong>Description :</strong> {product.description.slice(0,200)}</p>
          </div>
          </div>
        </div>
      )}

<h2 className="text-xl font-semibold">Customer Reviews</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {reviews.length > 0 ? (
    // Flatten reviews array
    reviews.flatMap((group) => group.user).map((u) => (
      <div key={u._id} className="card mb-3">
        <div className="card-body flex flex-col md:flex-row gap-4 p-4 border rounded-2xl border-gray-200 bg-white">
          <div className="flex items-center mb-2">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold overflow-hidden">
              {u.image ? (
                <img src={u.image} alt={u.name} className="w-full h-full object-cover border-gray-200 border" />
              ) : (
                u.name?.[0] || "U"
              )}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{u.name}</h4>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
              <span className="text-xs text-gray-400">
                {moment(u.createdAt).format("MMM DD, YYYY")}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < u.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                />
              ))}
            </div>

            {/* Comment */}
            <p className="mt-2 text-gray-700 text-sm">
              {expanded ? u.comment : u.comment.slice(0, 100)}
              {u.comment.length > 100 && (
                <button
                  onClick={toggleExpand}
                  className="ml-2 text-blue-600 text-xs font-medium hover:underline"
                >
                  {expanded ? "View Less" : "View More"}
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p>No reviews yet.</p>
  )}
</div>

    </div>
  );
}

export default ReviewDetailsPage;
