import styles from './Home.module.css';
import MainHeader from '@/src/components/layout/MainHeader';
import Footer from '@/src/components/layout/MenuFooter';
import PackageItem from '@/src/components/ui/PackageItem';
import { useNavigate } from 'react-router-dom';
import { usePackage } from '@/src/hooks/usePackage';
import { useEffect, useState, useRef } from 'react';
import LoadingSection from '@/src/components/layout/LoadingSection';
import { Spinner } from '@chakra-ui/react';
import { useHeaderVisibility } from '@/src/hooks/useHeaderVisibility';
import RestartBanner from '@/src/assets/images/banner/restart_banner.png';
import SearchBar from '@/src/components/layout/SearchBar';

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
    const navigate = useNavigate();
    const currentMenuIndex = 1;
    const { packageList, getPackageList } = usePackage();
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const isVisible = useHeaderVisibility();

    // useEffect
    useEffect(() => {
        const fetchPackages = async () => {
            if (packageList.length < 1) {
                const newPackages = await getPackageList(null);
                if (newPackages) setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        };
        fetchPackages();
    }, []);
    useEffect(() => {
        if (!loadMoreRef.current || isLoadMoreLoading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsLoadMoreLoading(true);
                    getPackageList(null).finally(() => setIsLoadMoreLoading(false));
                }
            },
            { threshold: 0 },
        );

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [isLoading, isLoadMoreLoading]);

    // Function
    const handleClickFindPackageButton = () => {
        navigate('/find-package-select-industry');
    };

    const handleSearchBarClick = () => {
        window.alert('click');
    }

    return isLoading ? (
        <LoadingSection text="잠시만 기다려주세요" />
    ) : (
        <div className={styles.page}>
            <MainHeader isVisible={isVisible} />
            <div className={styles.section}>
                <div className={styles.bannerContainer}>
                    <img className={styles.bannerImage} src={RestartBanner}></img>
                </div>
                <div className={styles.industrySelectContainer}>
                    <SearchBar text='필요한 중고 물품 검색' search={handleSearchBarClick}/>
                </div>
                <p className={styles.listViewTitle}>전체보기</p>
                <div className={styles.packageListView}>
                    {packageList.map((pkg, index) => {
                        return <PackageItem key={index} pkg={pkg} />;
                    })}
                </div>
                <div ref={loadMoreRef} style={{ height: '20px' }} />
                {isLoadMoreLoading && (
                    <div className={styles.spinnerContainer} style={{ height: '20rem' }}>
                        <Spinner
                            color="#00A36C"
                            borderWidth="0.6rem"
                            animationDuration="0.8s"
                            style={{ width: '6rem', height: '6rem' }}
                        />
                    </div>
                )}
            </div>
            <Footer currentMenuIndex={currentMenuIndex} />
        </div>
    );
}
