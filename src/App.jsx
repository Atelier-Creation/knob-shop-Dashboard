import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DevelopmentOnProcess from "./pages/DevelopentOnprocess";
import Layout from "./Layout";
import { CategoryAndProductPage } from "./pages/CategoryAndProductPage";
import ProductManager from "./pages/ProductManager";
import CategoryManager from "./pages/CategoryManager";
import AddProduct from "./components/AddProduct";
import ProductStatusTable from "./pages/ProductStatusTable";
import AdsDashboard from "./pages/AdsDashboard";
import CreateNewAd from "./components/CreateNewAd";
import DealsOverview from "./pages/DealsOverview";
import CreateDealForm from "./components/CreateDealForm";
import ProductDashboard from "./pages/ProductDashboard";
import OrderListDashboard from "./pages/OrderListDashboard";
import ProductDetailsView from "./components/productStock/ProductDetailsView";
import { ReportsAnalytics } from "./pages/ReportsAnalytics";
import OrderDetailsView from "./components/OrderDetailsView";
import PolicyEditorPage from "./pages/PolicyEditorPage";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import Brochuer from "./components/Brochure/Brochure";
import BroucherList from "./components/Brochure/BroucherList";
import "bootstrap-icons/font/bootstrap-icons.css";
import ViewEditProduct from "./pages/ViewEditProduct";
import LockScreen from "./pages/LockScreen";
import CustomerList from "./pages/CustomerList";
import CreateCouponPage from "./components/CreateCouponPage";
import ReviewPage from "./components/ReviewPage";
import ReviewDetailsPage from "./components/reviewDetailsPage";
import ProfilePage from "./components/ProfileModal";
import Essentials from "./pages/Essentials";
import ShelfManager from "./pages/ShelfManager";
import EssentialAddProduct from "./components/EssentialAddProduct/EssentialAddProduct";
import Invoice from "./components/Invoice/Invoice";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <>
      <Toaster position="bottom-center" />
      <Router>
        {/* <InactivityHandler /> */}
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/lockscreen" element={<LockScreen />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route
              path="categories-products/hidden"
              element={<CategoryAndProductPage />}
            />
            <Route path="/brochure/add" element={<Brochuer />} />
            <Route path="/brochure/list" element={<BroucherList />} />
            <Route
              path="categories-products/category/:id"
              element={<AddProduct />}
            />
            <Route
              path="categories-products/product-list"
              element={<ProductManager />}
            />
            <Route
              path="/search"
              element={<ProductManager />}
            />
            <Route path="/products/:id/edit" element={<ViewEditProduct />} />
            <Route
              path="categories-products/category"
              element={<CategoryManager />}
            />
            {/* <Route
              path="categories-products/product-status"
              element={<ProductStatusTable />}
            /> */}
            <Route path="homepage-ads" element={<ShelfManager />} />
            <Route path="homepage-ads/create" element={<CreateNewAd />} />
            <Route path="deals-discounts" element={<DealsOverview />} />
            <Route path="edit-essential" element={<Essentials />} />
            {/* <Route path="deals-discounts/create" element={<CreateDealForm />} /> */}
            <Route path="deals-discounts/create" element={<CreateCouponPage />} />
            <Route path="product-stock" element={<ProductDashboard />} />
            <Route path="product-stock/:id" element={<ProductDetailsView />} />
            <Route path="reports-analytics" element={<ReportsAnalytics />} />
            <Route
              path="orders-customers/order-list"
              element={<OrderListDashboard />}
            />
            <Route
              path="orders-customers/customer-list"
              element={<CustomerList/>}
            />
            <Route
              path="reviews-ratings"
              element={<ReviewPage/>}
            />
            <Route
              path="reviews/:productId"
              element={<ReviewDetailsPage/>}
            />
            <Route
              path="orders-customers/order-list/:id"
              element={<OrderDetailsView />}
            />
            <Route
              path="/essential/add-product"
              element={<EssentialAddProduct/>}
            />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="policy-edit" element={<PolicyEditorPage />} />
            <Route path="*" element={<DevelopmentOnProcess />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
