import styles from './SellerSalesListAddProductGetCategory.module.css';
import BackButtonForGetCategory from './components/BackButtonForGetCategory';
import LoadingSection from '@/src/components/layout/LoadingSection';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LuSearch } from 'react-icons/lu';
import { useCategory } from '@/src/hooks/useCategory';
import { sellerProductState } from '@/src/recoil/sellerProductState';
import { useRecoilState } from 'recoil';
import SellerProductModel from '@/src/models/SellerProductModel';

export default function SellerSalesListAddProductGetCategory() {
    const [sellerProduct, setSellerProduct] = useRecoilState(sellerProductState);

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { categories, getCategoryList } = useCategory();
    const [searchCategory, setSearchCategory] = useState<string>('');

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

    }, []);

    const handleCategoryClick = (id: number, name: string) => {
        setSellerProduct(
            (prev) => new SellerProductModel({ ...prev, categoryId: id, categoryName: name }),
        );
        navigate('/seller-saleslist-addproduct');
    };

    const filteredCategories = categories.filter((category) =>
        category.name?.toLowerCase().includes(searchCategory.toLowerCase()),
    );

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
                {filteredCategories.map((category) => (
                    <button
                        className={styles.button}
                        onClick={() =>
                            category.id !== null &&
                            category.name !== null &&
                            handleCategoryClick(category.id, category.name)
                        }
                    >
                        <div key={category.id} className={styles.categoryItem}>
                            <img
                                src={
                                    category.thumbnail !== 'NULL' && category.thumbnail
                                        ? category.thumbnail
                                        : '/images/seller/defaultimg.jpg'
                                }
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
