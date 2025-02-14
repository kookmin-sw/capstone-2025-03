import { Flex, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import styles from "./Main.module.css";

export default function Main() {
    const navigate = useNavigate();
    return (
      <Flex className={styles.page} flexDirection="column">
        <p className={styles.title}>안녕하세요</p>
        <Button
          bg={"white"}
          color={"black"}
          mt={10}
          onClick={() => navigate("name-and-birth-day-input")}
        >
          버튼
        </Button>
      </Flex>
    );
  }