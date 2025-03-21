import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const Button = styled.img`
    height: 2.4rem;
    cursor: pointer;
`;

export default function BackButtonForAddProduct() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/seller-saleslist');
    };

    return <Button src="/images/seller/arrow_back.png" onClick={handleClick} />;
}
