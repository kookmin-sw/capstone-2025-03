import styled from '@emotion/styled';
import { useEffect } from 'react';

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
    background-color: #2C2C36;
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
    children: React.ReactNode;
    onClose: () => void;
};

export default function PackageSelectSheet({ children, onClose }: Props) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <Backdrop onClick={onClose}>
            <Sheet onClick={(e) => e.stopPropagation()}>{children}</Sheet>
        </Backdrop>
    );
}
