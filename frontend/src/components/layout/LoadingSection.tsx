import styled from "@emotion/styled";
import { Spinner } from "@chakra-ui/react"

const Section = styled.div`
    background-color: #18171D;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 5rem;
`;

const Text = styled.p`
    font-size: 1.8rem;
`;

export default function LoadingSection() {
    return (
        <Section>
            <Spinner color="#00A36C" borderWidth="0.6rem" animationDuration="0.8s" style={{width: '6rem', height: '6rem'}} />
            <Text>
                잠시만 기다려주세요
            </Text>
        </Section>
    )
}