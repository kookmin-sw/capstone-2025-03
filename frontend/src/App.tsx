import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import "./styles/global.css";
import routes from "./routes";

export default function App() {
  return (
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
  );
}