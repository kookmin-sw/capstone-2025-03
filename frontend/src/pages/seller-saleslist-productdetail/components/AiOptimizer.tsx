import styled from '@emotion/styled';
import { Box } from '@chakra-ui/react';
import { optimizePriceInService } from '@/src/services/aiService';
import { useState, useEffect } from 'react';
import { sellerProductState } from '@/src/recoil/productState';
import { useRecoilValue } from 'recoil';
import { Spinner } from '@chakra-ui/react';

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

export default function AiOptimizer() {
    const sellerProduct = useRecoilValue(sellerProductState);

    const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    useEffect(() => {
        setIsUploading(true);
        const getOptimizedPrice = async () => {
            try {
                const responseData = await optimizePriceInService(
                    sellerProduct.name ?? '',
                    sellerProduct.grade ?? '',
                    sellerProduct.quantity,
                );
                setPredictedPrice(responseData.predicted_price);
            } catch (error) {
                console.log('Error Optimizing price: ', error);
            } finally {
                setIsUploading(false);
            }
        };
        getOptimizedPrice();
    }, []);

    return (
        <Card>
            <Header>
                <IconContainer>
                    <img src="/images/seller/ai_icon.png" alt="AI Icon" />
                </IconContainer>
                <Box>
                    <Title>AI 판매 최적화 기능</Title>
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
