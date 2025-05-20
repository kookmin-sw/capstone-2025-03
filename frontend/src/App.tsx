import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import './styles/global.css';
import routes from './routes';
import { UserProvider } from './contexts/UserContext';
import { CategoryProvider } from './contexts/CategoryContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RestartQR from './components/layout/qrcode/RestartQR';

const queryClient = new QueryClient();

export default function App() {
    return (
        <Router>
            <MainLayout />
        </Router>
    );
}


export function MainLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                <CategoryProvider>
                    <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Routes>
                                {routes.map(({ path, Component }) => (
                                    <Route key={path} path={path} element={<Component />} />
                                ))}
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </Suspense>
                        <RestartQR />
                    </div>
                </CategoryProvider>
            </UserProvider>
        </QueryClientProvider>
    );
}
