import { Button, Image, Text, Box } from "@chakra-ui/react";
import styles from "./Main.module.css";

const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const REDIRECT_URI = `${window.location.origin}/name-and-birth-day-input`;


export default function Main() {
  console.log(REDIRECT_URI);
  console.log(KAKAO_REST_API_KEY);
  const handleKakaoLogin = () => {
    const kakoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = kakoLoginUrl;
  };


  return (
    <div className={styles.mainContainer}>
      <Text className={styles.mainText}>
        <span className={styles.highlightText}>리스타트</span>에서 <br />{" "}
        창업부터 폐업까지
      </Text>

      <Text className={styles.subText}>
        AI가 창업자에게 필요한 물건들을 패키지로 만들어서 한번에 집으로 보내줘요
      </Text>

      <Image
        src="/src/assets/images/page/Main/iPhone 12 Pro Max.png"
        alt="휴대폰 이미지"
        className={styles.imageContainer}
      />

      <Box className={styles.gradientBox} />

      <Button className={styles.kakaoLoginButton} onClick={handleKakaoLogin}>
        <Image
          src="/src/assets/images/page/Main/kakaoIcon.png"
          alt="카카오 아이콘"
          className={styles.kakaoIcon}
        />
        <Text>카카오 로그인</Text>
      </Button>
    </div>
  );
}
