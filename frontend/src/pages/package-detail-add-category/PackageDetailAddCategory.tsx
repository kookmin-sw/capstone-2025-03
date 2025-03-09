import SearchHeader from "@/src/components/layout/SearchHeader";
import styles from "./PackageDetailAddCategory.module.css";
import DefaultButton from "@/src/components/ui/DefaultButton";
import EspressoMachineIconImage from "@/src/assets/images/dummy/espresso_machine.png";
import CheckIconImage from "@/src/assets/images/section/check.png";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import IndustryModel from "@/src/models/IndustryModel";
import { useCategory } from "@/src/hooks/useCategory";
import { useRecoilState } from "recoil";
import { editingPackageState } from "@/src/recoil/packageState";
import PackageModel from "@/src/models/PackageModel";
import LoadingSection from "@/src/components/layout/LoadingSection";
import CategoryModel from "@/src/models/CategoryModel";

export default function PackageDetailAddCategory() {
    // page connection
    const navigate = useNavigate();
    const location = useLocation();
    const industry: IndustryModel = IndustryModel.fromJson(location.state.industry || {});
    // hook
    const { categories, getCategory } = useCategory();
    // recoil
    const [editingPackage, setEditingPackage] = useRecoilState(editingPackageState);
    // usestate
    const [myCategories, setMyCategories] = useState<CategoryModel[]>([]);
    const [checkedCategoryIds, setCheckedCategoryIds] = useState<number[]>(editingPackage?.categoryIds || []);
    const [isLoading, setIsLoading] = useState(true);

    // useEffect
    useEffect(() => {
        const missingCategories: number[] = industry.categoryIds.filter(
            (categoryId) => !categories.some((category) => category.id === categoryId)
        );
        missingCategories.forEach((categoryId) => getCategory(categoryId));
    }, [])
    useEffect(() => {
        if (isLoading && industry.categoryIds.every((categoryId) => categories.some((category) => category.id === categoryId))) {
            setMyCategories(
                categories.filter((category) => industry.categoryIds.includes(category.id!))
            );
            setIsLoading(false);
        }
    }, [categories])

    // Function
    const handleItemClick = (categoryId: number) => {
        setCheckedCategoryIds((prev) =>
            prev.includes(categoryId) ? prev.filter((item) => item !== categoryId) : [...prev, categoryId]
        );
    }
    const handleConfirmButtonClick = () => {
        setEditingPackage((prev) => PackageModel.fromJson({
            ...prev,
            categoryIds: checkedCategoryIds
        }))
        navigate(-1);
    }

    // return
    return (
        isLoading ? <LoadingSection text="잠시만 기다려주세요" /> : <div className={styles.page}>
            <SearchHeader text={`${industry.name}에 필요한 물품들`} />
            <div className={styles.section}>
                <div className={styles.listView}>
                    {myCategories.map((category, index) => {
                        return (
                            <div key={index} className={styles.categoryItemContainer}>
                                <div className={styles.categoryItem} onClick={() => { handleItemClick(category.id!) }}>
                                    <img className={styles.thumbnail} src={category.thumbnail!} />
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
            </div>
            <div className={styles.buttonContainer}>
                <DefaultButton event={handleConfirmButtonClick} isActive={true} />
            </div>
        </div>
    )
}