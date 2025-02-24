import styles from "./SellerSalesList.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainHeader from "@/src/components/layout/MainHeader";
import Footer from "@/src/components/layout/MenuFooter";
import EspressoMachineImage from "../../assets/images/dummy/espresso_machine.png";
import SellerProductItem from "@/src/components/ui/SellerProductItem";

export default function SellerSalesList() {
  const navigate = useNavigate();
  const [visibleHeight, setVisibleHeight] = useState<number>(
    window.innerHeight
  );
  const currentMenuIndex = 0;

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

  const products: Product[] = [
    {
      id: "0",
      category: "에스프레소 머신",
      name: "바디프렌즈 에스프레소 머신1",
      grade: "A",
      amount: 3,
      price: 48000,
      status: "판매 완료",
      thumbnail: EspressoMachineImage,
    },
    {
      id: "1",
      category: "에스프레소 머신",
      name: "바디프렌즈 에스프레소 머신2",
      grade: "A",
      amount: 3,
      price: 58000,
      status: "판매 중",
      thumbnail: EspressoMachineImage,
    },
    {
      id: "2",
      category: "에스프레소 머신",
      name: "바디프렌즈 에스프레소 머신3",
      grade: "A",
      amount: 3,
      price: 41000,
      status: "판매 완료",
      thumbnail: EspressoMachineImage,
    },
    {
      id: "3",
      category: "에스프레소 머신",
      name: "바디프렌즈 에스프레소 머신4",
      grade: "A",
      amount: 3,
      price: 51000,
      status: "판매 완료",
      thumbnail: EspressoMachineImage,
    },
    {
      id: "4",
      category: "에스프레소 머신",
      name: "바디프렌즈 에스프레소 머신5",
      grade: "A",
      amount: 3,
      price: 43000,
      status: "판매 중",
      thumbnail: EspressoMachineImage,
    },
    {
      id: "5",
      category: "에스프레소 머신",
      name: "바디프렌즈 에스프레소 머신6",
      grade: "A",
      amount: 3,
      price: 49000,
      status: "판매 중",
      thumbnail: EspressoMachineImage,
    },
    {
      id: "6",
      category: "에스프레소 머신",
      name: "바디프렌즈 에스프레소 머신7",
      grade: "A",
      amount: 3,
      price: 34000,
      status: "판매 중",
      thumbnail: EspressoMachineImage,
    },
    {
      id: "7",
      category: "에스프레소 머신",
      name: "바디프렌즈 에스프레소 머신8",
      grade: "A",
      amount: 3,
      price: 34000,
      status: "판매 중",
      thumbnail: EspressoMachineImage,
    },
    {
      id: "8",
      category: "에스프레소 머신",
      name: "바디프렌즈 에스프레소 머신9",
      grade: "A",
      amount: 3,
      price: 34000,
      status: "판매 중",
      thumbnail: EspressoMachineImage,
    },
    {
      id: "9",
      category: "에스프레소 머신",
      name: "바디프렌즈 에스프레소 머신10",
      grade: "A",
      amount: 3,
      price: 34000,
      status: "판매 중",
      thumbnail: EspressoMachineImage,
    },
  ];


  const handleClickAddProductButton = () => {
    navigate("/seller-saleslist-add-product");
  };
  
  return (
    <div className={styles.page}>
      <MainHeader />
      <div className={styles.section}>
        <p className={styles.listViewTitle}>판매 중인 물품들</p>
        <div>
          {products.map((prod, index) => {
            return <SellerProductItem key={index} product={prod} />;
          })}
        </div>
      </div>
      <button className={styles.addProductButton}>+</button>
      <div className={styles.footerBar}>
        <Footer currentMenuIndex={currentMenuIndex} />
      </div>
    </div>
  );
}
