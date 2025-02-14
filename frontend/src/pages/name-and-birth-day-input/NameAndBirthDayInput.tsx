import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";

export default function NameAndBirthDayInput() {
  const [step, setStep] = useState<number>(1); // 단계: ( 1: 이름 입력, 2: 번호 입력 )
  const [name, setName] = useState<string>("");
  const [phoneNum, setPhoneNum] = useState<string>("");
  const [birth, setBirth] = useState<string>("");

  // 키보드 높이 측정
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

    const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const keyboardVisible = viewportHeight < window.innerHeight;
        const newKeyboardHeight = window.innerHeight - viewportHeight;

        if (keyboardVisible) {
          setKeyboardHeight(newKeyboardHeight);
        } else {
          setKeyboardHeight(0);
        }
      }
    };

    window.visualViewport?.addEventListener("resize", handleResize);
    return () => {
      window.visualViewport?.addEventListener("resize", handleResize);
    };
  }, []);

  // 버튼 비활성화 조건
  const whenNameisNull = !name;

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

      <Flex direction="column" width="100%">
        {/* 생년월일 입력 (step 3) */}
        {step === 3 && (
          <>
            {birth && (
              <Text color="#747477" fontSize="1.4rem" mb="0.5rem">
                생년월일
              </Text>
            )}
            <Input
              height="auto"
              placeholder="생년월일"
              variant="flushed"
              color="white"
              _placeholder={{ color: "#46454a" }}
              width="100%"
              fontSize="2.2rem"
              pb="1rem"
              _focus={{ borderColor: "#00A36C" }}
              value={birth}
              onChange={handleBirthChange}
              maxLength={10}
            />
          </>
        )}
      </Flex>
      <Flex direction="column" width="100%" mt={step === 3 ? "4rem" : "0rem"}>
        {/* 휴대폰 입력 (step 2) */}
        {(step === 2 || step === 3) && (
          <>
            {phoneNum && (
              <Text color="#747477" fontSize="1.4rem" mb="0.5rem">
                휴대폰 번호
              </Text>
            )}
            <Input
              height="auto"
              placeholder="휴대폰 번호"
              variant="flushed"
              color="white"
              _placeholder={{ color: "#46454a" }}
              width="100%"
              fontSize="2.2rem"
              pb="1rem"
              _focus={{
                borderColor: "#00A36C",
              }}
              value={phoneNum}
              onChange={(e) => {
                const newValue = e.target.value.replace(/[^0-9]/g, "");
                setPhoneNum(newValue);
                if (newValue.length === 11) {
                  setStep(3);
                }
              }}
              maxLength={11}
            />
          </>
        )}
      </Flex>
      <Flex direction="column" width="100%" mt={step >= 2 ? "4rem" : "0rem"}>
        {/* 이름 입력 (step 1) */}
        {step === 2 ||
          (step === 3 && (
            <Text color="#747477" fontSize="1.4rem" mb="0.5rem">
              이름
            </Text>
          ))}
        <Input
          height="auto"
          placeholder="이름"
          variant="flushed"
          color="white"
          _placeholder={{ color: "#46454a" }}
          width="100%"
          fontSize="2.2rem"
          pb="1rem"
          _focus={{
            borderColor: "#00A36C",
          }}
          value={name}
          //   onFocus={handleFocus}
          //   onBlur={handleBlur}
          onChange={(e) => setName(e.target.value)}
        />
      </Flex>

      <Flex flexGrow="1" />

      {step === 1 || (step !== 2 && birth.length >= 10) ? (
        <Button
          width="100%"
          height="6rem"
          bg="#00A36C"
          color="white"
          borderRadius="1rem"
          fontSize="1.8rem"
          fontWeight="bold"
          bottom={`${keyboardHeight + 90}px`} // 맞겠지
          paddingX="2rem"
          _active={{ bg: "#154d3a" }}
          disabled={whenNameisNull}
          onClick={() => {
            if (step === 1) {
              setStep(2);
            } else if (step === 3) {
                navigate("/address-input")
            }
          }}
        >
          {step === 1 ? "다음" : "확인"}
        </Button>
      ) : null}
    </Flex>
  );
}
