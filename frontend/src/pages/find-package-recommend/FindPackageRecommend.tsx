import BackHeader from "@/src/components/layout/BackHeader";
import styles from "./FindPackageRecommend.module.css";
import PackageItem from "@/src/components/ui/PackageItem";
import CoffeePackImage from "../../assets/images/dummy/coffee_pack.png";
import { useLocation } from "react-router-dom";
import BreadInCircleImage from "../../assets/images/industry/bread_in_circle.png";

export default function FindPackageRecommend() {
    const location = useLocation();
    const { industry } = location.state || { industry: { id: "", icon: "", name: "" } };
    let name: string = '박길현';
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
        id: "3",
        thumbnail: CoffeePackImage,
        title: "프리미엄 여행 패키지",
        description: "이 패키지는 최고의 여행 경험을 제공합니다.",
        price: 299000,
        categories: ["호텔", "비행기", "렌터카"]
    },
    {
        id: "4",
        thumbnail: CoffeePackImage,
        title: "프리미엄 여행 패키지",
        description: "이 패키지는 최고의 여행 경험을 제공합니다.",
        price: 299000,
        categories: ["호텔", "비행기", "렌터카"]
    },
    {
        id: "5",
        thumbnail: CoffeePackImage,
        title: "프리미엄 여행 패키지",
        description: "이 패키지는 최고의 여행 경험을 제공합니다.",
        price: 299000,
        categories: ["호텔", "비행기", "렌터카"]
    },
    {
        id: "6",
        thumbnail: CoffeePackImage,
        title: "프리미엄 여행 패키지",
        description: "이 패키지는 최고의 여행 경험을 제공합니다.",
        price: 299000,
        categories: ["호텔", "비행기", "렌터카"]
    },
    {
        id: "7",
        thumbnail: CoffeePackImage,
        title: "프리미엄 여행 패키지",
        description: "이 패키지는 최고의 여행 경험을 제공합니다.",
        price: 299000,
        categories: ["호텔", "비행기", "렌터카"]
    },
    {
        id: "8",
        thumbnail: CoffeePackImage,
        title: "프리미엄 여행 패키지",
        description: "이 패키지는 최고의 여행 경험을 제공합니다.",
        price: 299000,
        categories: ["호텔", "비행기", "렌터카"]
    },
    {
        id: "9",
        thumbnail: CoffeePackImage,
        title: "프리미엄 여행 패키지",
        description: "이 패키지는 최고의 여행 경험을 제공합니다.",
        price: 299000,
        categories: ["호텔", "비행기", "렌터카"]
    }];

    return (
        <div className={styles.page}>
            <BackHeader />
            <div className={styles.section}>
                <p className={styles.title}>
                    {name}님이 선택한 업종에서<br />한번에 사면 좋은 물품들
                </p>
                <div className={styles.contentContainer}>
                    <div className={styles.contentTextContainer}>
                        <p className={styles.contentTitle}>
                            {industry.name} 패키지 추천
                        </p>
                        <p className={styles.description}>
                            빵을 반죽하고 구워요!
                        </p>
                    </div>
                    <div className={styles.blank} />
                    <img className={styles.contentIcon} src={BreadInCircleImage}>
                    </img>
                </div>
                <div className={styles.packageLitView}>
                    {packages.map((pkg, index) => {
                        return (
                            <PackageItem key={index} pkg={pkg} />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}