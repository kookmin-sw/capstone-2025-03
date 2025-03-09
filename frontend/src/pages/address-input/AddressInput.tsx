import styles from "./AddressInput.module.css";
import LoadingSection from "@/src/components/layout/LoadingSection";
import RegisterCompleteSection from "./components/RegisterCompleteSection";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/src/contexts/UserContext";
import { UserModel } from "@/src/models/UserModel";
import { createUserInService } from "@/src/services/userService";

export default function AddressInput() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, createUser, loginUser } = useUser();

  const [address] = useState(location.state?.address || "");
  const [addressDetail, setaddressDetail] = useState<string>("");
  const [visibleHeight, setVisibleHeight] = useState<number>(
    window.innerHeight
  );
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // name 불러오기
  const name = sessionStorage.getItem("name") || "";

  const handleOpenSearch = () => {
    navigate("/address-search");
  };
  
  const tryLogin = async (kakaoId: number) => {
    const responseData = await loginUser(kakaoId);
    // if (responseData)
    // console.log("로그인 시도 : ", responseData);
    console.log("회원가입 여부", responseData);
    if (responseData) navigate("/");
  };

  const handleConfirmButtonClick = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await createUser(user);
      setIsComplete(true);
      if (user.kakaoId !== null) {
        tryLogin(user.kakaoId);
      }
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      alert(`회원가입 실패 : ${error}`);
      setIsLoading(false);
    }
  };

  // 버튼 비활성화 조건
  const isButtonDisabled = !address || !addressDetail;

  useEffect(() => {
    if (address || addressDetail) {
      setUser(
        (prevUser) =>
          new UserModel({
            ...prevUser,
            fullAddress: address,
            addressDetail: addressDetail,
          })
      );
    }

    const handleResize = () => {
      if (window.visualViewport) {
        setVisibleHeight(window.visualViewport.height);
      }
    };
    window.visualViewport?.addEventListener("resize", handleResize);
    return () => {
      window.visualViewport?.addEventListener("resize", handleResize);
    };
  }, [address, addressDetail]);

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
            value={addressDetail}
            onChange={(e) => setaddressDetail(e.target.value)}
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
