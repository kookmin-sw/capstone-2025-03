import SearchHeader from "@/src/components/layout/SearchHeader";
import styles from "./PackageDetailAddCategory.module.css";
import DefaultButton from "@/src/components/ui/DefaultButton";
import CheckIconImage from "@/src/assets/images/section/check.png";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCategory } from "@/src/hooks/useCategory";
import { useRecoilState } from "recoil";
import { editingPackageState } from "@/src/recoil/packageState";
import PackageModel from "@/src/models/PackageModel";
import CategoryModel from "@/src/models/CategoryModel";
import IndustryModel from "@/src/models/IndustryModel";

export default function PackageDetailAddCategory() {
    // page connection
    const navigate = useNavigate();
    const location = useLocation();
    const industry: IndustryModel = IndustryModel.fromJson(location.state.industry || {});
    // hook
    const { categories } = useCategory();
    // recoil
    const [editingPackage, setEditingPackage] = useRecoilState(editingPackageState);
    // usestate
    const [myCategories, setMyCategories] = useState<CategoryModel[]>([]);
    const [checkedCategoryIds, setCheckedCategoryIds] = useState<number[]>(editingPackage?.categories || []);

    // useEffect
    useEffect(() => {
        setMyCategories(categories.filter((category) => category.industries.includes(industry.id!)));
    }, [])

    // Function
    const handleItemClick = (categoryId: number) => {
        setCheckedCategoryIds((prev) =>
            prev.includes(categoryId) ? prev.filter((item) => item !== categoryId) : [...prev, categoryId]
        );
    }
    const handleConfirmButtonClick = () => {
        const newEditingPackage = PackageModel.fromJson({
            ...editingPackage?.toJson(),
            "categories": checkedCategoryIds
        });
        setEditingPackage(newEditingPackage);
        navigate(-1);
    }

    // return
    return (
        <div className={styles.page}>
            <SearchHeader text={`${industry.name}에 필요한 물품들`} />
            <div className={styles.section}>
                <div className={styles.listView}>
                    {myCategories.map((category, index) => {
                        return (
                            <div key={index} className={styles.categoryItemContainer}>
                                <div className={styles.categoryItem} onClick={() => { handleItemClick(category.id!) }}>
                                    <img className={styles.thumbnail} src={category.thumbnail || "https://static.cdn.kmong.com/gigs/F1zfb1718452618.jpg"} />
                                    <p className={styles.name}>
                                        {category.name}
                                    </p>
                                    <div className={styles.blank} />
                                    {checkedCategoryIds.includes(category.id!) ? <img className={styles.checkIcon} src={CheckIconImage} /> : null}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div style={{'height': '20rem'}}/>
            </div>
            <DefaultButton event={handleConfirmButtonClick} isActive={true} text="선택한 물품들 넣기"/>
        </div>
    )
}