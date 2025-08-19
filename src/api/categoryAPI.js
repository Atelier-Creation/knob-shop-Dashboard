import axiosInstance from "./axiosInstance";

// Get all categories with product count
export const fetchCategories = () => {
  return axiosInstance.get("/api/categories");
};
// Get all category by id
export const getCategoryById = (categoryId) => {
  return axiosInstance.get(`/api/categories/${categoryId}`);
};

// Create a new category
export const createCategory = (categoryData) => {
  const token = localStorage.getItem("token"); // ✅ Get token from localStorage
  return axiosInstance.post("/api/categories", categoryData, {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ Send Bearer token properly
    },
  });
};

// Update an existing category
export const updateCategory = (categoryId, categoryData) => {
  return axiosInstance.put(`/api/categories/${categoryId}`, categoryData);
};
// Update an existing category
export const updateCategorySubpageType = (categoryId,subpageType) => {
  return axiosInstance.patch(`/api/categories/${categoryId}/subpage-type`,{subpageType});
};
// Delete a category
export const deleteCategory = (categoryId,) => {
  return axiosInstance.delete(`/api/categories/${categoryId}`);
}