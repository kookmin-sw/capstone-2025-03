import styles from "./SellerSalesListAddProductGetCategory.module.css";
import defaultImg from "@/src/assets/images/page/seller-saleslist-addproduct-getcategory/defaultimg.jpg";
import BackHeader from "@/src/components/layout/BackHeader";
import { useNavigate } from "react-router-dom";
import { useCategory } from "@/src/contexts/CategoryContext";
import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";

export default function SellerSalesListAddProductGetCategory() {
  const navigate = useNavigate();
  const { categories, getAllCategory } = useCategory();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");

  useEffect(() => {
    getAllCategory();
    if (selectedCategoryId && selectedCategoryName) {
      navigate("/seller-saleslist-addproduct", {
        state: { selectedCategoryId, selectedCategoryName },
      });
    }
  }, [selectedCategoryId, selectedCategoryName]);
  console.log(categories, "dfdf");

  const handleCategoryClick = (id: number, name: string) => {
    setSelectedCategoryId(id);
    setSelectedCategoryName(name);
  };

  return (
    <div className={styles.page}>
      <div className={styles.inputContainer}>
        <BackHeader />
        <div className={styles.inputMom}>
          <LuSearch className={styles.icon} />
          <input className={styles.input} placeholder="전체 카테고리" />
        </div>
      </div>
      <div className={styles.container}>
        {categories.map((category) => (
          <button
            className={styles.button}
            onClick={() =>
              category.id !== null &&
              category.name !== null &&
              handleCategoryClick(category.id, category.name)
            }
          >
            <div key={category.id} className={styles.categoryItem}>
              <img
                src={category.thumbnail || defaultImg}
                alt={category.name || ""}
                className={styles.thumbnail}
              />
              <span className={styles.name}>{category.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
