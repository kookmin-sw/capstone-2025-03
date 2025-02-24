import styles from "./SellerSalesListProductDetail.module.css";
import BackHeader from "@/src/components/layout/BackHeader";
import EspressoMachineImage from "../../assets/images/dummy/espresso_machine.png";
import ProductItem from "@/src/components/ui/ProductItem";
import AiOptimizer from "./components/AiOptimizer";
import PriceInput from "./components/PriceInput";
import { useState } from "react";

export default function SellerSalesListProductDetail() {
  const [price, setPrice] = useState<number | null>(null);

  const isButtonValid = price;

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

  return (
    <div className={styles.page}>
      <BackHeader />
      <div className={styles.section}>
        <p className={styles.title}>가격을 입력해주세요</p>

        <ProductItem product={product} />
        <AiOptimizer />
        <PriceInput price={price} setPrice={setPrice} />
        <button className={styles.submitButton} disabled={!isButtonValid}>
          판매하기
        </button>
      </div>
    </div>
  );
}
