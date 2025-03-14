import styles from "./SellerSalesList.module.css";
import MainHeader from "@/src/components/layout/MainHeader";
import Footer from "@/src/components/layout/MenuFooter";
import SellerProductItem from "@/src/components/ui/SellerProductItem";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSellerProduct } from "@/src/contexts/SellerProductContext";
import SellerProductModel from "@/src/models/SellerProductModel";
import LoadingSection from "@/src/components/layout/LoadingSection";

export default function SellerSalesList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getProductList } = useSellerProduct();
  const [sellerId, setSellerId] = useState<number>();
  const [sellerProducts, setSellerProducts] = useState<SellerProductModel[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const currentMenuIndex = 1;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setSellerId(userData.id);
    }

    const fetchProducts = async () => {
      if (sellerId) {
        try {
          const response = await getProductList(sellerId);
          if (response) {
            const formattedProducts = response.map((item: any) =>
              SellerProductModel.fromJson(item)
            );
            setSellerProducts(formattedProducts);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [sellerId]);

  const handleClickAddProductButton = () => {
    navigate("/seller-saleslist-addproduct", {
      state: { prevPath: location.pathname },
    });
  };

  return isLoading ? (
    <LoadingSection text="로딩 중" />
  ) : (
    <div className={styles.page}>
      <MainHeader />
      <div className={styles.section}>
        <p className={styles.listViewTitle}>판매 중인 물품들</p>
        <div>
          {sellerProducts.map((product, index) => {
            return <SellerProductItem key={index} product={product} />;
          })}
        </div>
      </div>
      <button
        className={styles.addProductButton}
        onClick={handleClickAddProductButton}
      >
        +
      </button>
      <div className={styles.footerBar}>
        <Footer currentMenuIndex={currentMenuIndex} />
      </div>
    </div>
  );
}
