import styles from "./SellerSalesListProductDetail.module.css";
import BackHeader from "@/src/components/layout/BackHeader";
import ProductItem from "@/src/components/ui/ProductItem";
import AiOptimizer from "./components/AiOptimizer";
import PriceInput from "./components/PriceInput";
import CompleteSection from "@/src/components/layout/CompleteSection";
import LoadingSection from "@/src/components/layout/LoadingSection";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSellerProduct } from "@/src/contexts/SellerProductContext";
import SellerProductModel from "@/src/models/SellerProductModel";

type Product = {
  id: string;
  category: string;
  name: string;
  grade: string;
  amount: number;
  price: number | null;
  status: string;
  thumbnail: string;
};

export default function SellerSalesListProductDetail() {
  const navigate = useNavigate();
  const { sellerProduct, createSellerProduct, setSellerProduct } =
    useSellerProduct();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [sellerId, setSellerId] = useState<number>();
  const location = useLocation();
  const {
    images,
    selectedCategoryName,
    selectedCategoryId,
    name,
    grade,
    number,
  } = location.state;

  const [product, setProduct] = useState<Product>({
    id: selectedCategoryId,
    category: selectedCategoryName,
    name: name,
    grade: grade,
    amount: number,
    price: null,
    status: grade,
    thumbnail: images[0],
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setSellerId(userData.id);
    }

    setSellerProduct(
      new SellerProductModel({
        categoryId: selectedCategoryId,
        seller: sellerId,
        buyer: null,
        images: images,
        name: name,
        description: null,
        grade: grade,
        quantity: number,
        uploadDate: new Date().toISOString(),
        saleStatus: "available",
        purchaseDate: null,
        price: product.price,
      })
    );
  }, [sellerId, product.price]);

  console.log(sellerProduct);

  const isButtonValid = product.price;

  const handlePriceChange = (newPrice: number | null) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      price: newPrice,
    }));
  };

  const hanldeSellButtonClick = async () => {
    setIsLoading(true);
    
    try {
      await createSellerProduct(sellerProduct);
      setIsComplete(true);
      navigate("/seller-saleslist")
    } catch (error) {
      alert(`물건 등록 실패 : ${error}`);
    } finally {
      setIsLoading(false);
    }
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
        <PriceInput price={product.price} setPrice={handlePriceChange} />
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
