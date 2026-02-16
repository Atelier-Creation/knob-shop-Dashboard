import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getReviewsByProduct } from "../api/reviewApi";
import { getProductById } from "../api/productApi";
import { Search, Star, Trash } from "lucide-react";
import { getUserById } from "../api/frontUserApi";
import { useNavigate } from "react-router-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";

function ReviewDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate(); // Hook for navigation
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [gallery, setGallery] = useState({ isOpen: false, images: [], index: 0 });

  const toggleExpand = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const openGallery = (images, index) => {
    setGallery({ isOpen: true, images, index });
  };

  const closeGallery = () => {
    setGallery({ ...gallery, isOpen: false });
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setGallery((prev) => ({
      ...prev,
      index: (prev.index + 1) % prev.images.length,
    }));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setGallery((prev) => ({
      ...prev,
      index: (prev.index - 1 + prev.images.length) % prev.images.length,
    }));
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
        console.log("user data : ", reviewsWithUserDetails)
        const grouped = transformReviews(reviewsWithUserDetails);
        console.log("grouped data : ", grouped)
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
          reviewImages: r.image, // Include review images
          createdAt: r.createdAt,
          __v: r.__v,
        })),
      },
    ];
  };

  return (
    <div className="container my-4 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-semibold">Reviews & Ratings</h2>
      </div>
      {/* Product Details */}
      {/* Product Details */}
      {product && (
        <div className="flex flex-col md:flex-row mb-4 items-start md:items-center gap-4">
          <img
            src={
              product.images?.[0] ||
              "https://via.placeholder.com/150x150.png?text=No+Image"
            }
            alt={product.name}
            className="w-full md:w-40 h-40 rounded-md object-contain border border-gray-200"
          />
          <div className="flex-1">
            <h2><strong>Name :</strong> {product.name.slice(0, 100)}</h2>
            <p><strong>Product ID:</strong> {product.productId}</p>
            <p><strong>Brand :</strong> {product.brand}</p>
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

                  {/* Review Images */}
                  {u.reviewImages && u.reviewImages.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {u.reviewImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Review ${idx}`}
                          className="w-20 h-20 object-cover rounded-md border border-gray-200 cursor-pointer"
                          onClick={() => openGallery(u.reviewImages, idx)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      {/* Image Gallery Modal */}
      {gallery.isOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeGallery}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
            onClick={closeGallery}
          >
            <X size={32} />
          </button>

          <div
            className="relative max-w-4xl w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {gallery.images.length > 1 && (
              <button
                className="absolute left-2 md:left-4 text-white hover:bg-white/10 p-2 rounded-full transition"
                onClick={prevImage}
              >
                <ChevronLeft size={40} />
              </button>
            )}

            <img
              src={gallery.images[gallery.index]}
              alt={`Gallery ${gallery.index}`}
              className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
            />

            {gallery.images.length > 1 && (
              <button
                className="absolute right-2 md:right-4 text-white hover:bg-white/10 p-2 rounded-full transition"
                onClick={nextImage}
              >
                <ChevronRight size={40} />
              </button>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-1 rounded-full text-sm">
              {gallery.index + 1} / {gallery.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewDetailsPage;
