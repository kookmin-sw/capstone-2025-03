import SearchHeader from "@/src/components/layout/SearchHeader";
import styles from "./PackageDetailAddProduct.module.css";
import DefaultButton from "@/src/components/ui/DefaultButton";
import ProductItem from "@/src/components/ui/BuyerProductItem";
import { useLocation, useNavigate } from "react-router-dom";
import CheckIconImage from "@/src/assets/images/section/check.png";
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
        setMyProducts(buyerProducts.filter((buyerProduct) => buyerProduct.category === category.id));
        setCheckedProductIds(
            buyerProducts
                .filter((buyerProduct) => (editingPackage?.products || []).includes(buyerProduct.id!))
                .map((buyerProduct) => buyerProduct.id!)
        );
        getBuyerProductList();
    }, []);
    useEffect(() => {
        setMyProducts(buyerProducts.filter((buyerProduct) => buyerProduct.category === category.id));
    }, [buyerProducts]);

    // Function
    const handleProductItemClick = (product: BuyerProductModel) => {
        navigate('/package-detail-product-detail', {
            state: { product: product.toJson() }
        });
    }
    const handleCheckButtonClick = (productId: number) => {
        setCheckedProductIds((prev) =>
            prev.includes(productId) ? prev.filter((item) => item !== productId) : [...prev, productId]
        );
    }
    const handleConfirmButtonClick = () => {
        setEditingPackage((prev) => PackageModel.fromJson({
            ...prev?.toJson(),
            "products": checkedProductIds
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
                                <img onClick={(e) => {
                                    e.stopPropagation();
                                    handleCheckButtonClick(product.id!)
                                }} className={styles.checkIcon} src={CheckIconImage} style={{ opacity: checkedProductIds.includes(product.id!) ? '1' : '0.5' }} />
                            </div>
                        )
                    })}
                </div>
                <div style={{'height': '20rem'}}/>
            </div>
            <DefaultButton event={handleConfirmButtonClick} isActive={true} text={`선택한 ${category.name} 넣기`}/>
        </div>
    )
}