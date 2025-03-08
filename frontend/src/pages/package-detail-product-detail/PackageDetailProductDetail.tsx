import BackHeader from "@/src/components/layout/BackHeader";
import styles from "./PackageDetailProductDetail.module.css";
import DefaultButton from "@/src/components/ui/DefaultButton";
import { useLocation, useNavigate } from "react-router-dom";
import BuyerProductModel from "@/src/models/BuyerProductModel";
import { useRecoilState } from "recoil";
import { edigingPackageState } from "@/src/recoil/packageState";
import PackageModel from "@/src/models/PackageModel";
import { useCategory } from "@/src/hooks/useCategory";

export default function PackageDetailProductDetail() {
    // page connection
    const navitgate = useNavigate();
    const location = useLocation();
    const product: BuyerProductModel = BuyerProductModel.fromJson(location.state?.product || {});
    // hook
    const { categories } = useCategory();
    // recoil
    const [editingPackage, setEditingPackage] = useRecoilState(edigingPackageState);

    // Function
    const handleButtonClick = () => {
        if (!editingPackage.productIds.includes(product.id!)) {
            setEditingPackage((prev) => PackageModel.fromJson({
                ...prev,
                productIds: [...prev.productIds, product.id]
            }))
        }
        navitgate(-1)
    }

    return (
        <div className={styles.page}>
            <BackHeader />
            <div className={styles.section}>
                <img className={styles.thumbnail} src={product.images[0]} />
                <p className={styles.category}>
                    {categories.find((category) => category.id === product.categoryId)?.name}
                </p>
                <p className={styles.product}>
                    {product.name}
                </p>
                <p className={styles.gradeAndAmount}>
                    {product.grade}등급 ∙ {product.quantity}개
                </p>
                <p className={styles.price}>
                    {product.price}원
                </p>
            </div>
            <div className={styles.buttonContainer}>
                <DefaultButton event={handleButtonClick} isActive={true} />
            </div>
        </div>
    )
}