import BackHeader from "@/src/components/layout/BackHeader";
import styles from "./PackageDetailProductDetail.module.css";
import DefaultButton from "@/src/components/ui/DefaultButton";
import { useLocation, useNavigate } from "react-router-dom";

export default function PackageDetailProductDetail() {
    const navitgate = useNavigate();
    const location = useLocation();
    const product = location.state?.product || {
        id: "",
        category: "",
        name: "",
        grade: "",
        amount: 0,
        price: 0,
        thumbnail: ""
    };

    const handleButtonClick = () => {
        // localStorage에서 리스트 가져오기
        let selectedProductIds = JSON.parse(localStorage.getItem('selectedProductIds') || '[]');

        // 값이 없으면 추가, 있으면 해당 값을 모두 제거
        if (!selectedProductIds.includes(product.id)) {
            selectedProductIds = [...selectedProductIds, product.id];
        } else {
            // 특정 ID를 모두 제거
            selectedProductIds = selectedProductIds.filter((id: string) => id !== product.id);
        }

        // 변경된 배열을 다시 localStorage에 저장
        localStorage.setItem('selectedProductIds', JSON.stringify(selectedProductIds));

        navitgate(-1)
    }

    return (
        <div className={styles.page}>
            <BackHeader />
            <div className={styles.section}>
                <img className={styles.thumbnail} src={product.thumbnail} />
                <p className={styles.category}>
                    {product.category}
                </p>
                <p className={styles.product}>
                    {product.name}
                </p>
                <p className={styles.gradeAndAmount}>
                    {product.grade}등급 ∙ {product.amount}개
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