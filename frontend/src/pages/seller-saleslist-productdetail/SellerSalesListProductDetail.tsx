import styles from "./SellerSalesListProductDetail.module.css";
import BackHeader from "@/src/components/layout/BackHeader";
import EspressoMachineImage from "../../assets/images/dummy/espresso_machine.png";
import ProductItem from "@/src/components/ui/ProductItem";
import AiOptimizer from "./components/AiOptimizer";
import PriceInput from "./components/PriceInput";
import CompleteSection from "@/src/components/layout/CompleteSection";
import LoadingSection from "@/src/components/layout/LoadingSection";
import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function SellerSalesListProductDetail() {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const location = useLocation();
  const { images, category, name, grade, number } = location.state;
  console.log(images, category, name, grade, number)

  const isButtonValid = price;

  // 더미데이터
  type Product = {
    id: string;
    category: string;
    name: string;
    grade: string;
    amount: number;
    price: number;
    status: string;
    thumbnail: string;
  };
  const product: Product = {
    id: "0",
    category: "에스프레소 머신",
    name: "바디프렌즈 에스프레소 머신1",
    grade: "A",
    amount: 3,
    price: 48000,
    status: "판매 완료",
    thumbnail: EspressoMachineImage,
  };

  const hanldeSellButtonClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsComplete(true);
    }, 3000);
  };

  return isLoading ? (
    isComplete ? (
      <CompleteSection text="판매 물품 업로드 완료!" />
    ) : (
      <LoadingSection text="잠시만 기다려주세요" />
    )
  ) : (
    <div className={styles.page}>
      <BackHeader />
      <div className={styles.section}>
        <p className={styles.title}>가격을 입력해주세요</p>

        <ProductItem product={product} />
        <AiOptimizer />
        <PriceInput price={price} setPrice={setPrice} />
        <button
          className={styles.submitButton}
          disabled={!isButtonValid}
          onClick={hanldeSellButtonClick}
        >
          판매하기
        </button>
      </div>
    </div>
  );
}
