import styles from "./SellerSalesListAddProduct.module.css";
import BackHeader from "@/src/components/layout/BackHeader";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

export default function SellerSalesListAddProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [number, setNumber] = useState<number | null>(null);
  
  const isButtonValid = imageUrl && category && name && grade && number;

  const handleAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileUrl = URL.createObjectURL(file);
      setImageUrl(fileUrl);
    }
  };

  const handleClickConfirmButton = () => {
    navigate("/seller-saleslist-productdetail");
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
          <img
            className={imageUrl ? styles.uploadedImage : styles.defaultImage}
            src={
              imageUrl ||
              "/src/assets/images/page/seller-saleslist-addproduct/empty_image.png"
            }
            width={"30rem"}
          />
          물품 이미지를 업로드해주세요
        </button>
        <p className={styles.subtitle}>물품 정보</p>
        <form
          className={styles.formContainer}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            value={category}
            className={styles.input}
            placeholder="카테고리"
            onChange={(e) => setCategory(e.target.value)}
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
            placeholder="등급 (A 또는 B)"
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
