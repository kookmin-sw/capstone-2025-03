import PackageModel from "@/src/models/PackageModel";
import styled from '@emotion/styled';
import PackageAlternativeImage from '../../assets/images/alternative/package.png';

const ThumbnailContainer = styled.div`
    object-fit: cover;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    width: 100%;
    height: 16rem;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 1.2rem;
    position: relative;
`;

const OneThumbnail = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.6rem;
`;

const TwoGrid = styled.div`
  display: flex;
`;

const ThreeGrid = styled.div`
  display: flex;
  flex-direction: column;
`;

const ThreeTop = styled.div`
  flex: 1;
  overflow: hidden;
`;

const ThreeBottom = styled.div`
  display: flex;
  flex: 1;
`;

const FourGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
`;

const GridImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  flex: 1;
  padding: 0.2rem;
  border-radius: 0.6rem;
`;

export default function PackageThumbnail({ pkg, children }: { pkg: PackageModel, children?: React.ReactNode }) {
    const CustomThumbnail = () => {
        return (
            <ThumbnailContainer>
                {pkg.products.length === 0 && (
                    <OneThumbnail src={PackageAlternativeImage} />
                )}

                {pkg.products.length === 1 && (
                    <OneThumbnail src={pkg.products[0].images[0]} />
                )}

                {pkg.products.length === 2 && (
                    <TwoGrid>
                        {pkg.products.slice(0, 2).map((p, i) => (
                            <GridImage key={i} src={p.images[0]} />
                        ))}
                    </TwoGrid>
                )}

                {pkg.products.length === 3 && (
                    <ThreeGrid>
                        <ThreeTop>
                            <GridImage src={pkg.products[0].images[0]} />
                        </ThreeTop>
                        <ThreeBottom>
                            {pkg.products.slice(1, 3).map((p, i) => (
                                <GridImage key={i} src={p.images[0]} />
                            ))}
                        </ThreeBottom>
                    </ThreeGrid>
                )}

                {pkg.products.length >= 4 && (
                    <FourGrid>
                        {pkg.products.slice(0, 4).map((p, i) => (
                            <GridImage key={i} src={p.images[0]} />
                        ))}
                    </FourGrid>
                )}
                {children}
            </ThumbnailContainer>
        );
    };

    return <CustomThumbnail />;
}