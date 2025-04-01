import BackHeader from '@/src/components/layout/BackHeader';
import styles from './PackageDetailProductDetail.module.css';
import DefaultButton from '@/src/components/ui/DefaultButton';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductModel from '@/src/models/ProductModel';
import { useCategory } from '@/src/hooks/useCategory';

export default function PackageDetailProductDetail() {
    // page connection
    const navitgate = useNavigate();
    const location = useLocation();
    const product: ProductModel = ProductModel.fromJson(location.state?.product || {});
    // hook
    const { categories } = useCategory();

    // Function
    const handleButtonClick = () => {
        window.location.href = product.originUrl ?? 'https://naver.com';
    };

    return (
        <div className={styles.page}>
            <BackHeader />
            <div className={styles.section}>
                <img className={styles.thumbnail} src={product.images[0]} />
                <p className={styles.category}>
                    {categories.find((category) => category.id === product.category)?.name}
                </p>
                <p className={styles.product}>{product.name}</p>
                <p className={styles.gradeAndAmount}>
                    {product.grade}등급 ∙ {product.quantity}개
                </p>
                <p className={styles.price}>{product.price}원</p>
                <div style={{ height: '20rem' }} />
            </div>
            <DefaultButton event={handleButtonClick} isActive={true} text="원본 링크 이동하기" />
        </div>
    );  
}
