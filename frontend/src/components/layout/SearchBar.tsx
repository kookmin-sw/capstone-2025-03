import styled from '@emotion/styled';
import SearchIconImage from '../../assets/images/header/search.png';

const SearchContainer = styled.div`
    background-color: #2c2c36;
    flex-grow: 1;
    padding: 0.8rem 1.2rem;
    border-radius: 1.2rem;
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: row;
    gap: 1rem;
`;

const SearchIcon = styled.img`
    width: 2.4rem;
    height: 2.4rem;
`;

const SearchText = styled.p`
    font-size: 1.4rem;
`;

export default function SearchHeader({ text, search }: { text: string, search: () => void }) {

    return (
        <SearchContainer onClick={search}>
            <SearchIcon src={SearchIconImage} />
            <SearchText>{text}</SearchText>
        </SearchContainer>
    );
}
