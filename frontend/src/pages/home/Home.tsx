import styles from "./Home.module.css";
import MainHeader from "@/src/components/layout/MainHeader";
import Footer from "@/src/components/layout/MenuFooter";
import PackageItem from "@/src/components/ui/PackageItem";
import SandClockImage from "@/src/assets/images/page/home/sand_clock.png";
import { useNavigate } from "react-router-dom";
import { usePackage } from "@/src/hooks/usePackage";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  const currentMenuIndex = 0;
  const { packages, getPackageList } = usePackage();

  // useEffect
  useEffect(()=>{
    if(packages.length<1) getPackageList();
  }, [])

  // Function
  const handleClickFindPackageButton = () => {
    navigate('/find-package-select-industry');
  }

  return (
    <div className={styles.page}>
      <MainHeader />
      <div className={styles.section}>
        <div className={styles.contentContainer}>
          <div className={styles.topContainer}>
            <p className={styles.title}>
              1초만에 패키지 추천받기
            </p>
            <div className={styles.blank} />
            <button className={styles.findPackageButton} onClick={handleClickFindPackageButton}>
              업종 선택
            </button>
          </div>
          <div className={styles.bottomContainer}>
            <img className={styles.icon} src={SandClockImage} />
            <p className={styles.description}>
              <span className={styles.descriptionSpan}>
                패키지 구매로 줄어드는 시간은?
              </span><br />
              창업 물품 구매에 평균 3일 7시간 절약
            </p>
          </div>
        </div>
        <p className={styles.listViewTitle}>전체보기</p>
        <div className={styles.packageListView}>
          {packages.map((pkg, index) => {
            return (<PackageItem key={index} pkg={pkg} />)
          })}
        </div>
      </div>
      <Footer currentMenuIndex={currentMenuIndex} />
    </div>
  );
}