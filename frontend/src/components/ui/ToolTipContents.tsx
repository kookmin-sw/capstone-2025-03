import { Step } from 'react-joyride';

export const landingPageSteps: Step[] = [
    {
        target: '#introduce',
        content: <div>restart 에 온 것을 환영합니다!🎉</div>,
        disableBeacon: true,
        placement: 'center',
    },
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
        placement: 'center',
    },
    {
        target: '#packege-recommend',
        content: (
            <div>
                <p>업종별로 패키지를 볼 수 있는 공간이에요</p>
                <p>더보기 버튼을 통해 모든 업종을 볼 수 있어요</p>
            </div>
        ),
        disableBeacon: true,
    },
    {
        target: '#category',
        content: (
            <div>
                <p>카테고리별로 물품들을 볼 수 있어요</p>
            </div>
        ),
        disableBeacon: true,
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
        placement: 'left',
    },
];

export const SellerPageAddProductSteps: Step[] = [
    {
        target: '#introduce',
        content: (
            <div>
                <p>물품 판매 화면에 오신것을 환영해요</p>
            </div>
        ),
        disableBeacon: true,
        placement: 'center',
    },
    {
        target: '#camera-button',
        content: (
            <div>
                <p>이미지는 최대 10장 까지만 업로드가 가능해요</p>
            </div>
        ),
        disableBeacon: true,
        placement: 'right',
    },
    {
        target: '#explanation',
        content: (
            <div>
                <p>물품에 대한 자세한 설명은</p>
                <p>AI가 가격예측을 하는데 많은 도움이 돼요</p>
            </div>
        ),
        disableBeacon: true,
        placement: 'right',
    },
];

export const PackageSteps: Step[] = [
    {
        target: '#introduce',
        content: (
            <div>
                <p>패키지를 구성하는 기본 구성상품이에요</p>
                <p>패키지는 편집이 가능해요!</p>
            </div>
        ),
        disableBeacon: true,
        placement: 'top',
    },
    {
        target: '#product-add',
        content: (
            <div>
                <p>+ 버튼을 통해 물건을 추가할 수 있어요</p>
            </div>
        ),
        disableBeacon: true,
        placement: 'left',
    },
    {
        target: '#delete-product',
        content: (
            <div>
                <p>✏️ 버튼을 통해 물건을 삭제할 수 있어요</p>
            </div>
        ),
        disableBeacon: true,
        placement: 'left',
    },
];

export const PackageDetailAddCategorySteps: Step[] = [
    {
        target: '#introduce',
        content: (
            <div>
                <p>추가하고 싶은 카테고리를 고르고</p>
                <p>하단의 버튼을 누르세요</p>
            </div>
        ),
        disableBeacon: true,
        placement: 'center',
    },
];

export const PackageDetailAddProductSteps: Step[] = [
    {
        target: '#introduce',
        content: (
            <div>
                <p>추가하고 싶은 물건들을 모두 고르고</p>
                <p>하단의 버튼을 누르세요</p>
            </div>
        ),
        disableBeacon: true,
        placement: 'center',
    },
];

export const CustomPackageSteps: Step[] = [
    {
        target: '#save',
        content: (
            <div>
                <p>변경 사항 저장 버튼을 눌러야</p>
                <p>저장이 완료되어요</p>
            </div>
        ),
        disableBeacon: true,
        placement: 'center',
    },
];
