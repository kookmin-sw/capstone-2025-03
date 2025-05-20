import SearchHeader from '@/src/components/layout/SearchHeader';
import styles from './PackageDetailAddCategory.module.css';
import DefaultButton from '@/src/components/ui/DefaultButton';
import CheckIconImage from '@/src/assets/images/section/check.png';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCategory } from '@/src/hooks/useCategory';
import { useRecoilState } from 'recoil';
import { editingPackageState } from '@/src/recoil/packageState';
import PackageModel from '@/src/models/PackageModel';
import CategoryModel from '@/src/models/CategoryModel';
import IndustryModel from '@/src/models/IndustryModel';
import Joyride from 'react-joyride';
import {
    PackageDetailAddCategorySteps,
    joyrideLocale,
    joyrideStyles,
} from '@/src/components/ui/ToolTipContents';

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
    const [checkedCategoryIds, setCheckedCategoryIds] = useState<number[]>(
        editingPackage?.categories || [],
    );

    // 툴팁 용도
    const [run, setRun] = useState<boolean>(false);
    const [_, setIsReady] = useState<boolean>(false);

    // useEffect

    // 툴팁 용
    const LOCAL_STORAGE_KEY = 'packageDetail_addCategory_tooltip_shown';

    // 개발 중일때
    // localStorage.removeItem('packageDetail_addCategory_tooltip_shown');
    useEffect(() => {
        const alreadyShown = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (!alreadyShown) {
            const timer = setTimeout(() => {
                setIsReady(true);
                setRun(true);
                localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
            }, 300);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        const newMyCategories =
            industry.id === null
                ? categories
                : categories.filter((category) => category.industries.includes(industry.id!));
        setMyCategories(newMyCategories);
    }, []);

    // Function
    const handleItemClick = (categoryId: number) => {
        setCheckedCategoryIds((prev) =>
            prev.includes(categoryId)
                ? prev.filter((item) => item !== categoryId)
                : [...prev, categoryId],
        );
    };
    const handleConfirmButtonClick = () => {
        const newProducts =
            editingPackage?.products.filter((product) =>
                checkedCategoryIds.includes(product.category!),
            ) ?? [];
        const newEditingPackage = PackageModel.fromJson({
            ...editingPackage?.toJson(),
            categories: checkedCategoryIds,
            products: newProducts,
        });

        setEditingPackage(newEditingPackage);
        navigate(-1);
    };

    // return
    return (
        <div className={styles.page}>
            <Joyride
                steps={PackageDetailAddCategorySteps}
                run={run}
                continuous
                disableScrolling
                showSkipButton
                showProgress={false}
                locale={joyrideLocale}
                styles={joyrideStyles}
            />
            <SearchHeader text={`${industry.name ?? '패키지'}에 필요한 물품들`} />
            <div id="introduce" className={styles.section}>
                <div className={styles.listView}>
                    {myCategories.map((category, index) => {
                        return (
                            <div key={index} className={styles.categoryItemContainer}>
                                <div
                                    className={styles.categoryItem}
                                    onClick={() => {
                                        handleItemClick(category.id!);
                                    }}
                                >
                                    <img
                                        className={styles.thumbnail}
                                        src={
                                            category.thumbnail === 'NULL' ||
                                                category.thumbnail === null
                                                ? 'https://static.cdn.kmong.com/gigs/F1zfb1718452618.jpg'
                                                : category.thumbnail
                                        }
                                    />
                                    <p className={styles.name}>{category.name}</p>
                                    <div className={styles.blank} />
                                    {checkedCategoryIds.includes(category.id!) ? (
                                        <img className={styles.checkIcon} src={CheckIconImage} />
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div style={{ height: '20rem' }} />
            </div>
            <DefaultButton
                event={handleConfirmButtonClick}
                isActive={true}
                text="선택한 물품들 넣기"
            />
        </div>
    );
}
