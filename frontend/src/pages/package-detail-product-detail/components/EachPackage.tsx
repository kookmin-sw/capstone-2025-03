import styled from '@emotion/styled';
import PackageModel from '@/src/models/PackageModel';
import DefaultPackageImage from '../../../assets/images/page/package-detail/package-default.png';
import CheckedIcon from '../../../assets/images/section/check.png';
import { useState } from 'react';

const PackageBox = styled.div`
    position: relative;
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
`;

const CheckIcon = styled.img<{ selected: boolean }>`
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    width: 3.2rem;
    height: 3.2rem;
    filter: ${({ selected }) => (selected ? 'saturate(1)' : 'saturate(0)')};
`;

const PackageName = styled.p`
    font-size: 1.9rem;
    display: flex;
    justify-content: center;
    font-weight: bold;
    padding: 2rem;
`;

type EachPackageProps = {
    data: PackageModel;
    isSelected: boolean;
    onToggle: () => void;
    productId: number | null;
};

export default function EachPackage({ data, isSelected, onToggle, productId }: EachPackageProps) {
    const { products, name } = data;

    const isProductIncluded = productId ? products.some((p) => p.id === productId) : false;
    const [selected, setSelected] = useState<boolean>(isProductIncluded);

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
            return <SingleImage src={products[0]?.images?.[0]} />;
        }
        return <DefaultImage src={DefaultPackageImage} />;
    };

    return (
        <div>
            <PackageBox>
                {products.length >= 4 ? renderGridImages() : renderSingleImage()}
                <CheckIcon
                    selected={selected}
                    src={CheckedIcon}
                    onClick={(e) => {
                        onToggle();
                        e.stopPropagation();
                        setSelected(!selected);
                    }}
                />
            </PackageBox>
            <PackageName>{name}</PackageName>
        </div>
    );
}
