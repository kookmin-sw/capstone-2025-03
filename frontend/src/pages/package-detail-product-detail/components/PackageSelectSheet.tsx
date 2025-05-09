import styled from '@emotion/styled';
import { useEffect } from 'react';
import { useCustomPackagesByUser } from '@/src/hooks/useCustomPackage';
import EachPackage from './EachPackage';

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

type Props = {
    onClose: () => void;
};

export default function PackageSelectSheet({ onClose }: Props) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;

    const { data } = useCustomPackagesByUser(userId);
    console.log(data)

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <>
            <Backdrop onClick={onClose}>
                <Sheet onClick={(e) => e.stopPropagation()}>
                    <p style={{ fontSize: '2.6rem', fontWeight: 'bold' }}>패키지 선택</p>
                    <p style={{ fontSize: '1.6rem', color: 'gray' }}>
                        찜 물품을 넣을 패키지를 선택해주세요
                    </p>
                    {data?.map((item, index) => (
                        <EachPackage />
                    ))}
                </Sheet>
            </Backdrop>
        </>
    );
}
