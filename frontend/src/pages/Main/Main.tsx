import { Flex, Button } from "@chakra-ui/react";
import styles from "./Main.module.css";

const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const REDIRECT_URI = `${window.location.origin}/name-and-birth-day-input`;
export default function Main() {

  const handleKakaoLogin = () => {
    const kakoLiginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = kakoLiginUrl;
  };

  return (
    <Flex className={styles.page} flexDirection="column">
      <p className={styles.title}>안녕하세요</p>
      <Button bg={"white"} color={"black"} mt={10} onClick={handleKakaoLogin}>
        버튼
      </Button>
    </Flex>
  );
}