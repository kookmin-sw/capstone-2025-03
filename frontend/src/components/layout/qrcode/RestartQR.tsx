import styled from '@emotion/styled';
import QRImage from '/images/common/RestartQrImage.png';
const RestartQr = styled.div`
    position: fixed;
    bottom: 60px;
    left: 50%;
    transform: translateX(250px);
    width: 120px;
    height: 120px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    margin: 0 0 100px 20px;
    transition: opacity 1s ease-in-out;
    @media (max-width: 1000px) {
        opacity: 0;
    }
`;

const QrDescription = styled.p`
    margin-top: 16px;
    width: 200px;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: -0.2%;
    color: white;

    @media (prefers-color-scheme: dark) {
        color: white;
    }
`;

const QrNitofication = styled.p`
    margin-top: 8px;
    width: 200px;
    color: dimgray;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.2%;

    @media (prefers-color-scheme: dark) {
        color: gray;
    }
`;

export default function RestartQR() {
    return (
        <RestartQr>
            <img src={QRImage} />
            <QrDescription>
                모바일로 어디서든
                <br />
                RESTART 를 <br />
                이용해보세요
            </QrDescription>
            <QrNitofication>QR코드를 스캔해보세요</QrNitofication>
        </RestartQr>
    );
}
