import React, { useState, useEffect } from "react";
import { Search, Star } from "lucide-react";
import moment from "moment";
import { getAllReviews } from "../api/reviewApi";
import { getProductById } from "../api/productApi";
import { getUserById } from "../api/frontUserApi";
import { useNavigate } from "react-router-dom";

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleExpand = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };
  const userName = review.user?.name || "Anonymous";
  const userEmail = review.user?.email || "No email";

  const handleCardClick = () => {
    if (review?.product?.id) {
      navigate(`/reviews/${review.product.id}`);
    }
  };
  return (
    <div 
    onClick={handleCardClick}
    className="p-4 border border-gray-200 rounded-2xl bg-white flex flex-col gap-4 cursor-pointer hover:shadow-md transition">
      {/* Product Info */}
      <div className="flex items-center gap-4 border-b border-gray-200 pb-3">
        <img
          src={review.product.image}
          alt={review.product.name}
          className="w-16 h-16 rounded-md object-contain border border-gray-200"
        />
        <div>
        <h3 className="font-semibold">
  {review.product.name.length > 10
    ? review.product.name.slice(0, 10) + "..."
    : review.product.name}
</h3>

          <p className="text-xs text-gray-500">Product ID: {review.product.id}</p>
        </div>
      </div>

      {/* User Review */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Avatar */}
{/* Avatar */}
<div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold overflow-hidden">
{review.user?.image ? (
    <img
      src={review.user.image}
      alt={review.user.name}
      className="w-full h-full object-cover"
    />
  ) : (
    review.user?.name?.[0] || "U"
  )}
</div>


        {/* Review Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{userName}</h4>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
            <span className="text-xs text-gray-400">
              {moment(review.createdAt).format("MMM DD, YYYY")}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Comment */}
          <p className="mt-2 text-gray-700 text-sm">
            {expanded ? review.comment : review.comment.slice(0, 100)}
            {review.comment.length > 100 && (
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
  );
}

function ReviewPage() {
    const [reviews, setReviews] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchReviews = async () => {
          try {
            const { reviews } = await getAllReviews();
            // 1. Sort reviews (latest first)
            const sorted = reviews.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
      
            // 2. Deduplicate: keep only the latest review per product
            const seenProducts = new Set();
            const latestPerProduct = sorted.filter((rev) => {
              const productId = rev.product?._id;
              if (!productId) return false;
              if (seenProducts.has(productId)) return false;
              seenProducts.add(productId);
              return true;
            });
      
            // 3. Fetch product + user info for each review
            const reviewsWithDetails = await Promise.all(
              latestPerProduct.map(async (rev) => {
                let product, user;
                try {
                  product = await getProductById(rev.product._id);
                } catch {
                  product = {
                    _id: rev.product?._id || "unknown",
                    name: rev.product?.name || "Unknown Product",
                    images: [],
                  };
                }
      
                try {
                  user = await getUserById(rev.user._id); // rev.user contains userId
                } catch {
                  user = { user: { name: "Anonymous", email: "", profileUrl: "" } };
                }
      
                return {
                  ...rev,
                  product: {
                    id: product._id,
                    name: product.name,
                    image:
                      product.images?.[0] ||
                      "https://via.placeholder.com/100x100.png?text=No+Image",
                  },
                  user: {
                    name: user.user?.name || "Anonymous",
                    email: user.user?.email || "No email",
                    image: user.user?.profileUrl || "",
                  },
                };
              })
            );
      
            setReviews(reviewsWithDetails);
          } catch (error) {
            console.error("Failed to fetch reviews:", error);
          }
        };
      
        fetchReviews();
      }, []);
      
      
    
      // Filter reviews by search
      const filteredReviews = reviews.filter(
        (r) =>
          r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
          r.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
          r.comment?.toLowerCase().includes(search.toLowerCase())
      );


  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Reviews & Ratings</h2>

      {/* Search bar */}
      <div className="flex items-center w-full md:w-1/3 max-w-full rounded-full border border-gray-400 overflow-hidden">
        <input
          type="text"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 text-sm bg-white w-full focus:outline-none"
        />
        <button className="bg-black p-3 flex items-center justify-center text-white">
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredReviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>
    </div>
  );
}

export default ReviewPage;
