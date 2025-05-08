import styled from '@emotion/styled';

const Item = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    margin-bottom: 2rem;
`;

const SkeletonBlock = styled.div<{ width: string; height: string; borderRadius?: string }>`
    background-color: #2f2e35;
    border-radius: ${(props) => props.borderRadius || '0.4rem'};
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    animation: skeleton-loading 1.2s infinite ease-in-out;

    @keyframes skeleton-loading {
        0% {
            opacity: 0.4;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0.4;
        }
    }
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    gap: 0.8rem;
`;

export default function SellerProductItemSkeleton() {
    return (
        <Item>
            <SkeletonBlock
                width="12rem"
                height="12rem"
                borderRadius="2rem"
                style={{ marginRight: '1rem' }}
            />
            <ContentContainer>
                <SkeletonBlock width="20rem" height="2.2rem" />
                <SkeletonBlock width="10rem" height="1.8rem" />
                <SkeletonBlock width="12rem" height="2rem" />
                <SkeletonBlock width="6rem" height="2.4rem" borderRadius="1rem" />
            </ContentContainer>
        </Item>
    );
}
