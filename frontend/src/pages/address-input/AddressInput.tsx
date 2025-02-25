import styles from "./AddressInput.module.css";
import LoadingSection from "@/src/components/layout/LoadingSection";
import RegisterCompleteSection from "./components/RegisterCompleteSection";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AddressInput() {
  const navigate = useNavigate();
  const location = useLocation();
  // const name = location.state.name;
  const [address] = useState(location.state?.address || "");
  const [detailAddress, setDetailAddress] = useState<string>("");
  const [visibleHeight, setVisibleHeight] = useState<number>(
    window.innerHeight
  );
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // name 불러오기
  const name = location.state?.name || sessionStorage.getItem("name") || "";

  const handleOpenSearch = () => {
    navigate("/address-search");
  };

  const handleConfirmButtonClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsComplete(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }, 3000);
  };

  // 버튼 비활성화 조건
  const isButtonDisabled = !address || !detailAddress;

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        setVisibleHeight(window.visualViewport.height);
      }
    };
    window.visualViewport?.addEventListener("resize", handleResize);
    return () => {
      window.visualViewport?.addEventListener("resize", handleResize);
    };
  }, []);

  return isLoading ? (
    isComplete ? (
      <RegisterCompleteSection text={name} />
    ) : (
      <LoadingSection text="잠시만 기다려주세요" />
    )
  ) : (
    <div className={styles.page}>
      {/* 문구 */}
      <p className={styles.heading}>
        배송을 위한 <br /> 주소를 입력해주세요
      </p>

      {/* 상세 주소 */}
      {address && (
        <div className={styles.addressWrapper}>
          <div className={styles.label}>상세 주소</div>
          <input
            className={styles.inputField}
            placeholder="주소"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
          />
        </div>
      )}

      {/* 주소 입력 */}
      <div className={styles.inputWrapper}>
        {address && <p className={styles.label}>주소</p>}
        <input
          className={styles.inputField}
          placeholder="주소"
          readOnly
          onClick={handleOpenSearch}
          value={address}
        />
      </div>

      <div className={styles.grow} />

      {/* 확인 */}
      <button
        className={styles.button}
        disabled={isButtonDisabled}
        onClick={handleConfirmButtonClick}
        style={{ top: `calc(${visibleHeight}px - 6rem - 2rem)` }}
      >
        확인
      </button>
    </div>
  );
}
