import { Flex, Button, Image, Text, Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import styles from "./Main.module.css";

const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const REDIRECT_URI = `${window.location.origin}/name-and-birth-day-input`;

export default function Main() {
  const [visibleHeight, setVisibleHeight] = useState<number>(
    window.innerHeight
  );

  useEffect(() => {
    const handleResize = () => setVisibleHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [])

  console.log(KAKAO_REST_API_KEY);
  const handleKakaoLogin = () => {
    const kakoLiginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = kakoLiginUrl;
  };

  return (
    <Flex
      backgroundColor="#18171D"
      height="100vh"
      width="100vw"
      direction="column"
    >
      <Text
        color="white"
        fontSize="3.6rem"
        fontWeight="bold"
        pt="10rem"
        pl="3rem"
      >
        <span style={{ color: "#01a26c" }}>리스타트</span>에서 <br /> 창업부터
        폐업까지
      </Text>

      <Flex
        paddingX="2rem"
        pt="1rem"
        align="center"
        bg="#18171D"
        direction="column"
        justify="space-between"
        overflow="hidden"
        overflowY="hidden"
      >
        <Text color="white" fontSize="1.8rem" paddingX="1rem">
          AI가 창업자에게 필요한 물건들을 패키지로 만들어서 한번에 집으로
          보내줘요
        </Text>
        <Image
          src="iPhone 12 Pro Max.png"
          alt="휴대폰 이미지"
          objectFit="contain"
          boxSize="58rem"
          mt="9.5rem"
        />
        <Box
          position="fixed"
          bottom="0rem"
          width="100%"
          height={`${visibleHeight * 0.16}px`} // 그라데이션 높이 조절
          backgroundImage="linear-gradient(to bottom, rgba(24,23,29,0) 0%, rgba(24,23,29,0.9) 15%, #18171D 30%, #18171D 100%)"
          pointerEvents="none"
        />
        <Button
          position="fixed"
          width="calc(100% - 4rem)"
          height="6rem"
          bg="#FEE500"
          color="black"
          borderRadius="1rem"
          fontSize="1.8rem"
          fontWeight="bold"
          top={`calc(${visibleHeight}px - 6rem - 2rem)`} // 맞겠지
          _active={{ bg: "#fecf00" }}
          onClick={handleKakaoLogin}
        >
          <Flex alignItems="center">
            <Image
              src="kakaoIcon.png"
              alt="카카오 아이콘"
              boxSize="2.5rem"
              position="absolute"
              objectFit="contain"
              left="2rem"
            />
            <Text>카카오 로그인</Text>
          </Flex>
        </Button>
      </Flex>
    </Flex>
  );
}
