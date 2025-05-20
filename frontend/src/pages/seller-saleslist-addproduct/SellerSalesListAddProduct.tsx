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
import { Spinner } from '@chakra-ui/react';
import gasRangeData from '../../data/gasRangemodelData.json';
import Joyride from 'react-joyride';
import {
    SellerPageAddProductSteps,
    joyrideLocale,
    joyrideStyles,
} from '@/src/components/ui/ToolTipContents';

export default function SellerSalesListAddProduct() {
    // hooks
    const [sellerProduct, setSellerProduct] = useRecoilState(sellerProductState);

    // route
    const navigate = useNavigate();
    const { state } = useLocation();

    const selectedCategoryName = sellerProduct.categoryName;
    const reset = state?.reset;

    // useState
    const [isUploading, setIsUploading] = useState<boolean>(false);
    // 툴팁
    const [run, setRun] = useState<boolean>(false);
    const [isReady, setIsReady] = useState<boolean>(false);

    // useRef
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // 버튼으로 grade 설정
    const gradeArr = ['중고', '새상품'];

    // 가스레인지 AI 모델 적용을 위한 추가 feature
    const usagePeriodOptions = [
        '1개월 사용',
        '6개월 사용',
        '1년 사용',
        '2년 사용',
        '3년 사용',
        '4년 사용',
        '5년 사용',
        '거의 사용하지 않음',
    ];
    const [usagePeriod, setUsagePeriod] = useState<string>(usagePeriodOptions[0]);
    const physicalConditionOptions = [
        '상태 최상',
        '상태 양호',
        '상태 보통',
        '사용감 있음',
        '생활흔적 있음',
        '외관 약간 흠집',
        '외관 심한 흠집',
    ];
    const [physicalCondition, setPhysicalCondition] = useState<string>(physicalConditionOptions[0]);
    const operationalStateOptions = [
        '작동 이상 없음',
        '점화 불량',
        '버튼/다이얼 반응 느림',
        '일부 기능 미작동',
        '전원 불안정',
        '기타 전기적 이상',
    ];
    const [operationalState, setOperationalState] = useState<string>(operationalStateOptions[0]);

    // 확인 버튼 활성화 조건
    const isButtonValid =
        !!sellerProduct?.images?.[0] &&
        !!sellerProduct.category &&
        !!sellerProduct.name &&
        !!sellerProduct.grade &&
        !!sellerProduct.quantity;

    const resizeTextarea = (textarea: HTMLTextAreaElement) => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    };

    // 툴팁 용
    const LOCAL_STORAGE_KEY = 'seller_page_add_product_tooltip_shown';

    // 개발 중일때
    // localStorage.removeItem('seller_page_add_product_tooltip_shown');
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
        if (reset) {
            setSellerProduct(new ProductModel({}));
        }
    }, [reset, setSellerProduct]);

    useEffect(() => {
        if (
            sellerProduct.categoryName === '가스레인지' &&
            !gasRangeData.includes(sellerProduct.name ?? '')
        ) {
            setSellerProduct((prev) => prev.copyWith({ name: gasRangeData[0] }));
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
        navigate('/seller-saleslist-productdetail', {
            state: { condition: `${usagePeriod}, ${physicalCondition}, ${operationalState}` },
        });
    };
    return (
        <div id="introduce" className={styles.page}>
            <Joyride
                steps={SellerPageAddProductSteps}
                run={run}
                continuous
                disableScrolling
                showSkipButton
                showProgress={false}
                locale={joyrideLocale}
                styles={joyrideStyles}
            />
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
                        <div id="camera-button" className={styles.cameraBox}>
                            {isUploading ? (
                                <Spinner size="lg" color="#00a36c" />
                            ) : (
                                <>
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
                                </>
                            )}
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
                <div id="explanation">
                    <p className={styles.subtitle}>물품 정보</p>
                    <form className={styles.formContainer} onSubmit={(e) => e.preventDefault()}>
                        <input
                            value={selectedCategoryName ?? ''}
                            className={styles.input}
                            placeholder="카테고리"
                            readOnly
                            onClick={handleClickCategoryButton}
                        />
                        {sellerProduct.categoryName === '가스레인지' ? (
                            <select
                                className={styles.customSelect}
                                value={sellerProduct.name ?? ''}
                                onChange={(e) =>
                                    setSellerProduct((prev) =>
                                        prev.copyWith({ name: e.target.value }),
                                    )
                                }
                            >
                                {gasRangeData.map((modelName, index) => (
                                    <option key={index} value={modelName}>
                                        {modelName}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                value={sellerProduct.name ?? ''}
                                className={styles.input}
                                placeholder="제품명"
                                onChange={(e) =>
                                    setSellerProduct((prev) =>
                                        prev.copyWith({ name: e.target.value }),
                                    )
                                }
                            />
                        )}

                        <textarea
                            value={sellerProduct.description ?? ''}
                            className={styles.input}
                            placeholder="설명"
                            rows={1}
                            onChange={(e) => {
                                setSellerProduct((prev) =>
                                    prev.copyWith({ description: e.target.value }),
                                );
                                resizeTextarea(e.target); // onChange 이벤트에서 함수 호출
                            }}
                            // 초기 로드 시에도 높이 조정을 위한 ref 추가
                            ref={(textareaRef) => {
                                if (textareaRef) {
                                    resizeTextarea(textareaRef);
                                }
                            }}
                        />
                        <input
                            value={sellerProduct.quantity ?? ''}
                            type="number"
                            className={styles.input}
                            placeholder="개수"
                            onChange={(e) => {
                                const value = e.target.value;
                                setSellerProduct((prev) =>
                                    prev.copyWith({ quantity: Number(value) }),
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
                        {sellerProduct.categoryName === '가스레인지' && (
                            <div className={styles.inputContainerForNewModel}>
                                <select
                                    className={styles.customSelectCondition}
                                    value={usagePeriod}
                                    onChange={(e) => setUsagePeriod(e.target.value)}
                                >
                                    {usagePeriodOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className={styles.customSelectCondition}
                                    value={physicalCondition}
                                    onChange={(e) => setPhysicalCondition(e.target.value)}
                                >
                                    {physicalConditionOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className={styles.customSelectCondition}
                                    value={operationalState}
                                    onChange={(e) => setOperationalState(e.target.value)}
                                >
                                    {operationalStateOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </form>
                </div>
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
