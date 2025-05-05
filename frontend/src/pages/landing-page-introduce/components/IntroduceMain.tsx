import introduceImage1 from '@/src/assets/images/introduce/intro-main.jpg';
import {
    IntroMainImage,
    IntroMainSubTitle,
    IntroMainTitle,
    IntroMainDescription,
    IntroMainContainer
} from './Introduce.css';

export default function IntroduceMain() {
    return (
        <IntroMainContainer>
            <IntroMainTitle>
                RESTART는 창업과 폐업 사이의<br />공백을 연결하는 플랫폼입니다.
            </IntroMainTitle>

            <IntroMainImage
                width="500"
                height="500"
                alt="메인 소개 페이지 대표 이미지"
                src={introduceImage1}
            />

            <IntroMainSubTitle>
                버려지는 물건을
                <br /> 다시 시작하는 사람에게
            </IntroMainSubTitle>
            <IntroMainDescription>
                수많은 창업자가 창업 준비로 물건을 직접 찾고, 폐업자는 힘겹게 낱개로 물건을 처리합니다.
                RESTART는 이 공백을 연결해, 양쪽 모두에게 의미 있는 거래를 만들어줍니다.
            </IntroMainDescription>
        </IntroMainContainer>
    );
}
