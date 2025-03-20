import styles from './Home.module.css';
import MainHeader from '@/src/components/layout/MainHeader';
import Footer from '@/src/components/layout/MenuFooter';
import PackageItem from '@/src/components/ui/PackageItem';
import SandClockImage from '@/src/assets/images/page/home/sand_clock.png';
import { useNavigate } from 'react-router-dom';
import { usePackage } from '@/src/hooks/usePackage';
import { useEffect, useState, useRef } from 'react';
import LoadingSection from '@/src/components/layout/LoadingSection';
import { Spinner } from '@chakra-ui/react';

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
    const navigate = useNavigate();
    const currentMenuIndex = 0;
    const { packages, getPackageList, hasMore, nextPage } = usePackage();

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // useEffect
    useEffect(() => {
        const fetchPackages = async () => {
            if (packages.length < 1) {
                const newPackages = await getPackageList();
                if (newPackages) setIsLoading(false);
                // console.log(newPackages)
            } else {
                setIsLoading(false);
            }
        };
        fetchPackages();
    }, []);

    useEffect(() => {
        if (!hasMore || !nextPage || !loadMoreRef.current || isLoadMoreLoading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsLoadMoreLoading(true);
                    getPackageList().finally(() => setIsLoadMoreLoading(false));
                }
            },
            { threshold: 1.0 },
        );

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [hasMore, nextPage, isLoadMoreLoading]);

    // Function
    const handleClickFindPackageButton = () => {
        navigate('/find-package-select-industry');
    };

    return isLoading ? (
        <LoadingSection text="잠시만 기다려주세요" />
    ) : (
        <div className={styles.page}>
            <MainHeader />
            <div className={styles.section}>
                <div className={styles.contentContainer}>
                    <div className={styles.topContainer}>
                        <p className={styles.title}>1초만에 패키지 추천받기</p>
                        <div className={styles.blank} />
                        <button
                            className={styles.findPackageButton}
                            onClick={handleClickFindPackageButton}
                        >
                            업종 선택
                        </button>
                    </div>
                    <div className={styles.bottomContainer}>
                        <img className={styles.icon} src={SandClockImage} />
                        <p className={styles.description}>
                            <span className={styles.descriptionSpan}>
                                패키지 구매로 줄어드는 시간은?
                            </span>
                            <br />
                            창업 물품 구매에 평균 3일 7시간 절약
                        </p>
                    </div>
                </div>
                <p className={styles.listViewTitle}>전체보기</p>
                <div className={styles.packageListView}>
                    {packages.map((pkg, index) => {
                        return <PackageItem key={index} pkg={pkg} />;
                    })}
                </div>
                <div ref={loadMoreRef} style={{ "height": "20px" }} />
                {isLoadMoreLoading ? <div className={styles.spinnerContainer} style={{ "height": "20rem" }}>
                    <Spinner
                        color="#00A36C"
                        borderWidth="0.6rem"
                        animationDuration="0.8s"
                        style={{ width: '6rem', height: '6rem' }}
                    />
                </div> : null}
            </div>
            <Footer currentMenuIndex={currentMenuIndex} />
        </div>
    );
}
