import "./App.css";
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
import ProtectedRoute from "./components/Auth/ProtectedRoute"; // 👈 Add this
import AuthPage from "./pages/AuthPage"; // 👈 Your login page
import Brochuer from "./components/Brochure/Brochure";
import BroucherList from "./components/Brochure/BroucherList";
import "bootstrap-icons/font/bootstrap-icons.css";
import ViewEditProduct from "./pages/ViewEditProduct";
import LockScreen from "./pages/LockScreen";

function App() {

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
                <Layout />
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
            <Route path="/products/:id/edit" element={<ViewEditProduct />} />
            <Route
              path="categories-products/category"
              element={<CategoryManager />}
            />
            <Route
              path="categories-products/product-status"
              element={<ProductStatusTable />}
            />
            <Route path="homepage-ads" element={<AdsDashboard />} />
            <Route path="homepage-ads/create" element={<CreateNewAd />} />
            <Route path="deals-discounts" element={<DealsOverview />} />
            <Route path="deals-discounts/create" element={<CreateDealForm />} />
            <Route path="product-stock" element={<ProductDashboard />} />
            <Route path="product-stock/:id" element={<ProductDetailsView />} />
            <Route path="reports-analytics" element={<ReportsAnalytics />} />
            <Route
              path="orders-customers/order-list"
              element={<OrderListDashboard />}
            />
            <Route
              path="orders-customers/order-list/:id"
              element={<OrderDetailsView />}
            />
            <Route path="policy-edit" element={<PolicyEditorPage />} />
            <Route path="*" element={<DevelopmentOnProcess />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
