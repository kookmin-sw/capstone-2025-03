import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Flex, Text } from "@chakra-ui/react";
import {
  getKakaoAccessToken,
  getKakaoUserInfo,
  registerUser,
} from "@/src/services/userService";

import InputField from "./components/InputField";
import "react-datepicker/dist/react-datepicker.css";

export default function NameAndBirthDayInput() {
  const [searchParams] = useSearchParams();
  // const [email, setEmail] = useState<string>();
  const [step, setStep] = useState<number>(1); // 단계: ( 1: 이름 입력, 2: 번호 입력 )
  const [name, setName] = useState<string>("");
  const [phoneNum, setPhoneNum] = useState<string>("");
  const [birth, setBirth] = useState<string>("");
  const [visibleHeight, setVisibleHeight] = useState<number>(
    window.innerHeight
  );
  const code = searchParams.get("code");
  const navigate = useNavigate();

  // 버튼 비활성화 조건
  const whenNameisNull = !name;

  // 액세스 토큰으로 사용자 정보 가져옴
  useEffect(() => {
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
      }
    };
    window.visualViewport?.addEventListener("resize", handleResize);
    return () => {
      window.visualViewport?.addEventListener("resize", handleResize);
    };
  }, [code]);
  console.log(name);

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
      console.log(responseData)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex
      height="100vh"
      width="100vw"
      paddingX="2rem"
      align="center"
      bg="#18171D"
      direction="column"
      justify="space-between"
      overflow="hidden"
      overflowY="hidden"
    >
      {/* 문구 */}
      <Text
        color="white"
        fontSize="2.4rem"
        fontWeight="bold"
        textAlign="left"
        width="100%"
        mt="10rem"
        mb="4rem"
      >
        {step === 1
          ? "이름을 입력해주세요"
          : step === 2
          ? "휴대폰 번호를 입력해주세요"
          : "생년월일을 입력해주세요"}
      </Text>

      {/* 입력 필드 */}
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

      <Flex flexGrow="1" />

      {step === 1 || (step !== 2 && birth.length >= 10) ? (
        <Button
          position="fixed"
          width="calc(100% - 4rem)"
          height="6rem"
          bg="#00A36C"
          color="white"
          borderRadius="1rem"
          fontSize="1.8rem"
          fontWeight="bold"
          top={`calc(${visibleHeight}px - 6rem - 2rem)`} // 맞겠지
          _active={{ bg: "#154d3a" }}
          disabled={whenNameisNull}
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
        </Button>
      ) : null}
    </Flex>
  );
}
