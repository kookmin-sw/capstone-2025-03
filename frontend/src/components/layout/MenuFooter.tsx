import styled from "@emotion/styled";
import MenuHomeIconImage from "../../assets/images/footer/menu_home_icon.png";
import MenuHomeIconSelectedImage from "../../assets/images/footer/menu_home_icon_selected.png";
import MenuSellIconImage from "../../assets/images/footer/menu_sell_icon.png";
import MenuSellIconSelectedImage from "../../assets/images/footer/menu_sell_icon_selected.png";

const Footer = styled.div`
    height: 6rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #18171D;
    border-radius: 0.8rem 0.8rem 0 0;
    border-top: 1px solid #646464;
    padding: 0.8rem 2rem
`;

const Menu = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    flex: 1;
`;

const Icon = styled.img`
    height: 60%;
`;

const Text = styled.p`
    font-size: 1rem;
`;

type MenuFooterProps = {
    currentMenuIndex: number
}

type MenuItem = {
    text: string,
    icon: string,
    iconSelected: string
}

export default function MenuFooter({ currentMenuIndex }: MenuFooterProps) {
    const menus: MenuItem[] = [
        {
            text: '홈',
            icon: MenuHomeIconImage,
            iconSelected: MenuHomeIconSelectedImage
        },
        {
            text: '판매',
            icon: MenuSellIconImage,
            iconSelected: MenuSellIconSelectedImage
        }
    ]

    return (
        <Footer>
            {menus.map((menu, index) => {
                return (
                    <Menu key={index}>
                        <Icon src={index == currentMenuIndex ? menu.iconSelected : menu.icon} />
                        <Text>
                            {menu.text}
                        </Text>
                    </Menu>
                )
            })}
        </Footer>
    )
}