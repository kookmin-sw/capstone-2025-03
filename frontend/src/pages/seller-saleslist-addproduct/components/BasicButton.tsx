import styled from '@emotion/styled';

const StyledButton = styled.button<{ isSelected: boolean }>`
    background-color: ${(props) => (props.isSelected ? '#00a26c' : '#12332d')};
    border: none;
    padding: 1rem 5rem;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
`;

interface BasicButtonProps {
    isSelected: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

export default function BasicButton({ isSelected, onClick, children }: BasicButtonProps) {
    return (
        <StyledButton isSelected={isSelected} onClick={onClick}>
            {children}
        </StyledButton>
    );
}
