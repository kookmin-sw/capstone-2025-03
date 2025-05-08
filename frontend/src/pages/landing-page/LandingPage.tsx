import CategoryProducts from './category-components/RandomCategory';
import MainBanner from './banner-components/MainBanner';
import styled from '@emotion/styled';
import Footer from '@/src/components/layout/MenuFooter';

const PageContainer = styled.div`
    min-height: 100vh;
    height: 100%;
    padding-bottom: 6rem;
    background-color: #101012;

`;

export default function LandingPage() {
    const currentMenuIndex = 0;

    return (
        <PageContainer>
            <MainBanner />
            <CategoryProducts />
            <Footer currentMenuIndex={currentMenuIndex} />
        </PageContainer>
    );
}
