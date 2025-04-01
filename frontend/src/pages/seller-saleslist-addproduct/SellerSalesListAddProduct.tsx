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
    const [sellerProduct, setSellerProduct] = useRecoilState(sellerProductState);

    const navigate = useNavigate();

    const { state } = useLocation();
    const selectedCategoryId = sellerProduct.category;
    const selectedCategoryName = sellerProduct.categoryName;
    const prevPath = state?.prevPath;

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [name, setName] = useState<string>('');
    const [grade, setGrade] = useState<string>('');
    const [number, setNumber] = useState<number>();
    const [defaultImageSrc, setDefaultImageSrc] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);

    // 확인 버튼 활성화 조건
    const isButtonValid =
        sellerProduct?.images?.[0] !== null && selectedCategoryId && name && grade && number;

    useEffect(() => {
        if (prevPath === '/seller-saleslist') {
            setSellerProduct(new ProductModel({}));
        }
    }, []);

    useEffect(() => {
        if (sellerProduct) {
            setName(sellerProduct.name || '');
            setGrade(sellerProduct.grade || '');
            setNumber(sellerProduct.quantity || undefined);

            // 등급 버튼 상태도 동기화
            const index = gradeArr.indexOf(sellerProduct.grade ?? '');
            if (index >= 0) {
                const newArr = Array(gradeArr.length).fill(false);
                newArr[index] = true;
                setIsCategorySelected(newArr);
            } else {
                setIsCategorySelected(Array(gradeArr.length).fill(false));
            }
        }
    }, [sellerProduct]);

    useEffect(() => {
        setDefaultImageSrc(sellerProduct?.images?.[0] || '/images/seller/empty_image.png');
    }, [sellerProduct.images]);

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

    // 버튼으로 grade 설정
    const gradeArr = ['중고', '새상품'];
    const [isCategorySelected, setIsCategorySelected] = useState<boolean[]>(
        Array(gradeArr.length).fill(false),
    );

    const handleClickGradeButton = (index: number) => {
        const newArr = Array(gradeArr.length).fill(false);
        newArr[index] = true;
        setIsCategorySelected(newArr);
        setGrade(gradeArr[index]);
    };

    const handleClickCategoryButton = () => {
        setSellerProduct(
            (prev) => new ProductModel({ ...prev, name: name, grade: grade, quantity: number }),
        );
        navigate('/seller-saleslist-addproduct-getcategory');
    };

    const handleClickConfirmButton = () => {
        setSellerProduct(
            (prev) =>
                new ProductModel({
                    ...prev,
                    category: selectedCategoryId,
                    name: name,
                    grade: grade,
                    quantity: number,
                }),
        );
        navigate('/seller-saleslist-productdetail', {
            state: {
                selectedCategoryName,
            },
        });
    };

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
                                    defaultImageSrc !== '/images/seller/empty_image.png'
                                        ? styles.uploadedImage
                                        : styles.defaultImage
                                }
                                src={defaultImageSrc}
                                width={
                                    defaultImageSrc !== '/images/seller/empty_image.png'
                                        ? '100%'
                                        : '30px'
                                }
                            />
                            {defaultImageSrc === '/images/seller/empty_image.png' ? (
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
                        value={name}
                        className={styles.input}
                        placeholder="제품명"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        value={number ?? ''}
                        type="number"
                        className={styles.input}
                        placeholder="개수"
                        onChange={(e) => {
                            const value = e.target.value;
                            setNumber(value === '' ? undefined : Number(value));
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
                        {gradeArr.map((element, index) => {
                            return (
                                <BasicButton
                                    key={index}
                                    isSelected={isCategorySelected[index]}
                                    handleClick={handleClickGradeButton}
                                    elementIndex={index}
                                    content={element}
                                />
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
