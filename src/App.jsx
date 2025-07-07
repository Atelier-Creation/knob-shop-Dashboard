// App.jsx
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DevelopmentOnProcess from "./pages/DevelopentOnprocess";
import Layout from "./Layout";
import { CategoryAndProductPage } from "./pages/CategoryAndProductPage";
import ProductManager from "./pages/ProductManager";
import CategoryManager from "./pages/CategoryManager";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/categories-products/add" element={<CategoryAndProductPage/>} />
          <Route path="/categories-products/product-list" element={<ProductManager/>} />
          <Route path="/categories-products/category" element={<CategoryManager/>} />
          <Route path="*" element={<DevelopmentOnProcess />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
