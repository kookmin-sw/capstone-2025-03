import styled from '@emotion/styled';
import { useEffect } from 'react';
import { useCustomPackagesByUser } from '@/src/hooks/useCustomPackage';
import EachPackage from './EachPackage';
import { useState } from 'react';
import { useUpdatePackage } from '@/src/hooks/useCustomPackage';
import PackageModel from '@/src/models/PackageModel';

const Backdrop = styled.div`
    display: flex;
    position: fixed;
    z-index: 9999;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: flex-end;
`;

const Sheet = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    bottom: 0;
    height: 60%;

    width: 100%;
    max-width: 500px;
    background-color: #2c2c36;
    border-radius: 2rem 2rem 0 0;
    padding: 2rem;
    animation: slideUp 0.3s ease-out;

    @keyframes slideUp {
        from {
            transform: translateY(100%);
        }
        to {
            transform: translateY(0);
        }
    }
`;

const Header = styled.div`
    flex-shrink: 0;
    padding-bottom: 1rem;
    padding-top: 1rem;
`;

const ScrollBody = styled.div`
    flex-grow: 1;
    overflow-y: auto;

    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        display: none;
    }
`;

const Footer = styled.div`
    flex-shrink: 0;
    margin-top: 1.6rem;
`;

const PackageGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.6rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
`;

const SubmitButton = styled.button`
    background-color: #00a36c;
    height: 6rem;
    border-radius: 1rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.8rem;
    font-weight: bold;
`;

type Props = {
    onClose: () => void;
    productId: number | null;
    category: number | null;
    onSubmitSuccess: () => void;
};

export default function PackageSelectSheet({
    onClose,
    productId,
    category,
    onSubmitSuccess,
}: Props) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;

    const { data } = useCustomPackagesByUser(userId);

    const [selectedPackageIds, setSelectedPackageIds] = useState<number[]>([]);

    const { mutateAsync: updatePackage } = useUpdatePackage();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    console.log(data);

    const handleToggle = (id: number) => {
        setSelectedPackageIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    };

    // 선택된 패키지 id 값을 사용해 응답구조 -> 요청구조 재구성
    const handleSubmitButtonClicked = async () => {
        if (!productId || !category) return;

        const selectedPackages = data?.filter(
            (pkg) => pkg.id !== null && selectedPackageIds.includes(pkg.id),
        );

        if (!selectedPackages) return;

        let successCount = 0;

        for (const pkg of selectedPackages) {
            // 기존 카테고리에 새 카테고리 추가 (중복 제거)
            const updatedCategories = Array.from(new Set([...pkg.categories, category]));

            // 기존 products에서 id만 추출 + 새 productId 추가 (중복 제거)
            const updatedProductIds = Array.from(
                new Set([...pkg.products.map((p) => p.id), productId]),
            );

            const { products, ...rest } = pkg;

            // 새로운 패키지 모델 객체 구성
            const updatedData: Partial<PackageModel> & { product_ids: number[] } = {
                ...rest,
                categories: updatedCategories,
                product_ids: updatedProductIds.filter((id): id is number => id !== null),
            };

            try {
                await updatePackage({ id: pkg.id!, updatedData });
                successCount++;
            } catch (error) {
                console.error(`패키지 ${pkg.id} 업데이트 실패`, error);
            }
        }

        if (successCount === selectedPackages.length) {
            onSubmitSuccess();
        }

        onClose();
    };

    return (
        <>
            <Backdrop onClick={onClose}>
                <Sheet onClick={(e) => e.stopPropagation()}>
                    <Header>
                        <p style={{ fontSize: '2.6rem', fontWeight: 'bold' }}>패키지 선택</p>
                        <p style={{ fontSize: '1.6rem', color: 'gray' }}>
                            찜 물품을 넣을 패키지를 선택해주세요
                        </p>
                    </Header>
                    <ScrollBody>
                        <PackageGrid>
                            {data?.map((item, idx) => (
                                <EachPackage
                                    key={idx}
                                    data={item}
                                    isSelected={
                                        item.id !== null && selectedPackageIds.includes(item.id)
                                    }
                                    onToggle={() => item.id !== null && handleToggle(item.id)}
                                />
                            ))}
                        </PackageGrid>
                    </ScrollBody>
                    <Footer>
                        <SubmitButton onClick={handleSubmitButtonClicked}>완료</SubmitButton>
                    </Footer>
                </Sheet>
            </Backdrop>
        </>
    );
}
