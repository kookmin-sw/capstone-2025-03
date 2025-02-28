import BackHeader from "@/src/components/layout/BackHeader";
import styles from "./PackageDetail.module.css";
import DefaultButton from "@/src/components/ui/DefaultButton";
import PackageItem from "@/src/components/ui/PackageItem";
import AddIconImage from "../../assets/images/page/package-detail/add_icon.png";
import EditIconImage from "../../assets/images/page/package-detail/edit_icon.png";
import EspressoMachineImage from "../../assets/images/dummy/espresso_machine.png";
import ArrowRightIconImage from "../../assets/images/page/package-detail/arrow_right.png";
import DeleteIconImage from "../../assets/images/page/package-detail/delete.png";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSection from "@/src/components/layout/LoadingSection";
import CompleteSection from "@/src/components/layout/CompleteSection";
import CoffeePackImage from "../../assets/images/dummy/coffee_pack.png";
import PackageModel from "@/src/models/PackageModel";
import ProductModel from "@/src/models/ProductModel";
import CategoryModel from "@/src/models/CategoryModel";

export default function PackageDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isComplete, setIsComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [products, setProducts] = useState<ProductModel[]>([])

    const pkg: PackageModel = location.state?.pkg || PackageModel.fromJson({
        "id": 1,
        "industry_id": 1,
        "category_ids": [1, 2],
        "product_ids": [1, 2],
        "thumbnail": CoffeePackImage,
        "name": "Restaurant Starter Pack",
        "description": "Basic tools and kitchenware for new restaurants.",
        "price": 90000
    });

    useEffect(() => {
        const productDataList = [
            {
                "id": 1,
                "categoryId": 3,
                "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
                "name": "고급 원두 커피",
                "description": "스페셜티 원두 100% 사용. 깊고 진한 향.",
                "grade": "A+",
                "quantity": 50,
                "price": 25000,
                "sellerId": 101,
                "uploadDate": "2025-02-28T10:30:00.000Z",
                "buyerId": null,
                "purchaseDate": null,
                "salesStatus": "판매 중"
            },
            {
                "id": 2,
                "categoryId": 5,
                "images": ["https://example.com/image3.jpg"],
                "name": "럭셔리 네일 아트 세트",
                "description": "고급스러운 디자인과 튼튼한 내구성을 자랑하는 네일 세트.",
                "grade": "B",
                "quantity": 20,
                "price": 50000,
                "sellerId": 102,
                "uploadDate": "2025-02-25T14:45:00.000Z",
                "buyerId": 201,
                "purchaseDate": "2025-02-27T09:20:00.000Z",
                "salesStatus": "판매 완료"
            },
            {
                "id": 3,
                "categoryId": 7,
                "images": ["https://example.com/image4.jpg", "https://example.com/image5.jpg"],
                "name": "홈트레이닝 기구 세트",
                "description": "헬스장 못지않은 운동을 집에서도! 필수 홈트 세트.",
                "grade": "A",
                "quantity": 10,
                "price": 150000,
                "sellerId": 103,
                "uploadDate": "2025-02-22T08:10:00.000Z",
                "buyerId": null,
                "purchaseDate": null,
                "salesStatus": "판매 중"
            },
            {
                "id": 4,
                "categoryId": 2,
                "images": ["https://example.com/image6.jpg"],
                "name": "기능성 베개",
                "description": "숙면을 위한 인체공학적 설계. 목과 척추를 보호하는 디자인.",
                "grade": "A+",
                "quantity": 30,
                "price": 32000,
                "sellerId": 104,
                "uploadDate": "2025-02-20T12:00:00.000Z",
                "buyerId": 202,
                "purchaseDate": "2025-02-26T18:40:00.000Z",
                "salesStatus": "판매 완료"
            },
            {
                "id": 5,
                "categoryId": 9,
                "images": ["https://example.com/image7.jpg"],
                "name": "프리미엄 비즈니스 노트북",
                "description": "고성능 프로세서와 장시간 배터리 수명을 갖춘 최신 노트북.",
                "grade": "S",
                "quantity": 5,
                "price": 2500000,
                "sellerId": 105,
                "uploadDate": "2025-02-18T16:30:00.000Z",
                "buyerId": 203,
                "purchaseDate": "2025-02-24T11:15:00.000Z",
                "salesStatus": "판매 완료"
            }
        ]
        const categoryDataList = productDataList.map((product) => product.categoryId);

        setCategories(categoryDataList.map((category) => CategoryModel.fromJson(category)));
        setProducts(productDataList.map((product) => ProductModel.fromJson(product)))
    }, [])

    const handleAddCategoryButtonClick = () => {
        navigate('/package-detail-add-category')
    }

    const handleDeleteButtonClick = () => {
        setIsEdit(!isEdit);
    }

    const handleBuyButtonClick = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleBuyConfirmButtonClick = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsComplete(true);
        }, 3000);
    };

    const handleProductItemClick = ({ product }: { product: ProductModel }) => {
        navigate('/package-detail-add-product', { state: { product: product } });
    }

    const handleDeleteItemClick = ({ categoryId }: { categoryId: number }) => {
        let tempCategories = [...categories].filter((category) => category.id != categoryId);
        let tempProducts = [...products].filter((product) => product.categoryId != categoryId);
        setCategories(tempCategories);
        setProducts(tempProducts);
    }

    return (
        isLoading ? (isComplete ? <CompleteSection text="패키지 구매 신청 완료!" /> : <LoadingSection text="잠시만 기다려주세요" />) : <div className={styles.page}>
            <BackHeader />
            <div className={styles.section}>
                <div className={styles.packageCard}>
                    <PackageItem pkg={pkg} />
                </div>
                <div className={styles.titleContainer}>
                    <p className={styles.listViewTitle}>
                        구성상품
                    </p>
                    <div className={styles.blank} />
                    <div className={styles.iconButtonContainer}>
                        <button className={styles.iconButton} onClick={handleAddCategoryButtonClick}>
                            <img className={styles.iconButtonImage} src={AddIconImage} />
                        </button>
                        <button className={styles.iconButton} onClick={handleDeleteButtonClick} style={{ backgroundColor: `${!isEdit ? '#00A36C' : '#7F7F89'}` }}>
                            <img className={styles.iconButtonImage} src={EditIconImage} />
                        </button>
                    </div>
                </div>
                <div className={styles.listView}>
                    {products.map((product, index) => {
                        return (
                            <div key={index} className={styles.productItem} onClick={() => { handleProductItemClick({ product: product }) }}>
                                <img className={styles.productThumbnail} src={EspressoMachineImage} />
                                <div className={styles.productInfoContainer}>
                                    <p className={styles.productName}>
                                        바디프렌즈 에스프레소
                                    </p>
                                    <p className={styles.categoryAndAmount}>
                                        에스프레소 머신 3개
                                    </p>
                                </div>
                                <div className={styles.blank} />
                                <p className={styles.price}>
                                    {product.price}원
                                </p>
                                {
                                    isEdit ? (<button className={styles.deleteProductButton} onClick={() => handleDeleteItemClick({ categoryId: product.categoryId! })}>
                                        <img className={styles.deleteProductButtonIcon} src={DeleteIconImage} />
                                    </button>) : (<button className={styles.searchOtherProductsButton}>
                                        <img className={styles.searchOtherProductsButtonIcon} src={ArrowRightIconImage} />
                                    </button>)
                                }
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <DefaultButton event={handleBuyButtonClick} isActive={true} />
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className={styles.overlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <p className={styles.modalTitle}>
                            선택한 물품들을 한번에<br />구매하시겠어요?
                        </p>
                        <p className={styles.description}>
                            결제와 배송은 카카오톡으로 진행됩니다.
                        </p>
                        <div className={styles.modalButtonContainer}>
                            <DefaultButton event={handleBuyConfirmButtonClick} isActive={true} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}