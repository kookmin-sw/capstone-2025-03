import CategoryProducts from './category-components/RandomCategory';
import MainBanner from './banner-components/MainBanner';
import styled from '@emotion/styled';
import Footer from '@/src/components/layout/MenuFooter';
import Joyride, { Step } from 'react-joyride';
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

    const steps: Step[] = [
        {
            target: '.main-banner-step',
            content: (
                <div>
                    <p>메인 배너입니다!</p>
                    <p>클릭하면 restart 소개를 볼 수 있어요.</p>
                </div>
            ),
            disableBeacon: true,
        },
        {
            target: '.category-products-step',
            content: (
                <div>
                    restart 의 여러 상품들을 만나보세요!
                </div>
            ),
            disableBeacon: true,
        },
        {
            target: '.refresh-new-product',
            content: (
                <div>
                    새로고침을 누르면 
                    <p>랜덤으로 새로운 상품을 보실 수 있어요!</p>
                </div>
            ),
            disableBeacon: true,
        },
        {
            target: '.last',
            content: (
                <div>
                    그러면 restart 에서 즐거운 구매 하세요🤑
                </div>
            ),
            disableBeacon: true,
            placement: "center",
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
        <PageContainer className='last'>
            <Joyride
                steps={steps}
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
            <div className="main-banner-step">
                <MainBanner />
            </div>
            <CategoryProducts />

            <Footer currentMenuIndex={currentMenuIndex} />
        </PageContainer>
    );
}
