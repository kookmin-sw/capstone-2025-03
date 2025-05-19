import CategoryProducts from './category-components/RandomCategory';
import MainBanner from './banner-components/MainBanner';
import styled from '@emotion/styled';
import Footer from '@/src/components/layout/MenuFooter';
import Joyride from 'react-joyride';
import { useEffect, useState } from 'react';
import {
    landingPageSteps,
    joyrideLocale,
    joyrideStyles,
} from '@/src/components/ui/ToolTipContents';

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

    const LOCAL_STORAGE_KEY = 'landingpage_tooltip_shown';

    // 개발 중일때
    localStorage.removeItem('landingpage_tooltip_shown');
    useEffect(() => {
        const alreadyShown = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (!alreadyShown) {
            const timer = setTimeout(() => {
                setIsReady(true);
                setRun(true);
                localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
            }, 300);
            return () => clearTimeout(timer);
        }
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
                    showSkipButton
                    showProgress={false}
                    locale={joyrideLocale}
                    styles={joyrideStyles}
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
