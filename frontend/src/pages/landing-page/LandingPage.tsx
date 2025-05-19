import CategoryProducts from './category-components/RandomCategory';
import MainBanner from './banner-components/MainBanner';
import styled from '@emotion/styled';
import Footer from '@/src/components/layout/MenuFooter';
import Joyride from 'react-joyride';
import { useEffect, useState } from 'react';
import { landingPageSteps } from '@/src/components/ui/ToolTipContents';

const PageContainer = styled.div`
    min-height: 100vh;
    height: 100%;
    padding-bottom: 6rem;
    background-color: #101012;
`;

export default function LandingPage() {
    const currentMenuIndex = 0;

    const [run, setRun] = useState<boolean>(false);
    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsReady(true);
            setRun(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div id="introduce">
            <PageContainer id="last">
                <Joyride
                    steps={landingPageSteps}
                    run={run}
                    continuous
                    // scrollToFirstStep
                    disableScrolling
                    showProgress
                    showSkipButton
                    styles={{
                        options: {
                            zIndex: 9999,
                        },
                    }}
                />
                <div id="main-banner-step">
                    <MainBanner />
                </div>
                <CategoryProducts />

                <Footer currentMenuIndex={currentMenuIndex} />
            </PageContainer>
        </div>
    );
}
