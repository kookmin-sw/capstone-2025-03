import styled from '@emotion/styled';
import { Box } from '@chakra-ui/react';
import { optimizePriceInServiceByNewModel } from '@/src/services/aiService';
import { useState, useEffect } from 'react';
import { sellerProductState } from '@/src/recoil/productState';
import { useRecoilValue } from 'recoil';
import { Spinner } from '@chakra-ui/react';
import Loading1 from '@/src/assets/images/loading/thought_balloon 1.png';
import Loading2 from '@/src/assets/images/loading/thought_balloon 1-1.png';
import Loading3 from '@/src/assets/images/loading/thought_balloon 1-2.png';

const Card = styled.div`
    background-color: #202028;
    padding-left: 2rem;
    padding-right: 2rem;
    padding-top: 3rem;
    padding-bottom: 3rem;
    margin-top: 3rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Header = styled.div`
    display: flex;
    align-items: start;
    gap: 1rem;
`;

// IconContainer 의 width 뭔가 좀 이상함. (수치보다 작게 보이는거 같음)
const IconContainer = styled.div`
    width: 9rem;
    background-color: #00a36c;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Title = styled.p`
    font-size: 1.8rem;
    font-weight: bold;
    color: white;
`;

const Description = styled.p`
    font-size: 1.4rem;
    color: #7f7f89;
`;

const Divider = styled.div`
    width: 100%;
    height: 1px;
    background-color: #333;
    margin-top: 2rem;
    margin-bottom: 2rem;
`;

const StatsContainer = styled.div`
    display: flex;
    justify-content: space-around;
`;

const Stat = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StatTitle = styled.p`
    font-size: 1.4rem;
    text-align: center;
    color: white;
    margin-bottom: 2rem;
    margin-right: 2rem;
    margin-left: 2rem;
`;

const StatValue = styled.p`
    font-size: 2rem;
    font-weight: bold;
    color: #00a36c;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 20rem;
  height: 20rem;
  border-radius: 30rem;
  background-color: #2C2C36;
  margin: 7rem auto 0;
  overflow: hidden;
`;

const SlideImage = styled.img<{ position: string }>`
  width: 40%;
  position: absolute;
  top: 30%;
  left: ${({ position }) => position};
`;

export default function NewAiOptimizer({ condition }: { condition: string }) {
    const sellerProduct = useRecoilValue(sellerProductState);
    const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(true);
    const loadingImages = [Loading1, Loading2, Loading3];
    const loadingTexts = [
        '설명으로 감가율을 적용하고 있어요..',
        '유사한 중고 물품의 시세를 보고 있어요..',
        '적절한 가격을 책정하고 있어요..'
    ];
    const [currentText, setCurrentText] = useState<string>(loadingTexts[0]);
    const [imageIndex, setImageIndex] = useState(0);
    const [prevImageIndex, setPrevImageIndex] = useState(2);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isMinLoading, setIsMinLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsUploading(true);
        const getOptimizedPrice = async () => {
            try {
                const responseData = await optimizePriceInServiceByNewModel(
                    sellerProduct.name ?? '',
                    condition ?? ''
                );
                setPredictedPrice(responseData.used_price);
            } catch (error) {
                console.log('Error Optimizing price: ', error);
            } finally {
                setIsUploading(false);
            }
        };
        getOptimizedPrice();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMinLoading(true);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isUploading && isMinLoading) {
            setIsReady(true);
        }
    }, [isUploading, isMinLoading]);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                index = (index + 1) % loadingImages.length;
                setPrevImageIndex(_ => index === 0 ? loadingImages.length - 1 : index - 1);
                setImageIndex(index);
                setCurrentText(loadingTexts[index]);
                setIsAnimating(false);
            }, 300); // 애니메이션 타이밍과 일치시킴
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        !isReady ? <div style={{ backgroundColor: '#202028', borderRadius: '1.2rem', padding: '3rem 2rem', marginTop: '3rem' }}>
            <h3 style={{ color: '#ffffff', fontWeight: '600', fontSize: '1.8rem' }}>AI Model v2.0 판매가 최적화</h3>
            <p style={{ fontSize: '1.4rem', color: '#7F7F89', width: '100%' }}>
                유사한 제품을 분석하여 최상의 이익을 확보하면서도 시장에서 합리적으로 판매될 수 있는 가격대를 추천해 드려요
            </p>
            <ImageWrapper>
                {/* 이전 이미지 - 왼쪽으로 사라짐 */}
                <SlideImage
                    src={loadingImages[prevImageIndex]}
                    position={isAnimating ? '-100%' : '30%'} style={{ transition: isAnimating ? 'all 0.4s ease-in-out' : 'none' }}
                />
                {/* 현재 이미지 - 오른쪽에서 들어옴 */}
                <SlideImage
                    src={loadingImages[imageIndex]}
                    position={isAnimating ? '30%' : '100%'} style={{ transition: isAnimating ? 'all 0.4s ease-in-out' : 'none' }}
                />
            </ImageWrapper>
            <p style={{ margin: 'auto', marginTop: '3rem', color: '#ffffff', fontSize: '1.6rem', fontWeight: '600', textAlign: 'center' }}>
                {currentText}
            </p>
            <div style={{ height: '2rem' }} />
        </div> : <Card>
            <Header>
                <IconContainer>
                    <img src="/images/seller/ai_icon.png" alt="AI Icon" />
                </IconContainer>
                <Box>
                    <Title>AI 판매 최적화 기능(Ver2. 감가율 예측)</Title>
                    <Description>
                        유사한 제품을 분석하여 최상의 이익을 확보하면서도 시장에서 합리적으로 판매될
                        수 있는 가격대를 추천해 드려요
                    </Description>
                </Box>
            </Header>
            <Divider />
            <StatsContainer>
                <Stat>
                    <StatTitle>
                        업로드한 제품과 함께 많이 찾는 {sellerProduct.categoryName}은(는) 중고로
                        아래 가격대에서 잘 판매될 것으로 예상됩니다.
                    </StatTitle>
                    {isUploading ? (
                        <Spinner
                            color="#00A36C"
                            borderWidth="0.3rem"
                            style={{ width: '3rem', height: '3rem' }}
                        />
                    ) : (
                        <StatValue>{predictedPrice?.toLocaleString()}원</StatValue>
                    )}
                </Stat>
            </StatsContainer>
        </Card>
    );
}
