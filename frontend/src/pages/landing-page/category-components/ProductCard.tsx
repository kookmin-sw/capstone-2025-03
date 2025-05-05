import React from 'react';
import styled from '@emotion/styled';

type ProductCardProps = {
    image: string;
    name: string;
    grade: string;
    price: string;
};

const Card = styled.div`
    display: flex;
    min-width: 14rem;
    flex-direction: column;
    background-color: #18171d;
    overflow: hidden;
    gap: 1.2rem,
`;

const Image = styled.img`
    height: 14rem;
    width: 14rem;
    object-fit: cover;
`;

const Name = styled.p`
    font-weight: 600;
    margin: 0.6rem 0 0.4rem;
    font-size: 1.4rem;
`;

const Info = styled.p`
    font-size: 1.2rem;
    color: #666;
`;

export default function ProductCard({ image, name, grade, price }: ProductCardProps) {
    return (
        <Card>
            <Image src={image} alt={name} />
            <Name>{name}</Name>
            <Info>
                {grade} / {Number(price).toLocaleString()}원
            </Info>
        </Card>
    );
}
