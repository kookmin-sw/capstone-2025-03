import styled from '@emotion/styled';

const Page = styled.div`
    padding-top: 10rem;
    min-height: 100vh;
    background-color: #101012;
    display: flex;
    flex-direction: column;
`;

const Section = styled.div`
    flex-grow: 1;
    padding: 0 2rem;
`;

const BannerSkeleton = styled.div`
    width: 100%;
    height: 20rem;
    border-radius: 1.2rem;
    background-color: #2c2c36;
    margin-bottom: 2rem;
`;

const SearchBarSkeleton = styled.div`
    width: 90%;
    margin: 0 auto;
    height: 4rem;
    border-radius: 1rem;
    background-color: #2c2c36;
    margin-bottom: 3rem;
`;

const IndustryGrid = styled.div`
    display: grid;
    margin-top: 8rem;
    margin-left: auto;
    margin-right: auto;
    grid-template-columns: repeat(4, 1fr);
    width: 90%;
    gap: 1rem;
`;

const IndustryItem = styled.div`
    height: 10rem;
    background-color: #2c2c36;
    border-radius: 1.2rem;
`;

const ListViewContainer = styled.div`
    margin-top: 8rem;
    margin-left: auto;
    margin-right: auto;
    width: 90%;
`;

const PackageItem = styled.div`
    height: 12rem;
    border-radius: 1.2rem;
    background-color: #2c2c36;
    margin-bottom: 2rem;
`;

export default function HomeSkeleton() {
    return (
        <Page>
            <Section>
                <BannerSkeleton />
                <SearchBarSkeleton />
                <IndustryGrid>
                    {Array.from({ length: 8 }).map((_, idx) => (
                        <IndustryItem key={idx} />
                    ))}
                </IndustryGrid>
                <ListViewContainer>
                    {Array.from({ length: 3 }).map((_, idx) => (
                        <PackageItem key={idx} />
                    ))}
                </ListViewContainer>
            </Section>
        </Page>
    );
}
