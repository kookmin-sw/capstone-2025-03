import SearchHeader from "@/src/components/layout/SearchHeader";
import styles from "./PackageDetailAddProduct.module.css";
import DefaultButton from "@/src/components/ui/DefaultButton";
import ProductItem from "@/src/components/ui/ProductItem";
import { useLocation, useNavigate } from "react-router-dom";
import CheckIconImage from "../../assets/images/section/check.png";
import CategoryModel from "@/src/models/CategoryModel";
import { useBuyerProduct } from "@/src/hooks/useBuyerProduct";
import { useEffect, useState } from "react";
import BuyerProductModel from "@/src/models/BuyerProductModel";
import { useRecoilState } from "recoil";
import { editingPackageState } from "@/src/recoil/packageState";
import PackageModel from "@/src/models/PackageModel";

export default function PackageDetailAddProduct() {
    // page connection
    const navigate = useNavigate();
    const location = useLocation();
    const category: CategoryModel = CategoryModel.fromJson(location.state?.category || {});
    // hook
    const { buyerProducts, getBuyerProductList } = useBuyerProduct();
    // recoil
    const [editingPackage, setEditingPackage] = useRecoilState(editingPackageState);
    // useState
    const [myProducts, setMyProducts] = useState<BuyerProductModel[]>([]);
    const [checkedProductIds, setCheckedProductIds] = useState<number[]>([]);

    // useEffect
    useEffect(() => {
        setMyProducts(buyerProducts.filter((buyerProduct) => buyerProduct.categoryId === category.id));
        setCheckedProductIds(
            buyerProducts
                .filter((buyerProduct) => (editingPackage?.productIds || []).includes(buyerProduct.id!))
                .map((buyerProduct) => buyerProduct.id!)
        );
        getBuyerProductList();
    }, []);
    useEffect(() => {
        setMyProducts(buyerProducts.filter((buyerProduct) => buyerProduct.categoryId === category.id));
    }, [buyerProducts]);

    // Function
    const handleProductItemClick = (product: BuyerProductModel) => {
        navigate('/package-detail-product-detail', {
            state: { product: product }
        });
    }
    const handleCheckButtonClick = (productId: number) => {
        setCheckedProductIds((prev) =>
            prev.includes(productId) ? prev.filter((item) => item !== productId) : [...prev, productId]
        );
    }
    const handleConfirmButtonClick = () => {
        setEditingPackage((prev) => PackageModel.fromJson({
            ...prev,
            productIds: checkedProductIds
        }))
        navigate(-1);
    }

    return (
        <div className={styles.page}>
            <SearchHeader text={category.name || ""} />
            <div className={styles.section}>
                <div className={styles.listView}>
                    {myProducts.map((product, index) => {
                        return (
                            <div key={index} className={styles.checkableProductItem} onClick={() => handleProductItemClick(product)}>
                                <ProductItem product={product} />
                                <div className={styles.blank} />
                                <img onClick={() => handleCheckButtonClick(product.id!)} className={styles.checkIcon} src={CheckIconImage} style={{ opacity: checkedProductIds.includes(product.id!) ? '1' : '0.5' }} />
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