import React from 'react';
import styled from '@emotion/styled';

const SelectedButton = styled.button`
    background-color: #00a26c;
    border: none;
    padding: 1rem 5rem;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
`;

const DefaultButton = styled.button`
    background-color: #12332d;
    border: none;
    padding: 1rem 5rem;
    border-radius: 20px; /* 둥근 모양 */
    font-size: 16px;
    cursor: pointer;
`;

interface BasicButtonProps {
    isSelected: boolean;
    handleClick: (index: number) => void;
    elementIndex: number;
    content: string;
}

export default function BasicButton({
    isSelected,
    handleClick,
    elementIndex,
    content,
}: BasicButtonProps) {
    return (
        <>
            {isSelected ? (
                <SelectedButton onClick={() => handleClick(elementIndex)}>{content}</SelectedButton>
            ) : (
                <DefaultButton onClick={() => handleClick(elementIndex)}>{content}</DefaultButton>
            )}
        </>
    );
}
