import styles from "./SellerSalesListAddProduct.module.css";
import BackHeader from "@/src/components/layout/BackHeader";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useProduct } from "@/src/contexts/ProductContext";
import { useLocation } from "react-router-dom";

export default function SellerSalesListAddProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { createProduct, uploadProductImage } = useProduct();
  const { selectedCategoryId, selectedCategoryName } = location.state;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [number, setNumber] = useState<number | null>(null);

  const isButtonValid =
    images.length !== 0 && selectedCategoryId && name && grade && number;

  const handleAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      try {
        const uploadedImageUrl = await uploadProductImage(file);

        if (uploadedImageUrl) {
          setImages((prevImages) => [...prevImages, uploadedImageUrl]);
          console.log(uploadedImageUrl);
        }
      } catch (error) {
        alert(`상품 이미지 업로드에 실패했습니다 : ${error}`);
      }
    }
  };
  console.log( images,
    selectedCategoryId,
    name,
    grade,
    number,)

  const handleClickConfirmButton = () => {
    navigate("/seller-saleslist-productdetail", {
      state: {
        images,
        selectedCategoryId,
        name,
        grade,
        number,
      },
    });
  };

  return (
    <div className={styles.page}>
      <BackHeader />
      <div className={styles.section}>
        <p className={styles.title}>물품 판매하기</p>
        <button className={styles.imageButton} onClick={handleAddImage}>
          <input
            className={styles.imageInput}
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {/* 업로드 이미지 첫번째꺼만 보이게 하드코딩함. 나중에 여러개 보여주도록 수정해야함 */}
          <img
            className={images[0] ? styles.uploadedImage : styles.defaultImage}
            src={
              images[0] ||
              "/src/assets/images/page/seller-saleslist-addproduct/empty_image.png"
            }
            width={images[0] ? "100%" : "30px"}
          />
          {!images[0] && (
            <span>
              물품 이미지를 업로드해주세요
            </span>
          )}{" "}
        </button>
        <p className={styles.subtitle}>물품 정보</p>
        <form
          className={styles.formContainer}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            value={selectedCategoryName}
            className={styles.input}
            placeholder="카테고리"
            readOnly
            onClick={() => navigate("/seller-saleslist-addproduct-getcategory")}
          />
          <input
            value={name}
            className={styles.input}
            placeholder="제품명"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            value={grade}
            className={styles.input}
            placeholder="등급 (중고 또는 새상품)"
            onChange={(e) => setGrade(e.target.value)}
          />
          <input
            value={number === null ? "" : number}
            type="number"
            className={styles.input}
            placeholder="개수"
            onChange={(e) => {
              const value = e.target.value;
              setNumber(value === "" ? null : Number(value));
            }}
          />
        </form>
        <button
          className={styles.submitButton}
          disabled={!isButtonValid}
          onClick={handleClickConfirmButton}
        >
          확인
        </button>
      </div>
    </div>
  );
}
