import styles from "./SellerSalesListAddProduct.module.css";
import BackHeader from "@/src/components/layout/BackHeader";
import BackButtonForAddProduct from "./components/BackButtonForAddProduct";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSellerProduct } from "@/src/contexts/SellerProductContext";
import SellerProductModel from "@/src/models/SellerProductModel";

export default function SellerSalesListAddProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sellerProduct, uploadProductImage, setSellerProduct } =
    useSellerProduct();
  const { selectedCategoryId, selectedCategoryName, prevPath } =
    location.state || {};
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [number, setNumber] = useState<number | null>(null);
  const [defaultImageSrc, setDefaultImageSrc] = useState<string>("");
  const isButtonValid =
    sellerProduct?.images?.[0] !== null &&
    selectedCategoryId &&
    name &&
    grade &&
    number;

  useEffect(() => {
    if (prevPath === "/seller-saleslist") {
      setSellerProduct(new SellerProductModel({}));
    }
  }, []);

  useEffect(() => {
    setDefaultImageSrc(
      sellerProduct?.images?.[0] ||
        "/src/assets/images/page/seller-saleslist-addproduct/empty_image.png"
    );
  }, [sellerProduct.images]);

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
          setImages((prevImages) => {
            const newImages = [...prevImages, uploadedImageUrl];

            setSellerProduct((prev) => {
              if (!prev) return new SellerProductModel({ images: newImages });

              return new SellerProductModel({
                ...prev,
                images: newImages,
              });
            });

            return newImages;
          });
        }
      } catch (error) {
        alert(`상품 이미지 업로드에 실패했습니다 : ${error}`);
      }
    }
  };

  const handleClickConfirmButton = () => {
    navigate("/seller-saleslist-productdetail", {
      state: {
        // images,
        selectedCategoryName,
        selectedCategoryId,
        name,
        grade,
        number,
      },
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.section}>
        <BackButtonForAddProduct />
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
            className={
              defaultImageSrc !==
              "/src/assets/images/page/seller-saleslist-addproduct/empty_image.png"
                ? styles.uploadedImage
                : styles.defaultImage
            }
            src={defaultImageSrc}
            width={
              defaultImageSrc !==
              "/src/assets/images/page/seller-saleslist-addproduct/empty_image.png"
                ? "100%"
                : "30px"
            }
          />
          {defaultImageSrc ===
          "/src/assets/images/page/seller-saleslist-addproduct/empty_image.png" ? (
            <span>물품 이미지를 업로드해주세요</span>
          ) : null}
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
            value={number ?? ""}
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
