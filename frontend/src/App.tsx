import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import './styles/global.css';
import routes from './routes';
import { UserProvider } from './contexts/UserContext';
import { CategoryProvider } from './contexts/CategoryContext';
import { SellerProductProvider } from './contexts/SellerProductContext';

export default function App() {
    return (
        <Router>
            <MainLayout />
        </Router>
    );
}

export function MainLayout() {
    const navigate = useNavigate();
    const isLogin = localStorage.getItem('user');

    useEffect(() => {
        const excludePaths = ['/name-and-birth-day-input', '/address-input', '/address-search'];
        if (!isLogin && !excludePaths.includes(window.location.pathname)) {
            navigate('/main');
        }
    }, []);

    return (
        <UserProvider>
            <CategoryProvider>
                <SellerProductProvider>
                            <Suspense fallback={<div>Loading...</div>}>
                                <Routes>
                                    {routes.map(({ path, Component }) => (
                                        <Route key={path} path={path} element={<Component />} />
                                    ))}
                                    <Route path="*" element={<Navigate to="/" />} />
                                </Routes>
                            </Suspense>
                </SellerProductProvider>
            </CategoryProvider>
        </UserProvider>
    );
}