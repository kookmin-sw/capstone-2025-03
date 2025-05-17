import styles from './SearchCategory.module.css';
import BackButtonForGetCategory from './components/BackButtonForGetCategory';
import LoadingSection from '@/src/components/layout/LoadingSection';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LuSearch } from 'react-icons/lu';
import { useCategory } from '@/src/hooks/useCategory';
import CategoryModel from '@/src/models/CategoryModel';

export default function SearchCategory() {
    // naigate: product 선택에 사용
    const navigate = useNavigate();

    // useState
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { categories, getCategoryList } = useCategory();
    const [searchCategory, setSearchCategory] = useState<string>('');

    // useEffect
    useEffect(() => {
        const fetchCatogories = async () => {
            try {
                setIsLoading(true);
                await getCategoryList();
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCatogories();
    }, [getCategoryList]);

    // TODO: product 선택으로 이동
    const handleCategoryClick = (category: CategoryModel) => {
        navigate('/search-product', { state: { category: category.toJson() } });
    };

    return isLoading ? (
        <LoadingSection text="로딩 중" />
    ) : (
        <div className={styles.page}>
            <div className={styles.inputContainer}>
                <BackButtonForGetCategory />
                <div className={styles.inputMom}>
                    <LuSearch className={styles.icon} />
                    <input
                        value={searchCategory}
                        className={styles.input}
                        placeholder="전체 카테고리"
                        onChange={(e) => setSearchCategory(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.container}>
                {searchCategory === null ? categories.map((category) => (
                    <button
                        key={category.id}
                        className={styles.button}
                        onClick={() => {
                            if (category.id !== null && category.name !== null) {
                                handleCategoryClick(category);
                            }
                        }}
                    >
                        <div className={styles.categoryItem}>
                            <img
                                src={category.thumbnail || '/images/seller/defaultimg.jpg'}
                                alt={category.name || ''}
                                className={styles.thumbnail}
                            />
                            <span className={styles.name}>{category.name}</span>
                        </div>
                    </button>
                )) : (categories.filter((item) => item.name?.includes(searchCategory))).map((category) => (
                    <button
                        key={category.id}
                        className={styles.button}
                        onClick={() => {
                            if (category.id !== null && category.name !== null) {
                                handleCategoryClick(category);
                            }
                        }}
                    >
                        <div className={styles.categoryItem}>
                            <img
                                src={category.thumbnail || '/images/seller/defaultimg.jpg'}
                                alt={category.name || ''}
                                className={styles.thumbnail}
                            />
                            <span className={styles.name}>{category.name}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
