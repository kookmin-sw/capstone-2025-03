import CategoryProducts from './category-components/RandomCategory';
import MainBanner from './banner-components/MainBanner';
import styled from '@emotion/styled';

const PageContainer = styled.div`
    height: 100vh;
    paddingbottom: '8rem';
    background-color: #101012;

`;

export default function LandingPage() {
    return (
        <PageContainer>
            <MainBanner />
            <CategoryProducts />
        </PageContainer>
    );
}
