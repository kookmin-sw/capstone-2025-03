import styles from './SellerSalesList.module.css';
import MainHeader from '@/src/components/layout/MainHeader';
import Footer from '@/src/components/layout/MenuFooter';
import SellerProductItem from '@/src/components/ui/SellerProductItem';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useSellerProduct } from '@/src/hooks/useSellerProduct';
import SellerProductModel from '@/src/models/SellerProductModel';
import LoadingSection from '@/src/components/layout/LoadingSection';
import { Spinner } from '@chakra-ui/react';

export default function SellerSalesList() {
    const navigate = useNavigate();
    const location = useLocation();

    const [sellerId, setSellerId] = useState<number>();
    const { products, loadProduct, loadMore } = useSellerProduct(Number(sellerId));

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);

    const currentMenuIndex = 1;

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setSellerId(userData.id);
        }
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
    }, [sellerId]);

    useEffect(() => {
        if (!loadMoreRef.current || isLoadMoreLoading) return;
        console.log(isLoadMoreLoading);
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsLoadMoreLoading(true);
                    loadMore().finally(() => setIsLoadMoreLoading(false));
                }
            },
            { threshold: 0 }
        );

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [loadMore, isLoadMoreLoading]);

    const handleClickAddProductButton = () => {
        navigate('/seller-saleslist-addproduct', {
            state: { prevPath: location.pathname },
        });
    };

    return (
        <div className={styles.page}>
            <MainHeader />
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
                        products.map((products: SellerProductModel, index: number) => {
                            return <SellerProductItem key={index} product={products} />;
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
