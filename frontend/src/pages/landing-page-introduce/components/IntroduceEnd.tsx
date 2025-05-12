import introduceEndImage from '@/src/assets/images/introduce/intro-last.jpg';
import {
    IntroEndDescription,
    IntroEndImage,
    IntroEndSeparator,
    IntroEndTitle,
    IntroSubTitle,
    IntroButton,
    BugButton
} from './Introduce.css';
import { useNavigate } from 'react-router-dom';

export default function IntroduceEnd() {
    const navigate = useNavigate();

    return (
        <div>
            <IntroEndTitle>
                당신의 시작을
                <br /> 도울 준비가 되어 있습니다
            </IntroEndTitle>
            <IntroSubTitle>우리가 연결할, 새로운 시작들</IntroSubTitle>
            <IntroEndImage
                width="500"
                height="500"
                alt="마지막 소개 페이지 대표 이미지"
                src={introduceEndImage}
            />
            <IntroEndDescription>
                누군가의 끝이, 누군가의 시작이 됩니다. <br />
                RESTART는 그 사이를 연결해, 당신의 출발을 더 가치 있게 만들어주는 플랫폼입니다.<br />
                지금 RESTART에서 당신에게 꼭 맞는 패키지를 찾아보세요
            </IntroEndDescription>
            <IntroButton onClick={() => navigate('/home')}>
                패키지 보러가기
            </IntroButton>
            <IntroEndSeparator />
            <IntroEndDescription>
                오류를 발견하거나 사용 시 불편함이 있다면
                <br />저희에게 알려주세요.
                <br />
                검토 후 최대한 반영할 수 있도록 노력하겠습니다.
            </IntroEndDescription>
            <BugButton>
                오류 / 버그 제보하기
            </BugButton>
            <button title="카페 제보 / 오류 신고하기" />
        </div>
    );
}
