import CategoryProducts from './category-components/RandomCategory';
import MainBanner from './banner-components/MainBanner';
import styled from '@emotion/styled';
import Footer from '@/src/components/layout/MenuFooter';
import Joyride from 'react-joyride';
import { useEffect, useState } from 'react';

const PageContainer = styled.div`
    min-height: 100vh;
    height: 100%;
    padding-bottom: 6rem;
    background-color: #101012;
`;

export default function LandingPage() {
    const currentMenuIndex = 0;

    const [run, setRun] = useState<boolean>(false); // 투어 실행 여부
    const [isReady, setIsReady] = useState<boolean>(false);

    const steps = [
        {
            target: '.main-banner-step',
            content: '여기는 메인 배너입니다!',
            disableBeacon: true,
        },
        {
            target: '.category-products-step',
            content: '이건 랜덤 카테고리 상품 영역이에요!',
            disableBeacon: true,
        },
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsReady(true);
            setRun(true);
        }, 300); // 약간의 delay를 줘서 DOM이 모두 준비되도록 함
        return () => clearTimeout(timer);
    }, []);

    return (
        <PageContainer>
            <Joyride
                steps={steps}
                run={run}
                continuous
                scrollToFirstStep
                showProgress
                showSkipButton
                styles={{
                    options: {
                        zIndex: 9999,
                    },
                }}
            />

            <MainBanner />

            <div>
                <CategoryProducts />
            </div>
            <Footer currentMenuIndex={currentMenuIndex} />
        </PageContainer>
    );
}
