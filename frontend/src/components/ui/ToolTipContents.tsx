import { Step } from 'react-joyride';

export const landingPageSteps: Step[] = [
    {
        target: '#main-banner-step',
        content: (
            <div>
                <p>메인 배너입니다!</p>
                <p>클릭하면 restart 소개를 볼 수 있어요.</p>
            </div>
        ),
        disableBeacon: true,
    },
    {
        target: '#category-products-step',
        content: <div>restart 의 여러 상품들을 만나보세요!</div>,
        disableBeacon: true,
    },
    {
        target: '#refresh-new-product',
        content: (
            <div>
                새로고침을 누르면
                <p>랜덤으로 새로운 상품을 보실 수 있어요!</p>
            </div>
        ),
        disableBeacon: true,
    },
    {
        target: '#last',
        content: <div>그러면 restart 에서 즐거운 구매 하세요🤑</div>,
        disableBeacon: true,
        placement: 'center',
    },
];

export const recommendPageSteps: Step[] = [
    {
        target: '#introduce',
        content: (
            <div>
                <p>추천 페이지에 온 것을 환영합니다!</p>
            </div>
        ),
        disableBeacon: true,
        placement: "center"
    },
    {
        target: '#packege-recommend',
        content: (
            <div>
                <p>업종별로 볼 수 있는 공간이에요</p>
                <p>더보기 버튼을 통해 모든 업종을 볼 수 있어요</p>
            </div>
        ),
        disableBeacon: true,
    },
    {
        target: '#see-more',
        content: (
            <div>
                <p>더보기 버튼을 통해 모든 업종을 볼 수 있어요</p>
            </div>
        ),
        disableBeacon: true,
        placement: "left"
    },
    {
        target: '#all-package',
        content: (
            <div>
                <p>모든 패키지를 볼 수 있는 공간이에요</p>
            </div>
        ),
        disableBeacon: true,
    },
    {
        target: '#heart-button',
        content: (
            <div>
                <p>찜 버튼이에요</p>
                <p>찜을 한 패키지는 찜 목록에서 볼 수 있어요</p>
            </div>
        ),
        disableBeacon: true,
        placement: "left"
    },
];
