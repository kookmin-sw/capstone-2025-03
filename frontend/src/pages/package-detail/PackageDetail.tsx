import BackHeader from '@/src/components/layout/BackHeader';
import styles from './PackageDetail.module.css';
import DefaultButton from '@/src/components/ui/DefaultButton';
import PackageItem from '@/src/components/ui/PackageItem';
import AddIconImage from '@/src/assets/images/page/package-detail/add_icon.png';
import EditIconImage from '@/src/assets/images/page/package-detail/edit_icon.png';
import ArrowRightIconImage from '@/src/assets/images/page/package-detail/arrow_right.png';
import DeleteIconImage from '@/src/assets/images/page/package-detail/delete.png';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSection from '@/src/components/layout/LoadingSection';
import CompleteSection from '@/src/components/layout/CompleteSection';
import PackageModel from '@/src/models/PackageModel';
import CategoryModel from '@/src/models/CategoryModel';
import { useRecoilState } from 'recoil';
import { editingPackageState } from '@/src/recoil/packageState';
import { useCategory } from '@/src/hooks/useCategory';
import industryData from '@/src/data/industryData.json';
import { useOrder } from '@/src/hooks/useOrder';
import OrderModel from '@/src/models/OrderModel';
import { useUser } from '@/src/contexts/UserContext';

export default function PackageDetail() {
    // page connection
    const navigate = useNavigate();
    const location = useLocation();
    const myPackage: PackageModel = PackageModel.fromJson(location.state?.pkg || {});
    // context
    const { user } = useUser();
    // hook
    const { categories } = useCategory();
    const { createOrder } = useOrder();
    // recoil
    const [editingPackage, setEditingPackage] = useRecoilState(editingPackageState);
    // useState
    const [myCategories, setMyCategories] = useState<CategoryModel[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // UseEffect
    useEffect(() => {

        let targetPackage = null;
        if (!editingPackage) {
            targetPackage = myPackage;
            setEditingPackage(myPackage);
        } else {
            targetPackage = editingPackage;
        }
        const newMyCategories: CategoryModel[] = targetPackage.categories
            .map((categoryId) => categories.find((category) => category.id === categoryId))
            .filter(Boolean) as CategoryModel[];
        setMyCategories(newMyCategories);
    }, []);

    // Function
    const handleAddCategoryButtonClick = () => {
        navigate('/package-detail-add-category', {
            state: {
                industry: industryData.find((industry) => industry.id === myPackage.industry),
            },
        });
    };
    const handleEditButtonClick = () => {
        setIsEdit(!isEdit);
    };
    const handleBuyButtonClick = () => {
        setIsModalOpen(!isModalOpen);
    };
    const handleBuyConfirmButtonClick = async () => {
        setIsLoading(true);

        if (!user) {
            window.alert('유저 정보가 없습니다. 새로고침 해주세요!');
            localStorage.removeItem('user');
            setIsLoading(false);
            return;
        }
        if (!editingPackage) {
            setIsLoading(false);
            return;
        }
        const newOrder: OrderModel = OrderModel.fromJson({
            user: user.userId,
            products: editingPackage.products,
        });
        const response = await createOrder(newOrder);
        if (!response) {
            window.alert('주문에 오류가 발생하였습니다');
        }
        setIsComplete(true);
    };
    const handleAddProductButtonClick = (category: CategoryModel) => {
        navigate('/package-detail-add-product', { state: { category: category.toJson() } });
    };
    const handleDeleteButtonClick = (productId: number) => {
        if (!editingPackage) return;

        const targetProduct = editingPackage.products.find(
            (product) => product.id === productId
        );
        if (!targetProduct) return;

        const numProductsInSameCategory =
            editingPackage.products.filter(
                (product) => product.category === targetProduct.category
            )?.length ?? 0;

        // 안전하게 복사
        let newCategories = [...(editingPackage.categories ?? [])];

        if (numProductsInSameCategory <= 1) {
            setMyCategories((prev) =>
                prev.filter((category) => category.id !== targetProduct.category)
            );
            newCategories = newCategories.filter((id) => id !== targetProduct.category);
        }

        setEditingPackage((prev) => {
            if (!prev) return prev;
            return new PackageModel({
                ...prev,
                categories: newCategories,
                products: prev.products.filter((product) => product.id !== productId),
            });
        });
    };

    // return
    return isLoading ? (
        isComplete ? (
            <CompleteSection text="패키지 구매 신청 완료!" />
        ) : (
            <LoadingSection text="잠시만 기다려주세요" />
        )
    ) : (
        <div className={styles.page}>
            <BackHeader />
            <div className={styles.section}>
                <div className={styles.packageCard}>
                    {editingPackage && <PackageItem pkg={editingPackage} />}
                </div>
                <div className={styles.titleContainer}>
                    <p className={styles.listViewTitle}>구성상품</p>
                    <div className={styles.blank} />
                    <div className={styles.iconButtonContainer}>
                        <button
                            className={styles.iconButton}
                            onClick={handleAddCategoryButtonClick}
                        >
                            <img className={styles.iconButtonImage} src={AddIconImage} />
                        </button>
                        <button
                            className={styles.iconButton}
                            onClick={handleEditButtonClick}
                            style={{ backgroundColor: `${!isEdit ? '#00A36C' : '#7F7F89'}` }}
                        >
                            <img className={styles.iconButtonImage} src={EditIconImage} />
                        </button>
                    </div>
                </div>
                <div className={styles.listView}>
                    {/* 1. 카테고리 순서대로 정렬된 products */}
                    {myCategories.map((category) => {
                        const categoryProducts = editingPackage?.products.filter(
                            (product) => product.category === category.id
                        ) || [];

                        return categoryProducts.map((product) => (
                            <div
                                key={`product-${product.id}`}
                                className={styles.productItem}
                                onClick={() => handleAddProductButtonClick(category)}
                            >
                                <img
                                    className={styles.productThumbnail}
                                    src={
                                        product.images.length > 0
                                            ? product.images[0]
                                            : 'https://www.urbanbrush.net/web/wp-content/uploads/edd/2023/03/urban-20230310112234917676-1024x1024.jpg'
                                    }
                                />
                                <div className={styles.productDetailContainer}>
                                    <div className={styles.productInfoContainer}>
                                        <p className={styles.productName}>{product.name}</p>
                                        <p className={styles.categoryAndAmount}>
                                            {category.name} {product.quantity}개
                                        </p>
                                    </div>
                                    <p className={styles.price}>{product.price}원</p>
                                </div>
                                {isEdit ? (
                                    <button
                                        className={styles.deleteProductButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteButtonClick(product.id!);
                                        }}
                                    >
                                        <img
                                            className={styles.deleteProductButtonIcon}
                                            src={DeleteIconImage}
                                        />
                                    </button>
                                ) : (
                                    <button className={styles.searchOtherProductsButton}>
                                        <img
                                            className={styles.searchOtherProductsButtonIcon}
                                            src={ArrowRightIconImage}
                                        />
                                    </button>
                                )}
                            </div>
                        ));
                    })}

                    {/* 2. 제품이 아예 없는 카테고리 */}
                    {myCategories
                        .filter((category) => !editingPackage?.products.some((product) => product.category === category.id))
                        .map((category) => (
                            <div
                                key={`category-${category.id}`}
                                className={styles.productItem}
                                onClick={() => handleAddProductButtonClick(category)}
                            >
                                <img
                                    className={styles.productThumbnail}
                                    src="https://www.urbanbrush.net/web/wp-content/uploads/edd/2023/03/urban-20230310112234917676-1024x1024.jpg"
                                />
                                <div className={styles.productDetailContainer}>
                                    <div className={styles.productInfoContainer}>
                                        <p className={styles.productName}></p>
                                        <p className={styles.categoryAndAmount}>
                                            {category.name} 제품을 골라주세요!
                                        </p>
                                    </div>
                                </div>
                                <button className={styles.searchOtherProductsButton}>
                                    <img
                                        className={styles.searchOtherProductsButtonIcon}
                                        src={ArrowRightIconImage}
                                    />
                                </button>
                            </div>
                        ))}
                </div>
                <div style={{ height: '20rem' }} />
            </div>
            <DefaultButton
                event={() => {
                    if (isEdit) {
                        setIsEdit(false);
                    } else {
                        handleBuyButtonClick();
                    }
                }}
                isActive={true}
                text={isEdit ? '완료' : '한번에 구매하기'}
            />

            {/* Modal */}
            {isModalOpen && (
                <div className={styles.overlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <p className={styles.modalTitle}>
                            선택한 물품들을 한번에
                            <br />
                            구매하시겠어요?
                        </p>
                        <p className={styles.description}>결제와 배송은 카카오톡으로 진행됩니다.</p>
                        <button
                            className={styles.buttonInModal}
                            onClick={handleBuyConfirmButtonClick}
                        >
                            <p>한번에 구매할게요</p>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
