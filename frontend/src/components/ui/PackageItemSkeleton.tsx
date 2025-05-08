import styled from '@emotion/styled';

const Item = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: start;
`;

const ThumbnailContainer = styled.div`
    width: 12rem;
    height: 12rem;
    margin-right: 1rem;
    border-radius: 0.6rem;
    background-color: #2c2c36;
    animation: pulse 1.5s ease-in-out infinite;
`;

const ContentContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
`;

const SkeletonLine = styled.div<{ width: string; height?: string }>`
    width: ${(props) => props.width};
    height: ${(props) => props.height ?? '1.6rem'};
    background-color: #2c2c36;
    border-radius: 0.4rem;
    animation: pulse 1.5s ease-in-out infinite;
`;

const LikePlaceholder = styled.div`
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    background-color: #2c2c36;
    animation: pulse 1.5s ease-in-out infinite;
`;

const GlobalStyle = `
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}
`;

export default function PackageItemSkeleton() {
    return (
        <>
            <style>{GlobalStyle}</style>
            <Item>
                <ThumbnailContainer />
                <ContentContainer>
                    <SkeletonLine width="50%" />
                    <SkeletonLine width="80%" />
                    <SkeletonLine width="40%" />
                    <div style={{marginTop:"1.5rem"}}>
                        <SkeletonLine width="90%" height="1.4rem" />
                    </div>
                </ContentContainer>
                <LikePlaceholder />
            </Item>
        </>
    );
}
