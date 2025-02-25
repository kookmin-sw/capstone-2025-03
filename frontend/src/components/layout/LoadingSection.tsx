import styled from "@emotion/styled";
import { Spinner } from "@chakra-ui/react";

const Section = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #18171e;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5rem;
`;

const Text = styled.p`
  font-size: 1.8rem;
  color: #a3a2a5;
`;

interface LoadingSectionProps {
  text: string;
}

export default function LoadingSection({ text }: LoadingSectionProps) {
  return (
    <Section>
      <Spinner
        color="#00A36C"
        borderWidth="0.6rem"
        animationDuration="0.8s"
        style={{ width: "6rem", height: "6rem" }}
      />
      <Text>{text}</Text>
    </Section>
  );
}
