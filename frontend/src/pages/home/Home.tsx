import styles from './Home.module.css';
import styled from '@emotion/styled';
import MainHeader from '@/src/components/layout/MainHeader';
import Footer from '@/src/components/layout/MenuFooter';
import PackageItem from '@/src/components/ui/PackageItem';
import { useNavigate } from 'react-router-dom';
import { usePackage } from '@/src/hooks/usePackage';
import { useEffect, useState, useRef } from 'react';
import { useHeaderVisibility } from '@/src/hooks/useHeaderVisibility';
import RestartBanner from '@/src/assets/images/banner/restart_banner.png';
import SearchBar from '@/src/components/layout/SearchBar';
import ArrowRight from '@/src/assets/images/page/home/arrow_right.png';
import IndustryModel from '@/src/models/IndustryModel';
import industryData from '@/src/data/industryData.json';
import HomeSkeleton from '@/src/components/ui/HomeSkeleton';
import PackageItemSkeleton from '@/src/components/ui/PackageItemSkeleton';
import Joyride from 'react-joyride';
import {
    recommendPageSteps,
    joyrideLocale,
    joyrideStyles,
} from '@/src/components/ui/ToolTipContents';

const Divider = styled.div`
    width: 100%;
    height: 1px;
    background-color: #2e2e2e;
    margin-top: 1.6rem;
`;

export default function Home() {
    // 툴팁 용도
    const [run, setRun] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
    const navigate = useNavigate();
    const currentMenuIndex = 1;
    const { packageList, getPackageList } = usePackage();
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const isVisible = useHeaderVisibility();
    const industries: IndustryModel[] = industryData
        .slice(0, 8)
        .map((industry) => IndustryModel.fromJson(industry));

    // useEffect

    // 툴팁 용
    const LOCAL_STORAGE_KEY = 'home_tooltip_shown';

    // 개발 중일때
    // localStorage.removeItem('home_tooltip_shown');
    useEffect(() => {
        const alreadyShown = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (!alreadyShown) {
            const timer = setTimeout(() => {
                setRun(true);
                localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
            }, 300);
            return () => clearTimeout(timer);
        }
    }, []);

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
    const handleSearchBarClick = () => {
        navigate('/search-category');
    };

    const handleNextButton = () => {
        navigate('/find-package-select-industry');
    };

    const handleIndustryItemClick = (industry: IndustryModel) => {
        navigate('/find-package-recommend', {
            state: { selectedIndustry: industry?.toJson() },
        });
    };
    
    return isLoading ? (
        <HomeSkeleton />
    ) : (
        <div id="introduce" className={styles.page}>
            <Joyride
                steps={recommendPageSteps}
                run={run}
                continuous
                // scrollToFirstStep
                disableScrolling
                showSkipButton
                showProgress={false}
                locale={joyrideLocale}
                styles={joyrideStyles}
            />
            <MainHeader isVisible={isVisible} />
            <div className={styles.section}>
                <div className={styles.bannerContainer}>
                    <img className={styles.bannerImage} src={RestartBanner}></img>
                </div>
                <div id="packege-recommend" className={styles.industrySelectContainer}>
                    <div id="category">
                        <SearchBar text="필요한 중고 물품 검색" search={handleSearchBarClick} />
                    </div>
                    <div className={styles.industryTitleContainer}>
                        <h1 className={styles.industryTitle}>업종별 패키지 추천</h1>
                        <div style={{ flex: '1' }} />
                        <button className={styles.nextButton} onClick={handleNextButton}>
                            <p className={styles.nextButtonText}>더보기</p>
                            <img src={ArrowRight} className={styles.nexButtonImage} />
                        </button>
                    </div>
                    <div className={styles.industryGrid}>
                        {industries.map((industry) => {
                            return (
                                <div
                                    key={industry.id}
                                    className={styles.industryItem}
                                    onClick={() => handleIndustryItemClick(industry!)}
                                >
                                    <img
                                        className={styles.industryItemImage}
                                        src={industry.icon!}
                                    />
                                    <p className={styles.industryItemText}>
                                        {industry.id === 6 ? '쇼핑몰' : industry.name}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div id="all-package" className={styles.listViewContainer}>
                    <p className={styles.listViewTitle}>전체보기</p>
                    <div className={styles.packageListView}>
                        {packageList.map((pkg, index) => {
                            if (pkg.user !== null) {
                                return;
                            }
                            return (
                                <div key={pkg.id ?? index}>
                                    <PackageItem key={index} pkg={pkg} fromDetail={false} />
                                    {index !== packageList.length - 1 && <Divider />}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div ref={loadMoreRef} style={{ height: '20px' }} />
                {isLoadMoreLoading && (
                    <div>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className={styles.skeletonContainer}>
                                <PackageItemSkeleton key={index} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer currentMenuIndex={currentMenuIndex} />
        </div>
    );
}
