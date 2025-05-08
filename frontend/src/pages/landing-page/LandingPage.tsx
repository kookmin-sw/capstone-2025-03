import CategoryProducts from './category-components/RandomCategory';
import MainBanner from './banner-components/MainBanner';
import styled from '@emotion/styled';

const PageContainer = styled.div`
    min-height: 100vh;
    height: 100%;
    padding-bottom: 6rem;
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
