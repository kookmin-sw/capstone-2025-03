import BackHeader from "@/src/components/layout/BackHeader";
import styles from "./PackageDetail.module.css";
import DefaultButton from "@/src/components/ui/DefaultButton";
import PackageItem from "@/src/components/ui/PackageItem";
import CoffeePack from "../../assets/images/dummy/coffee_pack.png";
import AddIconImage from "../../assets/images/page/package-detail/add_icon.png";
import EditIconImage from "../../assets/images/page/package-detail/edit_icon.png";
import EspressoMachineImage from "../../assets/images/dummy/espresso_machine.png";
import ArrowRightIconImage from "../../assets/images/page/package-detail/arrow_right.png";
import DeleteIconImage from "../../assets/images/page/package-detail/delete.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSection from "@/src/components/layout/LoadingSection";
import CompleteSection from "@/src/components/layout/CompleteSection";

export default function PackageDetail() {
    const [isComplete, setIsComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const packages = [{
        id: "1",
        thumbnail: CoffeePack,
        title: "프리미엄 여행 패키지",
        description: "이 패키지는 최고의 여행 경험을 제공합니다.",
        price: 299000,
        categories: ["호텔", "비행기", "렌터카"]
    }];
    const products = [{
        thumbnail: "",
        category: "",
        productName: "",
        amount: 0,
        price: 10000
    }, {
        thumbnail: "",
        category: "",
        productName: "",
        amount: 0,
        price: 10000
    }, {
        thumbnail: "",
        category: "",
        productName: "",
        amount: 0,
        price: 10000
    }, {
        thumbnail: "",
        category: "",
        productName: "",
        amount: 0,
        price: 10000
    }, {
        thumbnail: "",
        category: "",
        productName: "",
        amount: 0,
        price: 10000
    }, {
        thumbnail: "",
        category: "",
        productName: "",
        amount: 0,
        price: 10000
    }, {
        thumbnail: "",
        category: "",
        productName: "",
        amount: 0,
        price: 10000
    }, {
        thumbnail: "",
        category: "",
        productName: "",
        amount: 0,
        price: 10000
    }, {
        thumbnail: "",
        category: "",
        productName: "",
        amount: 0,
        price: 10000
    }, {
        thumbnail: "",
        category: "",
        productName: "",
        amount: 0,
        price: 10000
    }, {
        thumbnail: "",
        category: "",
        productName: "",
        amount: 0,
        price: 10000
    }, {
        thumbnail: "",
        category: "",
        productName: "",
        amount: 0,
        price: 10000
    },]

    const handleAddCategoryButtonClick = () => {
        navigate('/package-detail-add-category', { state: {} })
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

    const handleProductItemClick = ({ product }: { product: {} }) => {
        navigate('/package-detail-add-product', { state: { product: product } })
    }

    return (
        isLoading ? (isComplete ? <CompleteSection text="패키지 구매 신청 완료!"/> : <LoadingSection text="잠시만 기다려주세요"/>) : <div className={styles.page}>
            <BackHeader />
            <div className={styles.section}>
                <div className={styles.packageCard}>
                    <PackageItem pkg={packages[0]} />
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
                                    isEdit ? (<button className={styles.deleteProductButton}>
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