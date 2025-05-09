import styled from '@emotion/styled';
import PackageModel from '@/src/models/PackageModel';
import DefaultPackageImage from '../../../assets/images/page/package-detail/package-default.png';

const PackageBox = styled.div`
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 1.2rem;
    background-color: #a8967e;
    display: flex;
    overflow: hidden;
    align-items: center;
    justify-content: center;
`;

const DefaultImage = styled.img`
    width: 8rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    width: 100%;
    height: 100%;
    gap: 2px;
`;

const GridImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    aspect-ratio: 1 / 1;
`;

const SingleImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    aspect-ratio: 1 / 1;
`

const PackageName = styled.p`
    font-size: 1.9rem;
    display: flex;
    justify-content: center;
    font-weight: bold;
    padding: 2rem;
`;

type EachPackageProps = {
    data: PackageModel;
};

export default function EachPackage({ data }: EachPackageProps) {
    const { products, name } = data;

    const renderGridImages = () => {
        return (
            <Grid>
                {products.slice(0, 4).map((product, idx) => (
                    <GridImage key={idx} src={product.images?.[0] || DefaultPackageImage} />
                ))}
            </Grid>
        );
    };

    const renderSingleImage = () => {
        if (products[0]?.images?.[0]) {
            return <SingleImage src={products[0]?.images?.[0]} />
        } 
        return <DefaultImage src={DefaultPackageImage} />;
    };

    return (
        <div>
            <PackageBox>
                {products.length >= 4 ? renderGridImages() : renderSingleImage()}
            </PackageBox>
            <PackageName>{data.name}</PackageName>
        </div>
    );
}
