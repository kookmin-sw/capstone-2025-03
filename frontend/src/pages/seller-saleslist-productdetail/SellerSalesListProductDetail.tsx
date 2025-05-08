import styles from './SellerSalesListProductDetail.module.css';
import BackHeader from '@/src/components/layout/BackHeader';
import ProductItem from '@/src/components/ui/ProductItem';
import AiOptimizer from './components/AiOptimizer';
import PriceInput from './components/PriceInput';
import CompleteSection from '@/src/components/layout/CompleteSection';
import LoadingSection from '@/src/components/layout/LoadingSection';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { sellerProductState, shouldReloadSellerProductState } from '@/src/recoil/productState';
import { useRecoilState } from 'recoil';
import { useProduct } from '@/src/hooks/useProduct';

export default function SellerSalesListProductDetail() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [sellerId, setSellerId] = useState<number>();

    const [sellerProduct, setSellerProduct] = useRecoilState(sellerProductState);
    const [, setShouldReload] = useRecoilState(shouldReloadSellerProductState);
    const { createProduct } = useProduct();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setSellerId(userData.id);
        }
    }, []);

    const isButtonValid = sellerProduct.price;

    const handlePriceChange = (newPrice: number | null) => {
        setSellerProduct((prev) =>
            prev.copyWith({
                ...prev,
                price: newPrice,
                seller: sellerId,
                salesStatus: 'available',
                uploadDate: new Date().toISOString(),
            }),
        );
    };

    const handleSellButtonClick = async () => {
        setIsLoading(true);

        try {
            await createProduct(sellerProduct);
            setShouldReload(true);
            setIsComplete(true);
            setTimeout(() => {
                navigate('/seller-saleslist');
            }, 2000);
        } catch (error) {
            alert(`물건 등록 실패 : ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (isComplete) return <CompleteSection text="판매 물품 업로드 완료!" />;
    if (isLoading) return <LoadingSection text="잠시만 기다려주세요" />;

    return (
        <div className={styles.page}>
            <BackHeader />
            <div className={styles.section}>
                <p className={styles.title}>가격을 입력해주세요</p>

                <ProductItem product={sellerProduct} />
                <AiOptimizer />
                <PriceInput price={sellerProduct.price ?? null} setPrice={handlePriceChange} />

            </div>
            <div className={styles.submitButtonSection}>
                <button
                    className={styles.submitButton}
                    disabled={!isButtonValid}
                    onClick={handleSellButtonClick}
                >
                    판매하기
                </button>
            </div>
        </div>
    );
}
