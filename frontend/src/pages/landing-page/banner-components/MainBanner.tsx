import landingImage from '/src/assets/images/landing-page/landing1.jpg';
import BannerCarousel from './BannerCarousel';
import styled from '@emotion/styled';

const BANNER_DATA = [
    {
        text: '정리 중인 물건들, 아직 끝나지 않은 이야기들',
        image: landingImage,
        linkTo: "/landing-page-introduce"
    },
    {
        text: '당신의 손에서 다시 시작될 그 이야기',
        image: landingImage,
        linkTo: "/landing-page-introduce"
    },
];

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 4rem;
`

const MainName = styled.h1`
  font-family: 'RiaSans-ExtraBold';
  font-size: 3rem;
  font-weight: 100;
  color: white;
  transform: scaleX(1.2);
  margin-bottom: 1rem;
`

export default function Banner() {
    return (
        <MainContainer>
            <MainName>RESTART</MainName>
            <BannerCarousel banners={BANNER_DATA} />
        </MainContainer>
    );
}
