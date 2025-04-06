import styles from './SellerSalesList.module.css';
import MainHeader from '@/src/components/layout/MainHeader';
import Footer from '@/src/components/layout/MenuFooter';
import SellerProductItem from '@/src/components/ui/SellerProductItem';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useSellerProduct } from '@/src/hooks/useSellerProduct';
import ProductModel from '@/src/models/ProductModel';
import { Spinner } from '@chakra-ui/react';

export default function SellerSalesList() {
    // page connection
    const navigate = useNavigate();

    const sellerId = useMemo(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored).id : undefined;
    }, []);

    const { products, loadProduct, loadMore } = useSellerProduct(Number(sellerId));
    // useState
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
    // useRef
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const lastScrollY = useRef(0);

    const currentMenuIndex = 1;

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
                // 아래로 스크롤 중 && 일정 이상 스크롤했을 때
                setIsHeaderVisible(false);
            } else {
                // 위로 스크롤 중
                setIsHeaderVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

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
    }, [sellerId, loadProduct]);

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
        navigate('/package-detail-product-detail', {
            state: { product: product.toJson() },
        });
    };

    return (
        <div className={styles.page}>
            {isHeaderVisible && <MainHeader />}
            <div className={styles.section}>
                <p className={styles.listViewTitle}>판매 중인 물품들</p>
                <div>
                    {isLoading ? (
                        <div className={styles.spinnerContainer}>
                            <Spinner
                                color="#00A36C"
                                borderWidth="0.6rem"
                                animationDuration="0.8s"
                                style={{ width: '6rem', height: '6rem' }}
                            />
                        </div>
                    ) : (
                        products.map((products: ProductModel, index: number) => {
                            return (
                                <div key={index} onClick={() => handleProductItemClick(products)}>
                                    <SellerProductItem product={products} />
                                </div>
                            );
                        })
                    )}
                </div>
                {!isLoading && <div ref={loadMoreRef} style={{ height: '20px' }} />}
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
            <button className={styles.addProductButton} onClick={handleClickAddProductButton}>
                +
            </button>
            <div className={styles.footerBar}>
                <Footer currentMenuIndex={currentMenuIndex} />
            </div>
        </div>
    );
}
