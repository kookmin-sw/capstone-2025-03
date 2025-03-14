import BackHeader from "@/src/components/layout/BackHeader";
import styles from "./FindPackageRecommend.module.css";
import PackageItem from "@/src/components/ui/PackageItem";
import { useLocation } from "react-router-dom";
import IndustryModel from "@/src/models/IndustryModel";
import { usePackage } from "@/src/hooks/usePackage";
import { useUser } from "@/src/contexts/UserContext";

export default function FindPackageRecommend() {
    const { user } = useUser();
    const { packages } = usePackage();
    const location = useLocation();
    const industry: IndustryModel = IndustryModel.fromJson(location.state?.selectedIndustry || { id: "", icon: "", name: "" });
    const comments: { id: number, comment: string }[] = [
        { "id": 1, "comment": "맛있는 음식으로 고객의 입맛을 사로잡아보세요!" },
        { "id": 2, "comment": "아름다움을 책임지는 뷰티 전문가를 위한 공간입니다." },
        { "id": 3, "comment": "해외시장 개척! 글로벌 비즈니스를 시작해보세요." },
        { "id": 4, "comment": "전문적인 레슨과 교육으로 더 많은 학생을 만나보세요." },
        { "id": 5, "comment": "향기로운 커피와 함께하는 따뜻한 공간을 만들어보세요." },
        { "id": 6, "comment": "작지만 강한 노점 창업으로 손님들의 발길을 끌어보세요." },
        { "id": 7, "comment": "즐거움을 선사하는 오락 사업, 트렌드를 주도해보세요!" },
        { "id": 8, "comment": "교육의 힘! 학원과 교육업으로 미래를 밝혀보세요." },
        { "id": 9, "comment": "편리함을 제공하는 편의점 운영으로 일상을 함께하세요." },
        { "id": 10, "comment": "빠르고 정확한 배달 서비스로 고객 만족도를 높여보세요!" },
        { "id": 11, "comment": "특별한 숙박 경험을 제공하여 여행객을 맞이하세요." },
        { "id": 12, "comment": "달콤한 디저트로 행복을 선물하세요!" },
        { "id": 13, "comment": "미용 서비스로 고객의 자신감을 높여보세요." },
        { "id": 14, "comment": "사업 확장과 성장의 기회를 잡아보세요!" },
        { "id": 15, "comment": "혁신적인 기술 창업으로 미래를 선도하세요." },
        { "id": 16, "comment": "스터디 그룹을 통해 함께 성장하는 공간을 만들어보세요." },
        { "id": 17, "comment": "정성 가득한 제과 제품으로 고객을 감동시켜보세요." },
        { "id": 18, "comment": "효율적인 유통망 구축으로 매출을 극대화하세요." },
        { "id": 19, "comment": "무인 창업으로 인건비 절감과 자동화를 실현하세요!" },
        { "id": 20, "comment": "푸드트럭으로 어디서나 맛있는 음식을 제공하세요!" },
        { "id": 21, "comment": "섬세한 네일 아트로 고객의 스타일을 완성하세요." },
        { "id": 22, "comment": "전문적인 서비스로 신뢰를 구축하세요." },
        { "id": 23, "comment": "스타트업으로 혁신을 창출하고 새로운 시장을 개척하세요!" },
        { "id": 24, "comment": "스마트스토어와 쇼핑몰 운영으로 온라인 시장을 선점하세요." },
        { "id": 25, "comment": "반려동물 관련 사업으로 따뜻한 케어를 제공하세요." },
        { "id": 26, "comment": "헬스장 운영으로 건강한 라이프스타일을 돕는 공간을 만드세요." },
        { "id": 27, "comment": "레저 사업으로 여가를 즐기는 고객을 만족시켜보세요!" },
        { "id": 28, "comment": "스크린 스포츠 및 게임으로 색다른 재미를 제공하세요." }
    ]
    const myPackages = packages.filter((pkg) => pkg.industry === industry.id);

    // return
    return (
        <div className={styles.page}>
            <BackHeader />
            <div className={styles.section}>
                <p className={styles.title}>
                    {user?.name}님이 선택한 업종에서<br />한번에 사면 좋은 물품들
                </p>
                <div className={styles.contentContainer}>
                    <div className={styles.contentTextContainer}>
                        <p className={styles.contentTitle}>
                            {industry.name} 패키지 추천
                        </p>
                        <p className={styles.description}>
                            {comments.find((comment) => comment.id === industry.id)?.comment}
                        </p>
                    </div>
                    <div className={styles.blank} />
                    <div className={styles.iconContainer}>
                        <img className={styles.icon} src={industry.icon!}/>
                    </div>
                </div>
                <div className={styles.packageLitView}>
                    {myPackages.map((pkg, index) => {
                        return (
                            <PackageItem key={index} pkg={pkg} />
                        )
                    })}
                </div>
                <div style={{'height': '10rem'}}/>
            </div>
        </div>
    )
}