import BackHeader from "@/src/components/layout/BackHeader";
import styles from "./FindPackageSelectIndustry.module.css";
import DefaultButton from "@/src/components/ui/DefaultButton";
import BreadImage from "../../assets/images/industry/bread.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FindPackageSelectIndustry() {
    const navigate = useNavigate();
    const [currentId, setCurrentId] = useState('');
    const industries: { id: string, icon: string, name: string }[] = [
        { id: '0', icon: BreadImage, name: "제과" },
        { id: '1', icon: BreadImage, name: "제과" },
        { id: '2', icon: BreadImage, name: "제과" },
        { id: '3', icon: BreadImage, name: "제과" },
        { id: '4', icon: BreadImage, name: "제과" },
        { id: '5', icon: BreadImage, name: "제과" },
        { id: '6', icon: BreadImage, name: "제과" },
        { id: '7', icon: BreadImage, name: "제과" },
    ];
    const handleItemClick = (id: string) => {
        setCurrentId(id);
    }
    const handleConfirmButtonClick = () => {
        const selectedIndustry = industries.find((item) => item.id === currentId);
        navigate('/find-package-recommend', { state: { industry: selectedIndustry} });
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
                                <img className={styles.industryItemIcon} src={industry.icon} />
                                <p className={styles.industryItemText} style={{ color: industry.id === currentId ? '#00A36C' : '#ffffff' }}>
                                    {industry.name}
                                </p>
                            </div>
                        )
                    })}
                </div>

            </div>
            <div className={styles.buttonContainer}>
                <DefaultButton event={handleConfirmButtonClick} isActive={currentId !== ''} />
            </div>
        </div >
    );
}