import SearchHeader from "@/src/components/layout/SearchHeader";
import styles from "./PackageDetailAddProduct.module.css";
import DefaultButton from "@/src/components/ui/DefaultButton";
import ProductItem from "@/src/components/ui/ProductItem";
import { useNavigate } from "react-router-dom";
import EspressoMachineImage from "../../assets/images/dummy/espresso_machine.png";
import CheckIconImage from "../../assets/images/section/check.png";

export default function PackageDetailAddProduct() {
  const navigate = useNavigate();
  const selectedProductIds = JSON.parse(
    localStorage.getItem("selectedProductIds") || "[]"
  );

  type Product = {
    id: string;
    category: string;
    name: string;
    grade: string;
    amount: number;
    price: number;
    thumbnail: string;
  };

  const products: Product[] = [
    {
      id: "0",
      category: "에스프레소 머신",
      name: "바디프렌즈 에스프레소 머신",
      grade: "A",
      amount: 3,
      price: 40000,
      thumbnail: EspressoMachineImage,
    },
    {
      id: "1",
      category: "에스프레소 머신",
      name: "바디프렌즈 에스프레소 머신",
      grade: "A",
      amount: 3,
      price: 40000,
      thumbnail: EspressoMachineImage,
    },
    {
      id: "2",
      category: "에스프레소 머신",
      name: "바디프렌즈 에스프레소 머신",
      grade: "A",
      amount: 3,
      price: 40000,
      thumbnail: EspressoMachineImage,
    },
    {
      id: "3",
      category: "에스프레소 머신",
      name: "바디프렌즈 에스프레소 머신",
      grade: "A",
      amount: 3,
      price: 40000,
      thumbnail: EspressoMachineImage,
    },
    {
      id: "4",
      category: "에스프레소 머신",
      name: "바디프렌즈 에스프레소 머신",
      grade: "A",
      amount: 3,
      price: 40000,
      thumbnail: EspressoMachineImage,
    },
    {
      id: "5",
      category: "에스프레소 머신",
      name: "바디프렌즈 에스프레소 머신",
      grade: "A",
      amount: 3,
      price: 40000,
      thumbnail: EspressoMachineImage,
    },
    {
      id: "6",
      category: "에스프레소 머신",
      name: "바디프렌즈 에스프레소 머신",
      grade: "A",
      amount: 3,
      price: 40000,
      thumbnail: EspressoMachineImage,
    },
  ];

  const handleProductItemClick = (product: Product) => {
    navigate("/package-detail-product-detail", {
      state: { selectedProductIds: selectedProductIds, product: product },
    });
  };

  const handleButtonClick = () => {
    navigate(-1);
  };

  return (
    <div className={styles.page}>
      <SearchHeader text="에스프레소 머신" />
      <div className={styles.section}>
        <div className={styles.listView}>
          {products.map((product, index) => {
            return (
              <div
                key={index}
                className={styles.checkableProductItem}
                onClick={() => handleProductItemClick(product)}
              >
                <ProductItem product={product} />
                {selectedProductIds.includes(product.id) ? (
                  <img
                    className={styles.checkButtonIcon}
                    src={CheckIconImage}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <DefaultButton event={handleButtonClick} isActive={true} />
      </div>
    </div>
  );
}
