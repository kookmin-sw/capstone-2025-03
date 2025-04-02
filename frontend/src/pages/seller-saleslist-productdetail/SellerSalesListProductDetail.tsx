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
import { useSellerProduct } from '@/src/hooks/useSellerProduct';
import ProductModel from '@/src/models/ProductModel';

export default function SellerSalesListProductDetail() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [sellerId, setSellerId] = useState<number>();

    const [sellerProduct, setSellerProduct] = useRecoilState(sellerProductState);
    const [, setShouldReload] = useRecoilState(shouldReloadSellerProductState)
    const { createProduct } = useProduct();
    const { loadProduct } = useSellerProduct(Number(sellerId));

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setSellerId(userData.id);
        }
    }, [sellerId, sellerProduct.price]);

    const isButtonValid = sellerProduct.price;

    const handlePriceChange = (newPrice: number | null) => {
        setSellerProduct(
            (prev) =>
                new ProductModel({
                    ...prev,
                    price: newPrice,
                    seller: sellerId,
                    salesStatus: 'available',
                    description: null,
                    uploadDate: new Date().toISOString(),
                }),
        );
    };

    const hanldeSellButtonClick = async () => {
        setIsLoading(true);

        try {
            await createProduct(sellerProduct);
            setShouldReload(true)
            setIsComplete(true);
            navigate('/seller-saleslist');
        } catch (error) {
            alert(`물건 등록 실패 : ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    return isLoading ? (
        isComplete ? (
            <CompleteSection text="판매 물품 업로드 완료!" />
        ) : (
            <LoadingSection text="잠시만 기다려주세요" />
        )
    ) : (
        <div className={styles.page}>
            <BackHeader />
            <div className={styles.section}>
                <p className={styles.title}>가격을 입력해주세요</p>

                <ProductItem product={sellerProduct} />
                <AiOptimizer />
                <PriceInput price={sellerProduct.price ?? null} setPrice={handlePriceChange} />
                <div className={styles.submitButtonSection}>
                    <button
                        className={styles.submitButton}
                        disabled={!isButtonValid}
                        onClick={hanldeSellButtonClick}
                    >
                        판매하기
                    </button>
                </div>
            </div>
        </div>
    );
}
