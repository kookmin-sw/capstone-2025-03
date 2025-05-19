import SearchHeader from '@/src/components/layout/SearchHeader';
import styles from './PackageDetailAddProduct.module.css';
import DefaultButton from '@/src/components/ui/DefaultButton';
import ProductItem from '@/src/components/ui/ProductItem';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckIconImage from '@/src/assets/images/section/check.png';
import CategoryModel from '@/src/models/CategoryModel';
import { useProduct } from '@/src/hooks/useProduct';
import { useEffect, useState, useRef } from 'react';
import ProductModel from '@/src/models/ProductModel';
import { useRecoilState } from 'recoil';
import { editingPackageState } from '@/src/recoil/packageState';
import PackageModel from '@/src/models/PackageModel';
import { Spinner } from '@chakra-ui/react';
import ProductItemSkeleton from '@/src/components/ui/ProductItemSkeleton';
import Joyride from 'react-joyride';
import {
    PackageDetailAddProductSteps,
    joyrideLocale,
    joyrideStyles,
} from '@/src/components/ui/ToolTipContents';

export default function PackageDetailAddProduct() {
    // page connection
    const navigate = useNavigate();
    const location = useLocation();
    const category: CategoryModel = CategoryModel.fromJson(location.state?.category || {});
    // hook
    const { productList, setProductList, getProductList } = useProduct();
    // recoil
    const [editingPackage, setEditingPackage] = useRecoilState(editingPackageState);
    // useState
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState<boolean>(false);
    const [checkedProductIds, setCheckedProductIds] = useState<number[]>([]);
    // 툴팁 용도
    const [run, setRun] = useState<boolean>(false);
    const [isReady, setIsReady] = useState<boolean>(false);

    // useRef
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // useEffect

    // 툴팁 용
    const LOCAL_STORAGE_KEY = 'packageDetail_addProduct_tooltip_shown';

    // 개발 중일때
    // localStorage.removeItem('packageDetail_addProduct_tooltip_shown');
    useEffect(() => {
        const alreadyShown = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (!alreadyShown) {
            const timer = setTimeout(() => {
                setIsReady(true);
                setRun(true);
                localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
            }, 300);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            const filteredProductList = productList.filter(
                (product) => product.category === category.id,
            );
            // 패키지에 담긴 것들 productList에 먼저 추가
            const targetProductIds =
                editingPackage?.products
                    .filter((product) => product.category === category.id)
                    .map((item) => item.id) ?? [];
            // 현재 로드된 ID 목록
            const loadedIds = new Set(productList.map((product) => product.id));
            // 아직 로드되지 않은 ID만 필터링
            const missingIds = targetProductIds.filter((id) => !loadedIds.has(id));
            // missingIds만 추가
            setProductList([
                ...productList,
                ...(editingPackage?.products.filter((product) => missingIds.includes(product.id)) ??
                    []),
            ]);

            // initial product list read
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
        setCheckedProductIds(
            productList
                .filter((product) =>
                    (editingPackage?.products.map((product) => product.id) || []).includes(
                        product.id!,
                    ),
                )
                .map((product) => product.id!),
        );
    }, [productList]);

    useEffect(() => {
        if (!loadMoreRef.current || isLoadMoreLoading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && productList.length > 0) {
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
    const handleCheckButtonClick = (productId: number) => {
        setCheckedProductIds((prev) =>
            prev.includes(productId)
                ? prev.filter((item) => item !== productId)
                : [...prev, productId],
        );
    };
    const handleConfirmButtonClick = () => {
        if (!editingPackage) return;

        const existingProducts = editingPackage.products;
        const selectedProducts = productList.filter((product) =>
            checkedProductIds.includes(product.id!),
        );

        // ID 기준 중복 제거: 기존 상품 ID를 Set으로 저장
        const existingIds = new Set(existingProducts.map((p) => p.id));

        // 중복되지 않은 새 상품만 필터링
        const uniqueNewProducts = selectedProducts.filter((p) => !existingIds.has(p.id));

        // 새로운 프로덕트들
        const newProducts = [...existingProducts, ...uniqueNewProducts];

        // 같은 카테고리지만 선택되지 않은 product들 삭제
        const filteredProducts = newProducts.filter(
            (product) =>
                product.category !== category.id || checkedProductIds.includes(product.id!),
        );

        const updatedPackage = PackageModel.fromJson({
            ...editingPackage.toJson(),
            products: filteredProducts,
        });

        setEditingPackage(updatedPackage);
        navigate(-1);
    };

    return (
        <div id="introduce" className={styles.page}>
            <Joyride
                steps={PackageDetailAddProductSteps}
                run={run}
                continuous
                disableScrolling
                showSkipButton
                showProgress={false}
                locale={joyrideLocale}
                styles={joyrideStyles}
            />
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
                              .map((item, index) => {
                                  const isActive = checkedProductIds.includes(item.id!);

                                  return (
                                      <div
                                          key={index}
                                          className={styles.checkableProductItem}
                                          onClick={() => handleProductItemClick(item)}
                                      >
                                          <ProductItem product={item} />
                                          <div className={styles.blank} />
                                          <img
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleCheckButtonClick(item.id!);
                                              }}
                                              className={styles.checkIcon}
                                              src={CheckIconImage}
                                              style={{
                                                  opacity: isActive ? '1' : '0.5',
                                              }}
                                          />
                                      </div>
                                  );
                              })}
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
            <DefaultButton
                event={handleConfirmButtonClick}
                isActive={true}
                text={`선택한 ${category.name} 넣기`}
            />
        </div>
    );
}
