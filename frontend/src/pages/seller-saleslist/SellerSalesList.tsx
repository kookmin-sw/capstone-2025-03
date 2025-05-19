import styles from './SellerSalesList.module.css';
import MainHeader from '@/src/components/layout/MainHeader';
import Footer from '@/src/components/layout/MenuFooter';
import SellerProductItem from '@/src/components/ui/SellerProductItem';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useSellerProduct } from '@/src/hooks/useSellerProduct';
import ProductModel from '@/src/models/ProductModel';
import { Spinner } from '@chakra-ui/react';
import { useHeaderVisibility } from '@/src/hooks/useHeaderVisibility';
import SellerProductItemSkeleton from '@/src/components/ui/SellerProductItemSkeleton';
import WhenNoProducts from './components/WhenNoProducts';

export default function SellerSalesList() {
    // page connection
    const navigate = useNavigate();
    const isVisible = useHeaderVisibility();
    const sellerId = useMemo(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored).id : undefined;
    }, []);

    const { products, loadProduct, loadMore } = useSellerProduct(Number(sellerId));
    // useState
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
    // useRef
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const currentMenuIndex = 3;

    useEffect(() => {
        if (!sellerId) return;

        const fetchProducts = async () => {
            if (sellerId) {
                try {
                    await loadProduct();
                } catch (error) {
                    console.error('Error fetching products:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [sellerId]);

    useEffect(() => {
        if (!loadMoreRef.current || isLoadMoreLoading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsLoadMoreLoading(true);
                    loadMore().finally(() => setIsLoadMoreLoading(false));
                }
            },
            { threshold: 0 },
        );

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [loadMore, isLoadMoreLoading]);

    const handleClickAddProductButton = () => {
        navigate('/seller-saleslist-addproduct', {
            state: { reset: true },
        });
    };

    const handleProductItemClick = (product: ProductModel) => {
        navigate(`/package-detail-product-detail`, {
            state: { product: product.toJson(), reset: true },
        });
    };

    return (
        <div className={styles.page}>
            <MainHeader isVisible={isVisible} />

            {isLoading ? (
                // 스켈레톤 로딩
                <div className={styles.section}>
                    <div className={styles.productContainer}>
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <SellerProductItemSkeleton key={idx} />
                        ))}
                    </div>
                </div>
            ) : products.length === 0 ? (
                // 물건이 하나도 없으면 텅~
                <div className={styles.noProductsSection}>
                    <WhenNoProducts />
                    <div className={styles.buttonContainer}>
                        <button
                            className={styles.addProductButton}
                            onClick={handleClickAddProductButton}
                        >
                            +
                        </button>
                    </div>
                </div>
            ) : (
                // 물건이 있으면 기존 UI 보여줌
                <>
                    <div className={styles.section}>
                        <div className={styles.productContainer}>
                            <p className={styles.listViewTitle}>판매 중인 물품들</p>
                            {products.map((product: ProductModel, index: number) => (
                                <div key={index} onClick={() => handleProductItemClick(product)}>
                                    <SellerProductItem product={product} />
                                    <div style={{ borderBottom: '1px solid #2a2a2a' }}></div>
                                </div>
                            ))}
                        </div>
                        <div ref={loadMoreRef} style={{ height: '3px' }} />
                        {isLoadMoreLoading && (
                            <div className={styles.moreLoadSpinnerContainer}>
                                <Spinner
                                    color="#00A36C"
                                    borderWidth="0.4rem"
                                    animationDuration="0.8s"
                                    style={{ width: '4rem', height: '4rem' }}
                                />
                            </div>
                        )}
                    </div>
                    <div className={styles.buttonContainer}>
                        <button
                            className={styles.addProductButton}
                            onClick={handleClickAddProductButton}
                        >
                            +
                        </button>
                    </div>
                </>
            )}

            <Footer currentMenuIndex={currentMenuIndex} />
        </div>
    );
}
