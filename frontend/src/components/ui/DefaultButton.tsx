import styled from "@emotion/styled";

const Button = styled.button<{ isActive: boolean }>`
    background-color: #00A36C;
    border-radius: 1.2rem;
    width: 100%;
    height: 6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: ${({ isActive }) => (isActive ? 1 : 0.2)};
`;

const Text = styled.p`
    font-size: 1.8rem;
    font-weight: bold;
`;

type DefaultButtonProps = {
    event: () => void,
    isActive: boolean
}

export default function DefaultButton({ event, isActive }: DefaultButtonProps) {
    return (
        <Button onClick={isActive ? event : undefined} isActive={isActive}>
            <Text>
                확인
            </Text>
        </Button>
    )
}