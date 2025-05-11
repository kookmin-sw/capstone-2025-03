import styled from '@emotion/styled';
import LogoImage from '../../assets/images/header/logo.png';
import NotificationIconImage from '../../assets/images/header/notification_icon.png';

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
`;

const handleClickNotificationButton = () => {
    window.alert('준비 중입니다!');
};

export default function MainHeader({ isVisible }: { isVisible: boolean }) {
    return (
        <Header isVisible={isVisible}>
            <Logo src={LogoImage} />
            <Blank />
            <Icon src={NotificationIconImage} onClick={handleClickNotificationButton} />
        </Header>
    );
}
