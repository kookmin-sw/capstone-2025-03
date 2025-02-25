import styled from "@emotion/styled";
import DefaultButton from "./DefaultButton";

const Modal = styled.div`
`;

const Title = styled.p`
`;

const Description = styled.p`
`;

export default function BottomModal(){
    return (
        <Modal>
            <Title>
                선택한 물품을 한번에<br/>구매하시겠어요?
            </Title>
            <Description>
                결제와 배송은 카카오톡으로 진행됩니다.
            </Description>
            <DefaultButton event={() => {}} isActive={true}/>
        </Modal>
    )
}