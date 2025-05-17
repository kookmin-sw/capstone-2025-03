import BackHeader from '@/src/components/layout/BackHeader';
import styles from './PackageDetail.module.css';
import DefaultButton from '@/src/components/ui/DefaultButton';
import PackageItem from '@/src/components/ui/PackageItem';
import CustomPackageItem from '@/src/components/ui/CustomPackage';
import AddIconImage from '@/src/assets/images/page/package-detail/add_icon.png';
import EditIconImage from '@/src/assets/images/page/package-detail/edit_icon.png';
import ArrowRightIconImage from '@/src/assets/images/page/package-detail/arrow_right.png';
import DeleteIconImage from '@/src/assets/images/page/package-detail/delete.png';
import { useState } from 'react';
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
import { useUpdatePackage, useDeletePackage } from '@/src/hooks/useCustomPackage';
import ProductModel from '@/src/models/ProductModel';
import ProductImage from '@/src/assets/images/alternative/product.png';

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
    const { mutateAsync: updatePackage } = useUpdatePackage();
    const { mutateAsync: deletePackage } = useDeletePackage();
    // recoil
    const [editingPackage, setEditingPackage] = useRecoilState(editingPackageState);
    // useState
    const [isComplete, setIsComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState<string>(myPackage.name ?? '');
    const [description, setDescription] = useState<string>(myPackage.description ?? '');
    const [isFavorite, setIsFavorite] = useState(true);

    // Function
    const handleAddCategoryButtonClick = () => {
        navigate('/package-detail-add-category', {
            state: {
                industry: industryData.find((industry) => industry.id === editingPackage!.industry),
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
            products: editingPackage.products.map((product) => product.id),
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
    const handleDeleteButtonClick = (selectedProduct: ProductModel) => {
        const targetCategory = selectedProduct.category;
        let newCategories = [];
        const newProducts = editingPackage?.products.filter((product) => product.id !== selectedProduct.id)!!;
        const productsByTargetCategory = newProducts?.filter((product) => product.category === targetCategory);

        if (productsByTargetCategory?.length !== 0) {
            newCategories = editingPackage?.categories!;
        } else {
            newCategories = editingPackage?.categories.filter((category) => category !== targetCategory) ?? [];
        }

        const newPackage = PackageModel.fromJson({
            ...editingPackage?.toJson(),
            products: newProducts,
            categories: newCategories
        });

        setEditingPackage(newPackage);
    };
    const save = async () => {
        if (!editingPackage || !user) {
            window.alert('오류가 발생하였습니다. 다시 한번 저장해주세요');
            return;
        }

        if (isFavorite) {
            await updatePackage({
                id: editingPackage.id!, updatedData: {
                    ...editingPackage.toJson(),
                    product_ids: editingPackage.products.map((product) => product.id),
                    name: name,
                    description: description,
                }
            });
            window.alert('변경 사항이 저장되었습니다.')
        } else {
            await deletePackage({ id: editingPackage.id!, user: user.userId! });
            window.alert('패키지가 찜 리스트에서 제외되었습니다');
            navigate(-1);
        }
    }

    // return
    return isLoading ? (
        isComplete ? (
            <CompleteSection text="패키지 구매 신청 완료!" redirectTo='/' />
        ) : (
            <LoadingSection text="잠시만 기다려주세요" />
        )
    ) : (
        myPackage.id !== editingPackage?.id ? <LoadingSection text='로딩 중...' />
            : <div className={styles.page}>
                <BackHeader />
                <div className={styles.section}>
                    {editingPackage && <div className={styles.packageCard}>
                        {editingPackage.user === user?.userId ? <CustomPackageItem pkg={editingPackage} name={name} setName={setName} description={description}
                            setDescription={setDescription} isFavorite={isFavorite} setIsFavorite={setIsFavorite} save={save} /> : <PackageItem pkg={editingPackage} fromDetail={true} />}
                    </div>}
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
                        {categories.filter((item) => editingPackage?.categories.includes(item.id!)).map((category) => {
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
                                                : ProductImage
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
                                                handleDeleteButtonClick(product);
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
                        {categories.filter((item) => editingPackage?.categories.includes(item.id!))
                            .filter((category) => !editingPackage?.products.some((product) => product.category === category.id))
                            .map((category) => (
                                <div
                                    key={`category-${category.id}`}
                                    className={styles.productItem}
                                    onClick={() => handleAddProductButtonClick(category)}
                                >
                                    <img
                                        className={styles.productThumbnail}
                                        src={ProductImage}
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
