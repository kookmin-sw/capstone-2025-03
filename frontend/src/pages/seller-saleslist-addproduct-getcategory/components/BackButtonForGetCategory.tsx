import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const Button = styled.img`
    height: 2.4rem;
    margin-left: 2rem;
    cursor: pointer;
`;

export default function BackButtonForGetCategory() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/seller-saleslist-addproduct', {
            state: { prevPath: '/seller-saleslist-addproduct-getcategory' },
        });
    };

    return <Button src="/images/seller/arrow_back.png" onClick={handleClick} />;
}
