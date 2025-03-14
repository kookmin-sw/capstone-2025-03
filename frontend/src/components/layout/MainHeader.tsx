import styled from "@emotion/styled";
import LogoImage from "../../assets/images/header/logo.png";
import NotificationIconImage from "../../assets/images/header/notification_icon.png";

const Header = styled.div`
    background-color: #101012;
    position: fixed;
    top: 0;
    width: 100%;
    padding: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
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

export default function MainHeader() {
    return (
        <Header>
            <Logo src={LogoImage} />
            <Blank />
            <Icon src={NotificationIconImage} />
        </Header>
    )
}