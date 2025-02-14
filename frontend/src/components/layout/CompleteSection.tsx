import styled from "@emotion/styled";
import DefaultButton from "../ui/DefaultButton";
import { useNavigate } from "react-router-dom";
import CompleteIconImage from "../../assets/images/section/check.png";

const Section = styled.div`
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
`;

const ButtonContainer = styled.div`
    width: 100%;
    padding: 2rem;
    position: fixed;
    bottom: 0;
`;

export default function CompleteSection() {
    const navigate = useNavigate();
    const handleButtonClick = () => {
        navigate('/');
    }
    return (
        <Section>
            <Icon src={CompleteIconImage} />
            <Text>
                패키지 구매 신청 완료!
            </Text>
            <ButtonContainer>
                <DefaultButton event={handleButtonClick} isActive={true} />
            </ButtonContainer>
        </Section>
    )
}