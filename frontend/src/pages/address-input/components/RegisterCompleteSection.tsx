import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

const Section = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #18171e;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const HeadText = styled.p`
  font-size: 1.8rem;
  color: #a3a2a5;
  margin-bottom: 2rem;
`;

const MainText = styled.p`
  font-size: 2.6rem;
  font-weight: bold;
  text-align: center;
  color: white;
`;

interface CompleteSectionProps {
  text: string;
}

export default function RegisterCompleteSection({ text }: CompleteSectionProps) {
  const navigate = useNavigate();
  return (
    <Section>
      <HeadText>회원가입 완료!</HeadText>
      <MainText>
        {text}님,
        <br />
        환영합니다!
      </MainText>
    </Section>
  );
}
