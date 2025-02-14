import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AddressInput() {
  const navigate = useNavigate();
  const location = useLocation();
  const [address] = useState(location.state?.address || "");
  const [detailAddress, setDetailAddress] = useState("");

  const handleOpenSearch = () => {
    navigate("/address-search");
  };

  // 버튼 비활성화 조건
  const isButtonDisabled = !address || !detailAddress;

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
        // ml="4rem"
        mt="10rem"
        mb="4rem"
      >
        배송을 위한 <br /> 주소를 입력해주세요
      </Text>

      {/* 상세 주소 */}
      {address && (
        <Flex
          direction="column"
          width="100%"
          mt="1rem"
          pb="4rem"
        >
          <Text color="#747477" fontSize="1.4rem" mb="0.5rem">
            상세 주소
          </Text>
          <Input
            height="auto"
            // maxWidth="35rem"
            placeholder="주소"
            variant="flushed"
            color="white"
            _placeholder={{ color: "#46454a" }}
            width="100%"
            fontSize="2.2rem"
            pb="1rem"
            _focus={{
              borderColor: "#00A36C",
            }}
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
          />
        </Flex>
      )}

      {/* 주소 입력 */}
      <Flex direction="column" width="100%">
        {address && (
          <Text color="#747477" fontSize="1.4rem" mb="0.5rem">
            주소
          </Text>
        )}
        <Input
          height="auto"
          placeholder="주소"
          variant="flushed"
          color="white"
          _placeholder={{ color: "#46454a" }}
          width="100%"
          fontSize="2.2rem"
          pb="1rem"
          _active={{
            borderColor: "#00A36C",
          }}
          readOnly
          onClick={handleOpenSearch}
          value={address}
        />
      </Flex>

      <Flex flexGrow="1" />

      {/* 확인 */}
      <Button
        width="100%"
        height="6rem"
        bg="#00A36C"
        color="white"
        borderRadius="1rem"
        fontSize="1.8rem"
        fontWeight="bold"
        bottom="9rem"
        paddingX="2rem"
        _active={{ bg: "#154d3a" }}
        disabled={isButtonDisabled}
      >
        확인
      </Button>
    </Flex>
  );
}
