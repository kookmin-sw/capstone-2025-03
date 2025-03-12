import styles from "./SellerSalesListAddProductGetCategory.module.css";
import defaultImg from "@/src/assets/images/page/seller-saleslist-addproduct-getcategory/defaultimg.jpg";
import BackHeader from "@/src/components/layout/BackHeader";
import { useNavigate } from "react-router-dom";
import { useCategory } from "@/src/contexts/CategoryContext";
import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import LoadingSection from "@/src/components/layout/LoadingSection";

export default function SellerSalesListAddProductGetCategory() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { categories, getAllCategory } = useCategory();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [searchCategory, setSearchCategory] = useState<string>("");

  useEffect(() => {
    const fetchCatogories = async () => {
      try {
        setIsLoading(true);
        await getAllCategory();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatogories();
    
    if (selectedCategoryId && selectedCategoryName) {
      navigate("/seller-saleslist-addproduct", {
        state: { selectedCategoryId, selectedCategoryName },
      });
    }
  }, [selectedCategoryId, selectedCategoryName]);

  const handleCategoryClick = (id: number, name: string) => {
    setSelectedCategoryId(id);
    setSelectedCategoryName(name);
  };

  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(searchCategory.toLowerCase())
  );

  console.log(isLoading);

  return isLoading ? (
    <LoadingSection text="로딩 중" />
  ) : (
    <div className={styles.page}>
      <div className={styles.inputContainer}>
        <BackHeader />
        <div className={styles.inputMom}>
          <LuSearch className={styles.icon} />
          <input
            value={searchCategory}
            className={styles.input}
            placeholder="전체 카테고리"
            onChange={(e) => setSearchCategory(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.container}>
        {filteredCategories.map((category) => (
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
