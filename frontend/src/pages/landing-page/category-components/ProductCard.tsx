import React from 'react';
import styled from '@emotion/styled';

type ProductCardProps = {
    image: string;
    name: string;
    grade: string;
    price: string;
};

const Card = styled.div`
    min-width: 15rem;
    background-color: #18171d;
    border-radius: 1.2rem;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    padding: 1.2rem;
`;

const Image = styled.img`
    height: 12rem;
    width: 12rem;
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
