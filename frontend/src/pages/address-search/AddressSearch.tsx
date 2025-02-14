import { useEffect, useRef } from "react";
import { Flex, Box, Text, Button, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    daum: any;
  }
}

export default function AddressSearch() {
  const navigate = useNavigate();
  const postcodeRef = useRef<HTMLDivElement | null>(null);
  const isScriptLoaded = useRef(false);

  useEffect(() => {
    if (isScriptLoaded.current) return;
    isScriptLoaded.current = true;

    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (postcodeRef.current) {
        const postcode = new window.daum.Postcode({
          oncomplete: (data: { address: string }) => {
            console.log("선택한 주소:", data.address);
            navigate("/address-input", { state: { address: data.address } });
          },
          width: "100%",
          height: "100%",
        });

        postcode.embed(postcodeRef.current);
      }
    };
  }, []);

  return (
    <Flex
      height="100%"
      width="100%"
      bg="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      top="0"
      left="0"
      overflow="hidden"
    >
      {/* <Box>
      <Button
        position="absolute"
        top="3.3rem"
        left="0rem"
        size="lg"
        color="white"
        bg="white"
        onClick={() => navigate(-1)}
      >
        <Image src="src/assets/images/chevron-left.svg" boxSize="30px" />
      </Button>
      </Box>
      <Text position="absolute" fontWeight="bold" fontSize="24px" top="3.3rem">
        주소 검색
      </Text> */}
      <Flex
        direction="row"
        align="center"
        justify="space-between"
        pt="2rem"
        pb="2rem"
      >
        <Button
          color="white"
          bg="white"
          onClick={() => navigate(-1)}
          padding="0rem"
        >
          <Image src="src/assets/images/chevron-left.svg" boxSize="3rem" />
        </Button>

        <Text fontWeight="bold" fontSize="24px" whiteSpace="nowrap" pl="11rem" pr="11rem">
          주소 검색
        </Text>

        <Box width="40px"/>
      </Flex>

      <Box ref={postcodeRef} width="100vw" height="100vh" />
    </Flex>
  );
}
