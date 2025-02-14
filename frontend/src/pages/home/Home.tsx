import styles from "./Home.module.css";
import MainHeader from "@/src/components/layout/MainHeader";
import Footer from "@/src/components/layout/MenuFooter";
import PackageItem from "@/src/components/ui/PackageItem";
import SandClockImage from "../../assets/images/page/home/sand_clock.png";
import CoffeePackImage from "../../assets/images/dummy/coffee_pack.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const currentMenuIndex = 0;
  const packages = [{
    id: "1",
    thumbnail: CoffeePackImage,
    title: "프리미엄 여행 패키지",
    description: "이 패키지는 최고의 여행 경험을 제공합니다.",
    price: 299000,
    categories: ["호텔", "비행기", "렌터카"]
  }, {
    id: "2",
    thumbnail: CoffeePackImage,
    title: "프리미엄 여행 패키지",
    description: "이 패키지는 최고의 여행 경험을 제공합니다.",
    price: 299000,
    categories: ["호텔", "비행기", "렌터카"]
  },
  {
    id: "2",
    thumbnail: CoffeePackImage,
    title: "프리미엄 여행 패키지",
    description: "이 패키지는 최고의 여행 경험을 제공합니다.",
    price: 299000,
    categories: ["호텔", "비행기", "렌터카"]
  },
  {
    id: "2",
    thumbnail: CoffeePackImage,
    title: "프리미엄 여행 패키지",
    description: "이 패키지는 최고의 여행 경험을 제공합니다.",
    price: 299000,
    categories: ["호텔", "비행기", "렌터카"]
  },
  {
    id: "2",
    thumbnail: CoffeePackImage,
    title: "프리미엄 여행 패키지",
    description: "이 패키지는 최고의 여행 경험을 제공합니다.",
    price: 299000,
    categories: ["호텔", "비행기", "렌터카"]
  },
  {
    id: "2",
    thumbnail: CoffeePackImage,
    title: "프리미엄 여행 패키지",
    description: "이 패키지는 최고의 여행 경험을 제공합니다.",
    price: 299000,
    categories: ["호텔", "비행기", "렌터카"]
  },
  {
    id: "2",
    thumbnail: CoffeePackImage,
    title: "프리미엄 여행 패키지",
    description: "이 패키지는 최고의 여행 경험을 제공합니다.",
    price: 299000,
    categories: ["호텔", "비행기", "렌터카"]
  },
  {
    id: "2",
    thumbnail: CoffeePackImage,
    title: "프리미엄 여행 패키지",
    description: "이 패키지는 최고의 여행 경험을 제공합니다.",
    price: 299000,
    categories: ["호텔", "비행기", "렌터카"]
  },
  {
    id: "2",
    thumbnail: CoffeePackImage,
    title: "프리미엄 여행 패키지",
    description: "이 패키지는 최고의 여행 경험을 제공합니다.",
    price: 299000,
    categories: ["호텔", "비행기", "렌터카"]
  }
  ];

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