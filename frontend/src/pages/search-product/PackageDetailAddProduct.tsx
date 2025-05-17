import SearchHeader from '@/src/components/layout/SearchHeader';
import styles from './PackageDetailAddProduct.module.css';
import ProductItem from '@/src/components/ui/ProductItem';
import { useLocation, useNavigate } from 'react-router-dom';
import CategoryModel from '@/src/models/CategoryModel';
import { useProduct } from '@/src/hooks/useProduct';
import { useEffect, useState, useRef } from 'react';
import ProductModel from '@/src/models/ProductModel';
import { Spinner } from '@chakra-ui/react';
import ProductItemSkeleton from '@/src/components/ui/ProductItemSkeleton';

export default function PackageDetailAddProduct() {
    // page connection
    const navigate = useNavigate();
    const location = useLocation();
    const category: CategoryModel = CategoryModel.fromJson(location.state?.category || {});
    // hook
    const { productList, getProductList } = useProduct();
    // useState
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState<boolean>(false);
    // useRef
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // useEffect
    useEffect(() => {
        const fetchProducts = async () => {
            const filteredProductList = productList.filter(
                (product) => product.category === category.id,
            );
            if (filteredProductList.length < 5) {
                const newProducts = await getProductList(category.id);
                if (newProducts) setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);
    useEffect(() => {
        if (!loadMoreRef.current || isLoadMoreLoading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsLoadMoreLoading(true);
                    getProductList(category.id).finally(() => setIsLoadMoreLoading(false));
                }
            },
            { threshold: 0 },
        );

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [isLoadMoreLoading, isLoading]);

    // Function
    const handleProductItemClick = (product: ProductModel) => {
        navigate('/package-detail-product-detail', {
            state: { product: product.toJson() },
        });
    };


    return (
        <div className={styles.page}>
            <SearchHeader text={category.name || ''} />
            <div className={styles.section}>
                <div className={styles.listView}>
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, idx) => (
                            <div key={idx} className={styles.checkableProductItem}>
                                <ProductItemSkeleton />
                            </div>
                        ))
                        : productList
                            .filter((product) => product.category === category.id)
                            .map((product, index) => (
                                <div
                                    key={index}
                                    className={styles.checkableProductItem}
                                    onClick={() => handleProductItemClick(product)}
                                >
                                    <ProductItem product={product} />
                                    <div className={styles.blank} />
                                </div>
                            ))}
                </div>
                <div ref={loadMoreRef} style={{ height: '20px' }} />
                {isLoadMoreLoading && !isLoading && (
                    <div className={styles.spinnerContainer} style={{ height: '20rem' }}>
                        <Spinner
                            color="#00A36C"
                            borderWidth="0.6rem"
                            animationDuration="0.8s"
                            style={{ width: '6rem', height: '6rem' }}
                        />
                    </div>
                )}
                <div style={{ height: '100px' }} />
            </div>
        </div>
    );
}
