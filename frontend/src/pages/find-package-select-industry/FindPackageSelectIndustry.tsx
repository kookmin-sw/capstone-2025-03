import BackHeader from "@/src/components/layout/BackHeader";
import styles from "./FindPackageSelectIndustry.module.css";
import DefaultButton from "@/src/components/ui/DefaultButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IndustryModel from "@/src/models/IndustryModel";
import { getIndustryData } from "@/src/utils/getIndustryData";
import business from "../../assets/images/industry_icons/business.png";

export default function FindPackageSelectIndustry() {
    const navigate = useNavigate();
    const [currentId, setCurrentId] = useState<number | null>(0);
    const industries: IndustryModel[] = getIndustryData();
    const handleItemClick = (id: number | null) => {
        setCurrentId(id);
    }
    const handleConfirmButtonClick = () => {
        if (currentId === null) return;

        const selectedIndustry = industries.find((item) => item.id === currentId);
        navigate('/find-package-recommend', { state: { industry: selectedIndustry } });
    }

    return (
        <div className={styles.page}>
            <BackHeader />
            <div className={styles.section}>
                <p className={styles.title}>
                    무슨 업종인가요?
                </p>
                <p className={styles.gridViewTitle}>
                    업종
                </p>
                <div className={styles.gridView}>
                    {industries.map((industry, index) => {
                        return (
                            <div key={index} className={styles.industryItem} onClick={() => { handleItemClick(industry.id) }} style={{ border: `solid 1px ${(industry.id === currentId) ? '#00A36C' : '#7F7F89'}` }}>
                                <img className={styles.industryItemIcon} src={industry.icon ?? business} />
                                <p className={styles.industryItemText} style={{ color: industry.id === currentId ? '#00A36C' : '#ffffff' }}>
                                    {industry.name}
                                </p>
                            </div>
                        )
                    })}
                </div>

            </div>
            <div className={styles.buttonContainer}>
                <DefaultButton event={handleConfirmButtonClick} isActive={currentId !== 0} />
            </div>
        </div >
    );
}