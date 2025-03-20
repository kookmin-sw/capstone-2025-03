import styles from './SellerSalesListAddProduct.module.css';
import BackButtonForAddProduct from './components/BackButtonForAddProduct';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSellerProduct } from '@/src/contexts/SellerProductContext';
import { Spinner } from '@chakra-ui/react';
import SellerProductModel from '@/src/models/SellerProductModel';
import BasicButton from './components/BasicButton';

export default function SellerSalesListAddProduct() {
    const navigate = useNavigate();
    const location = useLocation();
    const { sellerProduct, uploadProductImage, setSellerProduct } = useSellerProduct();
    const { selectedCategoryId, selectedCategoryName, prevPath } = location.state || {};
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [name, setName] = useState<string>('');
    const [grade, setGrade] = useState<string>('');
    const [number, setNumber] = useState<number>();
    const [defaultImageSrc, setDefaultImageSrc] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const isButtonValid =
        sellerProduct?.images?.[0] !== null && selectedCategoryId && name && grade && number;

    useEffect(() => {
        if (prevPath === '/seller-saleslist') {
            setSellerProduct(new SellerProductModel({}));
        }
    }, []);

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
                const uploadedImageUrl = await uploadProductImage(file);

                if (uploadedImageUrl) {
                    setSellerProduct((prev) => {
                        if (!prev) return new SellerProductModel({ images: [uploadedImageUrl] });

                        return new SellerProductModel({
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

    const handleClick = (index: number) => {
        const newArr = Array(gradeArr.length).fill(false);
        newArr[index] = true;
        setIsCategorySelected(newArr);
        setGrade(gradeArr[index]);
    };

    const handleClickConfirmButton = () => {
        // if (grade !== '중고' && grade !== '새상품') {
        //     alert('등급은 중고 또는 새상품 만 가능합니다');
        //     return;
        // }

        setSellerProduct(
            (prev) =>
                new SellerProductModel({
                    ...prev,
                    categoryId: selectedCategoryId,
                    name: name,
                    grade: grade,
                    quantity: number,
                }),
        );
        navigate('/seller-saleslist-productdetail', {
            state: {
                name,
                selectedCategoryName,
                selectedCategoryId,
                grade,
                number,
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
                        value={selectedCategoryName}
                        className={styles.input}
                        placeholder="카테고리"
                        readOnly
                        onClick={() => navigate('/seller-saleslist-addproduct-getcategory')}
                    />
                    <input
                        value={name}
                        className={styles.input}
                        placeholder="제품명"
                        onChange={(e) => setName(e.target.value)}
                    />
                    {/* <input
                        value={grade}
                        className={styles.input}
                        placeholder="등급 (중고 또는 새상품)"
                        onChange={(e) => setGrade(e.target.value)}
                    /> */}
                    <input
                        value={number ?? ''}
                        type="number"
                        className={styles.input}
                        placeholder="개수"
                        onChange={(e) => {
                            const value = e.target.value;
                            setNumber(value === "" ? undefined : Number(value));
                        }}
                    />
                    <div className={styles.buttonContainer}>
                        {gradeArr.map((element, index) => {
                            return (
                                <BasicButton
                                    key={index}
                                    isSelected={isCategorySelected[index]}
                                    handleClick={handleClick}
                                    elementIndex={index}
                                    content={element}
                                />
                            );
                        })}
                    </div>
                </form>
                <button
                    className={styles.submitButton}
                    disabled={!isButtonValid}
                    onClick={handleClickConfirmButton}
                >
                    확인
                </button>
            </div>
        </div>
    );
}
