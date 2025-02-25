import styles from "./NameAndBirthDayInput.module.css";
import InputField from "./components/InputField";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getKakaoAccessToken,
  getKakaoUserInfo,
  registerUser,
} from "@/src/services/userService";


export default function NameAndBirthDayInput() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // const [email, setEmail] = useState<string>();
  const [step, setStep] = useState<number>(1); // 단계: ( 1: 이름 입력, 2: 번호 입력 )
  const [name, setName] = useState<string>("");
  const [phoneNum, setPhoneNum] = useState<string>("");
  const [birth, setBirth] = useState<string>("");
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);
  const [visibleHeight, setVisibleHeight] = useState<number>(
    window.innerHeight
  );
  const code = searchParams.get("code");

  // 버튼 비활성화 조건
  const whenNameisNull = !name;

  // 단계별 텍스트
  const stepText = {
    1: "이름을 입력해주세요",
    2: "휴대폰 번호를 입력해주세요",
    3: "생년월일을 입력해주세요",
  }[step];

  // 액세스 토큰으로 사용자 정보 가져옴
  useEffect(() => {
    // 세션스토리지에 이름 저장
    if (name) {
      sessionStorage.setItem("name", name);
    }

    if (code) {
      getKakaoAccessToken(code)
        .then((accessToken) => {
          console.log("액세스 토큰: ", accessToken);

          return getKakaoUserInfo(accessToken);
        })
        .then((response) => {
          console.log("사용자 정보: ", response);
          setName(response.nickname);
          // setEmail(response.email);
        })
        .catch((error) => console.error("카카오 로그인 오류:", error));
    }
    const handleResize = () => {
      if (window.visualViewport) {
        setVisibleHeight(window.visualViewport.height);
        setIsKeyboardOpen(window.innerHeight > window.visualViewport.height);
      }
    };
    window.visualViewport?.addEventListener("resize", handleResize);
    return () => {
      window.visualViewport?.addEventListener("resize", handleResize);
    };
  }, [code, name]);

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
    setBirth(formattedValue);
  };

  const handleRegister = async () => {
    try {
      const requestData = {
        username: name,
        email: null,
        password: "1234",
      };
      const responseData = registerUser(requestData);
      console.log(responseData);
      console.log("dddd");
    } catch (error) {
      console.log(error);
    }
  };

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
            value={birth}
            onChange={handleBirthChange}
            maxLength={10}
          />
        )}
        {(step === 2 || step === 3) && (
          <InputField
            label="휴대폰 번호"
            placeholder="휴대폰 번호"
            value={phoneNum}
            onChange={(e) => {
              const newValue = e.target.value.replace(/[^0-9]/g, "");
              setPhoneNum(newValue);
              if (newValue.length === 11) setStep(3);
            }}
            maxLength={11}
          />
        )}
        <InputField
          label="이름"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={styles.grow} />

      {step === 1 || (step !== 2 && birth.length >= 10) ? (
        <button
          className={styles.button}
          disabled={whenNameisNull}
          style={{ top: `calc(${visibleHeight}px - 6rem - 2rem)` }}
          onClick={() => {
            if (step === 1) {
              setStep(2);
            } else if (step === 3) {
              handleRegister();
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
