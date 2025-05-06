import BackHeaderForPackageDetail from './components/BackHeaderForPackageDetail';
import styles from './PackageDetailProductDetail.module.css';
import DefaultButton from '@/src/components/ui/DefaultButton';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductModel from '@/src/models/ProductModel';
import { useCategory } from '@/src/hooks/useCategory';
import CarouselImageViewer from './components/CarouselImageViewer';
import { useRef } from 'react';

export default function PackageDetailProductDetail() {
    // page connection
    const navitgate = useNavigate();
    const location = useLocation();
    const product: ProductModel = ProductModel.fromJson(location.state?.product || {});

    const carouselRef = useRef<HTMLDivElement>(null);

    // hook
    const { categories } = useCategory();

    // Function
    const handleButtonClick = () => {
        window.location.href = product.originUrl ?? 'https://naver.com';
    };
    console.log(product);
    return (
        <div className={styles.page}>
            <BackHeaderForPackageDetail targetRef={carouselRef} />
            <div className={styles.section}>
                <div ref={carouselRef}>
                    <CarouselImageViewer images={product.images} />
                </div>
                <p className={styles.product}>{product.name}</p>
                <div className={styles.categoryAndGradeWrapper}>
                    <p className={styles.category}>
                        {categories.find((category) => category.id === product.category)?.name}
                    </p>
                    <p className={styles.gradeAndAmount}>
                        {product.grade} ∙ {product.quantity}개
                    </p>
                </div>
                <p className={styles.price}>{product.price?.toLocaleString()}원</p>
                <div style={{ height: '20rem' }} />
            </div>
            <DefaultButton event={handleButtonClick} isActive={true} text="원본 링크 이동하기" />
        </div>
    );
}
