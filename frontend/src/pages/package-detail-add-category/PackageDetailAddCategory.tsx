import SearchHeader from "@/src/components/layout/SearchHeader";
import styles from "./PackageDetailAddCategory.module.css";
import DefaultButton from "@/src/components/ui/DefaultButton";
import EspressoMachineIconImage from "../../assets/images/dummy/espresso_machine.png";
import CheckIconImage from "../../assets/images/section/check.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PackageDetailAddCategory() {
    const navigate = useNavigate();
    const [checkedIds, setCheckedIds] = useState<string[]>([]);
    const categories: { id: string, thumbnail: string, name: string }[] = [
        { id: '0', thumbnail: EspressoMachineIconImage, name: '에스프레소머신' },
        { id: '1', thumbnail: EspressoMachineIconImage, name: '에스프레소머신' },
        { id: '2', thumbnail: EspressoMachineIconImage, name: '에스프레소머신' },
        { id: '3', thumbnail: EspressoMachineIconImage, name: '에스프레소머신' },
        { id: '4', thumbnail: EspressoMachineIconImage, name: '에스프레소머신' },
        { id: '5', thumbnail: EspressoMachineIconImage, name: '에스프레소머신' },
    ];

    const handleItemClick = (id: string) => {
        setCheckedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    }

    const handleConfirmButtonClick = () => {
        navigate(-1);
    }

    return (
        <div className={styles.page}>
            <SearchHeader text="카페에 필요한 물품들" />
            <div className={styles.section}>
                <div className={styles.listView}>
                    {categories.map((category, index) => {
                        return (
                            <div className={styles.categoryItemContainer}>
                                <div key={index} className={styles.categoryItem} onClick={() => { handleItemClick(category.id) }}>
                                    <img className={styles.thumbnail} src={category.thumbnail} />
                                    <p className={styles.name}>
                                        {category.name}
                                    </p>
                                    <div className={styles.blank} />
                                    {checkedIds.includes(category.id) ? <img className={styles.checkIcon} src={CheckIconImage} /> : null}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <DefaultButton event={handleConfirmButtonClick} isActive={true} />
            </div>
        </div>
    )
}