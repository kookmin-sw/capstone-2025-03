import introduceImage1 from '@/src/assets/images/introduce/intro-1.png';
import introduceImage2 from '@/src/assets/images/introduce/intro-2.jpg';
import introduceImage3 from '@/src/assets/images/introduce/intro-3.jpg';

export const IntroduceContents = [
    {
        id: 1,
        title: (
            <>
                좋은 거래를 하는
                <br /> RESTART의 첫 번째 기준
            </>
        ),
        // icon: <IntroduceIcon1 />,
        subTitle: '업종별 패키지화',
        description: `RESTART는 업종에 맞는 중고 패키지를 구성합니다. 
        창업자는 따로따로 찾지 않아도 되고, 폐업자는 물건을 한 번에 정리할 수 있습니다.`,
        image: introduceImage1,
    },
    {
        id: 2,
        title: (
            <>
                좋은 거래를 하는
                <br /> RESTART의 두 번째 기준
            </>
        ),
        // icon: <IntroduceIcon2 />,
        subTitle: '사용자의 상황에 맞춘 맞춤형 추천',
        description: `사용자의 업종, 예산을 반영하여 가장 적절한 패키지를 큐레이션합니다. 
        가볍게 시작하고 싶은 사람도, 규모 있는 창업을 준비하는 사람도 모두 환영합니다.`,
        image: introduceImage2,
    },
    {
        id: 3,
        title: (
            <>
                좋은 거래를 하는
                <br /> RESTART의 세 번째 기준
            </>
        ),
        // icon: <IntroduceIcon3 />,
        subTitle: '가격의 합리성과 투명성',
        description: `RESTART는 시세 기반의 AI 추천 가격을 제공합니다. 
        낮추기만 하는 가격이 아니라, 양쪽 모두가 납득할 수 있는 가격을 추구합니다.`,
        image: introduceImage3,
    },
] as const;
