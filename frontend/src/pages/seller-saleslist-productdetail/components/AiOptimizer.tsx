import styled from "@emotion/styled";
import { Box } from "@chakra-ui/react";

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
  return (
    <Card>
      <Header>
        <IconContainer>
          <img
            src="/src/assets/images/page/seller-saleslist-product-detail/ai_icon.png"
            alt="AI Icon"
          />
        </IconContainer>
        <Box>
          <Title>AI 판매 최적화 기능</Title>
          <Description>
            유사한 제품을 분석하여 최상의 이익을 확보하면서도 시장에서
            합리적으로 판매될 수 있는 가격대를 추천해 드려요
          </Description>
        </Box>
      </Header>
      <Divider />
      <StatsContainer>
        <Stat>
          <StatTitle>업로드한 제품과 함께 많이 찾는 에스프레소 머신은 중고로 아래 가격대에서 잘 판매될 것으로 예상됩니다.</StatTitle>
          <StatValue>48,000원</StatValue>
        </Stat>
      </StatsContainer>
    </Card>
  );
}
