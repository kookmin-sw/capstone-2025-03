import styled from "@emotion/styled";
import DefaultButton from "../ui/DefaultButton";
import { useNavigate } from "react-router-dom";
import CompleteIconImage from "../../assets/images/section/check.png";

const Section = styled.div`
    background-color: #18171D;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Icon = styled.img`
  height: 6rem;
  width: 6rem;
  margin-bottom: 5rem;
`;

const Text = styled.p`
  font-size: 2.2rem;
  font-weight: bold;
  color: white;
`;

interface CompleteSectionProps {
  text: string;
}

export default function CompleteSection({ text }: CompleteSectionProps) {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/");
  };
  return (
    <Section>
      <Icon src={CompleteIconImage} />
      <Text>{text}</Text>
      <DefaultButton event={handleButtonClick} isActive={true} text="확인"/>
    </Section>
  );
}
