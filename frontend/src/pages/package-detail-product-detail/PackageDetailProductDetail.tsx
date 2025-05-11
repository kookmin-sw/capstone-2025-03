import BackHeaderForPackageDetail from './components/BackHeaderForPackageDetail';
import styles from './PackageDetailProductDetail.module.css';
import DefaultButton from '@/src/components/ui/DefaultButton';
import { useLocation } from 'react-router-dom';
import ProductModel from '@/src/models/ProductModel';
import React, { useState, useMemo } from 'react';
import CarouselImageViewer from './components/CarouselImageViewer';
import { useRef, useEffect } from 'react';
import ProductRecommend from './components/ProductRecommend';
import FavoriteNotFillIcon from '../../assets/images/page/wishlist/favorite_not_fill.png';
import FavoriteIcon from '../../assets/images/page/wishlist/favorite_fill.png';
import PackageSelectSheet from './components/PackageSelectSheet';
import { useCustomPackagesByUser } from '@/src/hooks/useCustomPackage';

export default function PackageDetailProductDetail() {
    // page connection
    const location = useLocation();
    const { state } = useLocation();
    const reset = state?.reset;
    const product: ProductModel = ProductModel.fromJson(location.state?.product || {});

    const [isPackageSelectSheetOpen, setIsPackageSelectSheetOpen] = useState<boolean>(false);

    const carouselRef = useRef<HTMLDivElement>(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    const { data: userPackages } = useCustomPackagesByUser(userId);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [product.id]);

    const isFavorite = useMemo(() => {
        if (!userPackages || !product?.id) return false;
        return userPackages.some((pkg) => pkg.products.some((p) => p.id === product.id));
    }, [userPackages, product]);

    // Function
    const handleButtonClick = () => {
        window.location.href = product.originUrl ?? 'https://naver.com';
    };

    const handleClickFavorite = () => {
        setIsPackageSelectSheetOpen(true);
    };

    const productIdList = useMemo(() => {
        return product.id ? [product.id] : [];
    }, [product.id]);

    return (
        <div className={styles.page}>
            <BackHeaderForPackageDetail targetRef={carouselRef} />
            <div className={styles.section}>
                <div ref={carouselRef}>
                    <CarouselImageViewer images={product.images} />
                </div>
                <div className={styles.nameAndLikeContainer}>
                    <p className={styles.product}>{product.name}</p>
                    <button
                        className={styles.likeButton}
                        style={{
                            backgroundImage: `url(${isFavorite ? FavoriteIcon : FavoriteNotFillIcon})`,
                        }}
                        onClick={handleClickFavorite}
                    />
                </div>
                <div className={styles.categoryAndGradeWrapper}>
                    <p
                        className={styles.category}
                        onClick={() => navitgate(`/category/${product.category}`)}
                    >
                        {product.categoryName}
                    </p>
                    <p className={styles.gradeAndAmount}>
                        {product.grade} ∙ {product.quantity}개
                    </p>
                </div>
                <p className={styles.price}>{product.price?.toLocaleString()}원</p>
                <div className={styles.descriptionContainer}>
                    {(product.description ?? '')
                        .replace(/\n+/g, '\n')
                        .split('\n')
                        .map((line, idx) => (
                            <React.Fragment key={idx}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                </div>
                <div className={styles.devider}></div>
                <ProductRecommend
                    categoryId={product.category}
                    productId={productIdList}
                    categoryName={product.categoryName}
                />
                <div style={{ height: '20rem' }} />
            </div>
            {!reset ? (
                <DefaultButton
                    event={handleButtonClick}
                    isActive={true}
                    text="원본 링크 이동하기"
                />
            ) : null}
            {isPackageSelectSheetOpen && (
                <PackageSelectSheet
                    productId={product.id}
                    category={product.category}
                    onClose={() => setIsPackageSelectSheetOpen(false)}
                    onSubmitSuccess={() => {
                        setIsPackageSelectSheetOpen(false);
                    }}
                />
            )}
        </div>
    );
}
