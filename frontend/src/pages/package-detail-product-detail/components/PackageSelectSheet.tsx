import styled from '@emotion/styled';
import { useEffect } from 'react';
import { useCustomPackagesByUser } from '@/src/hooks/useCustomPackage';
import EachPackage from './EachPackage';
import { useState } from 'react';

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
    bottom: 0;
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

const PackageGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.6rem;
    margin-top: 2rem;
`;

type Props = {
    onClose: () => void;
};

export default function PackageSelectSheet({ onClose }: Props) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;

    const { data } = useCustomPackagesByUser(userId);

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    console.log(data);

    const handleToggle = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
          );
    };
    console.log(selectedIds)
    return (
        <>
            <Backdrop onClick={onClose}>
                <Sheet onClick={(e) => e.stopPropagation()}>
                    <p style={{ fontSize: '2.6rem', fontWeight: 'bold' }}>패키지 선택</p>
                    <p style={{ fontSize: '1.6rem', color: 'gray' }}>
                        찜 물품을 넣을 패키지를 선택해주세요
                    </p>
                    <PackageGrid>
                        {data?.map((item, idx) => (
                            <EachPackage
                                key={idx}
                                data={item}
                                isSelected={item.id !== null && selectedIds.includes(item.id)}
                                onToggle={() => item.id !== null && handleToggle(item.id)}
                            />
                        ))}
                    </PackageGrid>
                </Sheet>
            </Backdrop>
        </>
    );
}
