import styles from "./NameAndBirthDayInput.module.css";
import InputField from "./components/InputField";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getKakaoAccessToken,
  getKakaoUserInfo,
} from "@/src/services/userService";
import { UserModel } from "@/src/models/UserModel";
import { useUser } from "@/src/contexts/UserContext";

export default function NameAndBirthDayInput() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [step, setStep] = useState<number>(1); // 단계: ( 1: 이름 입력, 2: 번호 입력 )
  const [visibleHeight, setVisibleHeight] = useState<number>(
    window.innerHeight
  );

  // 버튼 비활성화 조건
  const whenNameisNull = !user?.name;

  // 단계별 텍스트
  const stepText = {
    1: "이름을 입력해주세요",
    2: "휴대폰 번호를 입력해주세요",
    3: "생년월일을 입력해주세요",
  }[step];

  // 액세스 토큰으로 사용자 정보 가져옴
  useEffect(() => {
    setUser(
      (prevUser) =>
        new UserModel({
          ...prevUser,
          kakaoEmail: "example@example.com",
          createDate: new Date().toISOString(),
        })
    );
    // 세션스토리지에 이름 저장
    if (user?.name) {
      sessionStorage.setItem("name", user.name);
    }

    if (code) {
      getKakaoAccessToken(code)
        .then((accessToken) => {
          console.log("액세스 토큰: ", accessToken);

          return getKakaoUserInfo(accessToken);
        })
        .then((response) => {
          console.log("사용자 정보: ", response);
          setUser(
            (prevUser) =>
              new UserModel({ ...prevUser, name: response.nickname })
          );
          // setKakaoEmail(response.email);
        })
        .catch((error) => console.error("카카오 로그인 오류:", error));
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
  }, [code, user?.name]);

  const handleBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    let formattedValue = "";

    if (value.length <= 4) {
      formattedValue = value;
    } else if (value.length <= 6) {
      formattedValue = `${value.slice(0, 4)}-${value.slice(4, 6)}`;
    } else {
      formattedValue = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(
        6,
        8
      )}`;
    }
    setUser(
      (prevUser) => new UserModel({ ...prevUser, birthDate: formattedValue })
    );
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.replace(/[^0-9]/g, "");

    if (newValue.length >= 7) {
      newValue = `${newValue.slice(0, 3)}-${newValue.slice(
        3,
        7
      )}-${newValue.slice(7)}`;
    } else if (newValue.length >= 4) {
      newValue = `${newValue.slice(0, 3)}-${newValue.slice(3)}`;
    }
    setUser(
      (prevUser) => new UserModel({ ...prevUser, phoneNumber: newValue })
    );
    if (newValue.length === 13) setStep(3);
  };

  console.log(user);

  return (
    <div className={styles.page}>
      {/* 문구 */}
      <p className={styles.heading}>{stepText}</p>

      {/* 입력 필드 */}
      <div className={styles.inputWrapper}>
        {step === 3 && (
          <InputField
            label="생년월일"
            placeholder="생년월일"
            value={user?.birthDate || ""}
            onChange={handleBirthChange}
            maxLength={10}
          />
        )}
        {(step === 2 || step === 3) && (
          <InputField
            label="휴대폰 번호"
            placeholder="휴대폰 번호"
            value={user?.phoneNumber || ""}
            onChange={handlePhoneNumberChange}
            maxLength={13}
          />
        )}
        <InputField
          label="이름"
          placeholder="이름"
          value={user?.name || ""}
          onChange={(e) =>
            setUser(
              (prevUser) => new UserModel({ ...prevUser, name: e.target.value })
            )
          }
        />
      </div>

      <div className={styles.grow} />

      {step === 1 ||
      (step !== 2 && user?.birthDate && user.birthDate.length >= 10) ? (
        <button
          className={styles.button}
          disabled={whenNameisNull}
          style={{ top: `calc(${visibleHeight}px - 6rem - 2rem)` }}
          onClick={() => {
            if (step === 1) {
              setStep(2);
            } else if (step === 3) {
              // handleRegister();
              navigate("/address-input");
            }
          }}
        >
          {step === 1 ? "다음" : "확인"}
        </button>
      ) : null}
    </div>
  );
}
