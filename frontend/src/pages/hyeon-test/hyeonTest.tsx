import styles from "./HyeonTest.module.css";
import MainHeader from "@/src/components/layout/MainHeader";
import Footer from "@/src/components/layout/MenuFooter";
import PackageItem from "@/src/components/ui/PackageItem";
import SandClockImage from "../../assets/images/page/home/sand_clock.png";
import CoffeePackImage from "../../assets/images/dummy/coffee_pack.png";
import { getPackageListInService } from "@/src/services/packageService";
import PackageModel from "@/src/models/PackageModel";

export default function HyeonTest() {
  const currentMenuIndex = 0;
  const packages: PackageModel[] = [PackageModel.fromJson({
    "id": 1,
    "industry_id": 1,
    "category_ids": [1, 2],
    "product_ids": [1, 2],
    "thumbnail": CoffeePackImage,
    "name": "Restaurant Starter Pack",
    "description": "Basic tools and kitchenware for new restaurants.",
    "price": 90000
  }), PackageModel.fromJson({
    "id": 2,
    "industry_id": 1,
    "category_ids": [1, 2],
    "product_ids": [1, 2],
    "thumbnail": CoffeePackImage,
    "name": "Restaurant Starter Pack",
    "description": "Basic tools and kitchenware for new restaurants.",
    "price": 90000
  }),
  PackageModel.fromJson({
    "id": 3,
    "industry_id": 1,
    "category_ids": [1, 2],
    "product_ids": [1, 2],
    "thumbnail": CoffeePackImage,
    "name": "Restaurant Starter Pack",
    "description": "Basic tools and kitchenware for new restaurants.",
    "price": 90000
  }),
  PackageModel.fromJson({
    "id": 4,
    "industry_id": 1,
    "category_ids": [1, 2],
    "product_ids": [1, 2],
    "thumbnail": CoffeePackImage,
    "name": "Restaurant Starter Pack",
    "description": "Basic tools and kitchenware for new restaurants.",
    "price": 90000
  }),
  PackageModel.fromJson({
    "id": 5,
    "industry_id": 1,
    "category_ids": [1, 2],
    "product_ids": [1, 2],
    "thumbnail": CoffeePackImage,
    "name": "Restaurant Starter Pack",
    "description": "Basic tools and kitchenware for new restaurants.",
    "price": 90000
  }),
  PackageModel.fromJson({
    "id": 6,
    "industry_id": 1,
    "category_ids": [1, 2],
    "product_ids": [1, 2],
    "thumbnail": CoffeePackImage,
    "name": "Restaurant Starter Pack",
    "description": "Basic tools and kitchenware for new restaurants.",
    "price": 90000
  }),
  PackageModel.fromJson({
    "id": 7,
    "industry_id": 1,
    "category_ids": [1, 2],
    "product_ids": [1, 2],
    "thumbnail": CoffeePackImage,
    "name": "Restaurant Starter Pack",
    "description": "Basic tools and kitchenware for new restaurants.",
    "price": 90000
  }),
  PackageModel.fromJson({
    "id": 8,
    "industry_id": 1,
    "category_ids": [1, 2],
    "product_ids": [1, 2],
    "thumbnail": CoffeePackImage,
    "name": "Restaurant Starter Pack",
    "description": "Basic tools and kitchenware for new restaurants.",
    "price": 90000
  }),
  PackageModel.fromJson({
    "id": 9,
    "industry_id": 1,
    "category_ids": [1, 2],
    "product_ids": [1, 2],
    "thumbnail": CoffeePackImage,
    "name": "Restaurant Starter Pack",
    "description": "Basic tools and kitchenware for new restaurants.",
    "price": 90000
  }),
  PackageModel.fromJson({
    "id": 10,
    "industry_id": 1,
    "category_ids": [1, 2],
    "product_ids": [1, 2],
    "thumbnail": CoffeePackImage,
    "name": "Restaurant Starter Pack",
    "description": "Basic tools and kitchenware for new restaurants.",
    "price": 90000
  })];

  // Function
  const handleClickFindPackageButton = async () => {
    const result = await getPackageListInService();
    console.log(result);
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