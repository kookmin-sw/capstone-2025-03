import styled from '@emotion/styled';
import Empty from '../../../assets/images/page/add-product/Empty.png';
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const MainImage = styled.img`
    width: 24rem;
`;

const SubText = styled.p`
    font-size: 2rem;
    font-weight: 600;
`;

export default function WhenNoProducts() {
    return (
        <Container>
            <MainImage src={Empty} />
            <SubText>판매중인 물건이 없어요.</SubText>
        </Container>
    );
}
