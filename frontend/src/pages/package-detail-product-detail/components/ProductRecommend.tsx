import styled from '@emotion/styled';

const RecommendContainer = styled.div`
    padding: 2rem;
`;

const RecommendText = styled.p`
    font-size: 1.9rem;
    font-weight: 700;
    color: white;
`;

export default function ProductRecommend() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const name = user.name ?? "손";

    console.log(name);

    return (
        <RecommendContainer>
            <RecommendText>{name}님, 이건 어때요?</RecommendText>
        </RecommendContainer>
    );
}
