import styled from '@emotion/styled';

const Item = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
`;

const ThumbnailSkeleton = styled.div`
    width: 12rem;
    height: 12rem;
    border-radius: 2rem;
    margin-right: 1rem;
    background-color: #2c2c36;
    animation: skeleton-loading 1.2s infinite ease-in-out;
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    gap: 1rem;
`;

const TextSkeleton = styled.div`
    background-color: #2c2c36;
    border-radius: 0.6rem;
    animation: skeleton-loading 1.2s infinite ease-in-out;
`;

const TitleSkeleton = styled(TextSkeleton)`
    width: 18rem;
    height: 2rem;
`;

const GradeAndAmountSkeleton = styled(TextSkeleton)`
    width: 14rem;
    height: 1.6rem;
`;

const PriceSkeleton = styled(TextSkeleton)`
    width: 10rem;
    height: 2rem;
`;

export default function ProductItemSkeleton() {
    return (
        <Item>
            <ThumbnailSkeleton />
            <ContentContainer>
                <TitleSkeleton />
                <GradeAndAmountSkeleton />
                <PriceSkeleton />
            </ContentContainer>
        </Item>
    );
}
