import styles from './SellerSalesListAddProduct.module.css';
import BackButtonForAddProduct from './components/BackButtonForAddProduct';
import { sellerProductState } from '@/src/recoil/productState';
import { useRecoilState } from 'recoil';
import ProductModel from '@/src/models/ProductModel';
import { uploadProductImageInService } from '@/src/services/sellerProductService';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BasicButton from './components/BasicButton';
import CameraGrayIcon from '../../assets/images/page/add-product/camera-gray.png';
import CameraWhiteIcom from '../../assets/images/page/add-product/camera-white.png';

export default function SellerSalesListAddProduct() {
    // hooks
    const [sellerProduct, setSellerProduct] = useRecoilState(sellerProductState);

    // route
    const navigate = useNavigate();
    const { state } = useLocation();

    const selectedCategoryName = sellerProduct.categoryName;
    const reset = state?.reset;

    // useState
    const [, setIsUploading] = useState<boolean>(false);

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

    useEffect(() => {
        if (reset) {
            setSellerProduct(new ProductModel({}));
        }
    }, [reset, setSellerProduct]);

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
                    setSellerProduct((prev) => prev.addImage(uploadedImageUrl));
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
        navigate('/seller-saleslist-productdetail');
    };
    return (
        <div className={styles.page}>
            <div className={styles.section}>
                <BackButtonForAddProduct />
                <p className={styles.title}>물품 판매하기</p>
                <div className={styles.imageUploadWrapper}>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <div className={styles.thumbnailItem} onClick={handleAddImage}>
                        <div className={styles.cameraBox}>
                            <img
                                src={
                                    sellerProduct.images.length === 0
                                        ? CameraGrayIcon
                                        : CameraWhiteIcom
                                }
                                className={styles.cameraIcon}
                            />
                            <p className={styles.uploadCount}>
                                <span className={styles.uploadCurrent}>
                                    {sellerProduct.images.length}
                                </span>
                                <span className={styles.uploadTotal}> / 10</span>
                            </p>
                        </div>
                    </div>
                    {sellerProduct.images.map((img, idx) => (
                        <div key={idx} className={styles.thumbnailItem}>
                            <img src={img} className={styles.thumbnailImage} />
                            <button
                                className={styles.deleteButton}
                                onClick={() => setSellerProduct((prev) => prev.removeImage(img))}
                            >
                                ×
                            </button>
                            {idx === 0 && <div className={styles.representLabel}>대표 사진</div>}
                        </div>
                    ))}
                </div>

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
                            setSellerProduct((prev) => prev.copyWith({ name: e.target.value }))
                        }
                    />
                    <textarea
                        value={sellerProduct.description ?? ''}
                        className={styles.input}
                        placeholder="설명"
                        onChange={(e) =>
                            setSellerProduct((prev) =>
                                prev.copyWith({ description: e.target.value }),
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
                            setSellerProduct((prev) => prev.copyWith({ quantity: Number(value) }));
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
                                        setSellerProduct((prev) =>
                                            prev.copyWith({ grade: element }),
                                        )
                                    }
                                >
                                    {element}
                                </BasicButton>
                            );
                        })}
                    </div>
                </form>
            </div>
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
    );
}
