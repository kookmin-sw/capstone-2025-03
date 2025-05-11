import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

type MoreCardProps = {
    categoryId: number;
    thumbnail: string;
    name: string;
    grade: string;
    price: number;
};

const Card = styled.div`
    margin-top: 3rem;
    min-width: 8rem;
    height: 14rem;
    margin-right: 4rem;
    background-color: #18171d;
    color: white;
    border-radius: 1.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    cursor: pointer;
`;

const Text = styled.p`
    margin-top: 2rem;
    font-size: 1.5rem;
    margin-left: 3rem;
`;

export default function MoreCard({
    categoryId,
    thumbnail,
    name,
    grade,
    price,
}: MoreCardProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/category/${categoryId}`);
    };

    return (
        <Card onClick={handleClick}>
            <img src={thumbnail} />
            <Text>더보기</Text>
        </Card>
    );
    // <Card onClick={handleClick}>전체 보기 →</Card>
}
