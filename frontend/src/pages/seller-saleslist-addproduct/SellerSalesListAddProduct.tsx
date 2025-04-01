import styles from './SellerSalesListAddProduct.module.css';
import BackButtonForAddProduct from './components/BackButtonForAddProduct';
import { sellerProductState } from '@/src/recoil/productState';
import { useRecoilState } from 'recoil';
import ProductModel from '@/src/models/ProductModel';
import { uploadProductImageInService } from '@/src/services/sellerProductService';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Spinner } from '@chakra-ui/react';
import BasicButton from './components/BasicButton';

export default function SellerSalesListAddProduct() {
    // hooks
    const [sellerProduct, setSellerProduct] = useRecoilState(sellerProductState);

    // route
    const navigate = useNavigate();
    const { state } = useLocation();

    const selectedCategoryId = sellerProduct.category;
    const selectedCategoryName = sellerProduct.categoryName;
    const prevPath = state?.prevPath;

    // useState
    const [defaultImageSrc, setDefaultImageSrc] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);

    // useRef
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // 버튼으로 grade 설정
    const gradeArr = ['중고', '새상품'];

    // 확인 버튼 활성화 조건
    const isButtonValid =
        !!sellerProduct?.images?.[0] &&
        !!sellerProduct.category &&
        !!sellerProduct.name &&
        !!sellerProduct.grade &&
        !!sellerProduct.quantity;

    const imageSrc = sellerProduct.images?.[0] || '/images/seller/empty_image.png';

    useEffect(() => {
        if (prevPath === '/seller-saleslist') {
            setSellerProduct(new ProductModel({}));
        }
    }, []);

    const handleAddImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            setIsUploading(true);

            try {
                const uploadedImageUrl = await uploadProductImageInService(file);

                if (uploadedImageUrl) {
                    setSellerProduct((prev) => {
                        if (!prev) return new ProductModel({ images: [uploadedImageUrl] });

                        return new ProductModel({
                            ...prev,
                            images: [...(prev.images || []), uploadedImageUrl],
                        });
                    });
                }
            } catch (error) {
                alert(`상품 이미지 업로드에 실패했습니다 : ${error}`);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleClickCategoryButton = () => {
        navigate('/seller-saleslist-addproduct-getcategory');
    };

    const handleClickConfirmButton = () => {
        setSellerProduct(
            (prev) =>
                new ProductModel({
                    ...prev,
                    category: selectedCategoryId,
                }),
        );
        navigate('/seller-saleslist-productdetail');
    };
    console.log(sellerProduct);
    return (
        <div className={styles.page}>
            <div className={styles.section}>
                <BackButtonForAddProduct />
                <p className={styles.title}>물품 판매하기</p>
                <button className={styles.imageButton} onClick={handleAddImage}>
                    <input
                        className={styles.imageInput}
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    {isUploading ? (
                        <Spinner
                            color="#00A36C"
                            borderWidth="0.3rem"
                            style={{ width: '3rem', height: '3rem' }}
                        />
                    ) : (
                        <>
                            <img
                                className={
                                    imageSrc !== '/images/seller/empty_image.png'
                                        ? styles.uploadedImage
                                        : styles.defaultImage
                                }
                                src={imageSrc}
                                width={
                                    imageSrc !== '/images/seller/empty_image.png' ? '100%' : '30px'
                                }
                            />
                            {imageSrc === '/images/seller/empty_image.png' ? (
                                <span>물품 이미지를 업로드해주세요</span>
                            ) : null}
                        </>
                    )}
                </button>
                <p className={styles.subtitle}>물품 정보</p>
                <form className={styles.formContainer} onSubmit={(e) => e.preventDefault()}>
                    <input
                        value={selectedCategoryName ?? ''}
                        className={styles.input}
                        placeholder="카테고리"
                        readOnly
                        onClick={handleClickCategoryButton}
                    />
                    <input
                        value={sellerProduct.name ?? ''}
                        className={styles.input}
                        placeholder="제품명"
                        onChange={(e) =>
                            setSellerProduct(
                                (prev) => new ProductModel({ ...prev, name: e.target.value }),
                            )
                        }
                    />
                    <input
                        value={sellerProduct.quantity ?? ''}
                        type="number"
                        className={styles.input}
                        placeholder="개수"
                        onChange={(e) => {
                            const value = e.target.value;
                            setSellerProduct(
                                (prev) => new ProductModel({ ...prev, quantity: Number(value) }),
                            );
                        }}
                        onWheel={(e) => e.currentTarget.blur()}
                        min={1}
                        onKeyDown={(e) => {
                            if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                                e.preventDefault();
                            }
                        }}
                    />
                    <div className={styles.buttonContainer}>
                        {gradeArr.map((element) => {
                            return (
                                <BasicButton
                                    key={element}
                                    isSelected={sellerProduct.grade === element}
                                    onClick={() =>
                                        setSellerProduct(
                                            (prev) => new ProductModel({ ...prev, grade: element }),
                                        )
                                    }
                                >
                                    {element}
                                </BasicButton>
                            );
                        })}
                    </div>
                </form>
                <div className={styles.submitButtonSection}>
                    <button
                        className={styles.submitButton}
                        disabled={!isButtonValid}
                        onClick={handleClickConfirmButton}
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}
