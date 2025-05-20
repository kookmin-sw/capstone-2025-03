import styled from '@emotion/styled';
import LogoImage from '../../assets/images/header/logo.png';
import { Navigate, useNavigate } from 'react-router-dom';

const Header = styled.div<{ isVisible: boolean }>`
    background-color: #101012;
    position: fixed;
    top: 0;
    width: 100%;
    max-width: 500px;
    padding: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: ${(props) => (props.isVisible ? '100px' : '0')};
    opacity: ${(props) => (props.isVisible ? '1' : '0')};
    transition:
        height 0.3s ease,
        opacity 0.3s ease;
`;

const Logo = styled.img`
    width: 9.1rem;
`;

const Blank = styled.div`
    flex-grow: 1;
`;

const Icon = styled.img`
    width: 3.2rem;
    border-radius: 1.6rem;
`;


const handleClickNotificationButton = () => {
    // window.alert('준비 중입니다!');
};

export default function MainHeader({ isVisible }: { isVisible: boolean }) {
    const navigate = useNavigate();

    const handleClickNotificationButton = () => {
        navigate('/profile');
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const profileImage = user?.profile_image;

    return (
        <Header isVisible={isVisible}>
            <Logo src={LogoImage} />
            <Blank />
            <Icon src={profileImage} onClick={handleClickNotificationButton} />
        </Header>
    );
}
