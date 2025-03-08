import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense } from "react";
import "./styles/global.css";
import routes from "./routes";
import { UserProvider } from "./contexts/UserContext";
import { ProductProvider } from "./contexts/ProductContext";
import { CategoryProvider } from "./contexts/CategoryContext";

export default function App() {
  return (
    <UserProvider>
      <CategoryProvider>
        <ProductProvider>
          <Router>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                {routes.map(({ path, Component }) => (
                  <Route key={path} path={path} element={<Component />} />
                ))}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </Router>
        </ProductProvider>
      </CategoryProvider>
    </UserProvider>
  );
}
