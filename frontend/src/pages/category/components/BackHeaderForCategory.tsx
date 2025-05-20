import styled from '@emotion/styled';
import Search from '../../../assets/images/header/search.png';

const Header = styled.div<{ searchVisible: boolean }>`
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 500px;
    background-color: #101012;
    z-index: 10;

    padding: ${({ searchVisible }) => (searchVisible ? '1rem 2rem' : '1.6rem 2rem')};
`;

const HeaderRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const CategoryName = styled.p`
    font-weight: 600;
    font-size: 2rem;
    color: white;
`;

const SearchButton = styled.img`
    height: 2.4rem;
    cursor: pointer;
`;

const BackButton = styled.img`
    height: 2.4rem;
    cursor: pointer;
`;

const SearchBarWrapper = styled.div`
    background-color: #2d2d34;
    height: 100%;
    border-radius: 1.2rem;
    padding: 0.6rem;
    display: flex;
    align-items: center;
    margin-top: 0;
    gap: 1rem;
`;

const SearchInput = styled.input`
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 1.5rem;
    color: white;
    &::placeholder {
        color: #aaa;
    }
`;

const CancelButton = styled.button`
    background: none;
    border: none;
    font-size: 2rem;
    margin-right: 1rem;
    color: white;
    cursor: pointer;
`;

type BackHeaderForCategoryProps = {
    category: string;
    searchVisible: boolean;
    setSearchVisible: (v: boolean) => void;
    searchText: string;
    setSearchText: (v: string) => void;
};

export default function BackHeaderForCategory({
    category,
    searchVisible,
    setSearchVisible,
    searchText,
    setSearchText,
}: BackHeaderForCategoryProps) {
    const handleClick = () => {
        window.history.back();
    };

    const handleSearchToggle = () => setSearchVisible(true);

    const handleCancelSearch = () => {
        setSearchText('');
        setSearchVisible(false);
    };

    return (
        <Header searchVisible={searchVisible}>
            {!searchVisible ? (
                <HeaderRow>
                    <BackButton src="/images/seller/arrow_back.png" onClick={handleClick} />
                    <CategoryName>{category}</CategoryName>
                    <button onClick={() => setSearchVisible(!searchVisible)}>
                        <SearchButton src={Search} onClick={handleSearchToggle}></SearchButton>
                    </button>
                </HeaderRow>
            ) : (
                <SearchBarWrapper>
                    <img src={Search} style={{ height: '1.8rem', marginLeft: '1rem' }} />
                    <SearchInput
                        type="text"
                        placeholder={`${category} 내에서 검색`}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <CancelButton onClick={handleCancelSearch}>×</CancelButton>
                </SearchBarWrapper>
            )}
        </Header>
    );
}
