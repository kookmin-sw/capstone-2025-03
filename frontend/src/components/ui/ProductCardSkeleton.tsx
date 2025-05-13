import styled from '@emotion/styled';

const SkeletonCard = styled.div`
    display: flex;
    min-width: 14rem;
    flex-direction: column;
    gap: 0.5rem;
`;

const SkeletonBox = styled.div`
    background-color: #2a2a2a;
    border-radius: 0.4rem;
`;

const SkeletonImage = styled(SkeletonBox)`
    width: 14rem;
    height: 14rem;
`;

const SkeletonText = styled(SkeletonBox)`
    height: 1.6rem;
    width: ${(props: { width?: string }) => props.width || '100%'};
`;

export default function ProductCardSkeleton() {
    return (
        <SkeletonCard>
            <SkeletonImage />
            <SkeletonText width="80%" />
            <SkeletonText width="60%" />
        </SkeletonCard>
    );
}
