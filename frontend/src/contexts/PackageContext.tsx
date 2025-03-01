import React, { createContext, useContext, useState, ReactNode } from "react";
import PackageModel from "../models/PackageModel";
import {
    createPackageInService,
    getPackageInService,
    updatePackageInService,
    deletePackageInService,
} from "../services/packageService";
import { getCategoriesAndProductsInBatch } from "../services/batchService";
import CategoryModel from "../models/CategoryModel";
import ProductModel from "../models/ProductModel";
import { useCategory } from "../contexts/CategoryContext";
import { useProduct } from "../contexts/ProductContext";

// Context에서 사용할 타입 정의
interface PackageContextType {
    packages: PackageModel[];
    fetchPackage: (packageId: number) => Promise<PackageModel | null>;
    createPackage: (newPackage: PackageModel) => Promise<void>;
    updatePackage: (packageId: number, updatedData: Partial<PackageModel>) => Promise<void>;
    deletePackage: (packageId: number) => Promise<void>;
    setPackages: React.Dispatch<React.SetStateAction<PackageModel[]>>;
}

// Context 생성
const PackageContext = createContext<PackageContextType | undefined>(undefined);

// Provider 컴포넌트
export const PackageProvider = ({ children }: { children: ReactNode }) => {
    const [packages, setPackages] = useState<PackageModel[]>([]);
    const { categories, setCategories } = useCategory();
    const { products, setProducts } = useProduct();

    // 패키지 생성
    const createPackage = async (newPackage: PackageModel) => {
        try {
            await createPackageInService(newPackage);
            setPackages(prev => [...prev, newPackage]);
        } catch (error) {
            console.error("Error creating package in context:", error);
            throw error;
        }
    };

    // 특정 패키지 가져오기 및 관련 데이터 불러오기
    const fetchPackage = async (packageId: number): Promise<PackageModel | null> => {
        try {
            const existingPackage = packages.find(pkg => pkg.id === packageId);
            if (existingPackage) return existingPackage;

            const fetchedPackage = await getPackageInService(packageId);
            if (fetchedPackage) {
                // 이미 있는 데이터 필터링하여 요청할 목록 결정
                const missingCategoryIds = fetchedPackage.categoryIds.filter(id => !categories.some(c => c.id === id));
                const missingProductIds = fetchedPackage.productIds.filter(id => !products.some(p => p.id === id));

                if (missingCategoryIds.length > 0 || missingProductIds.length > 0) {
                    const { categories: newCategories, products: newProducts } = await getCategoriesAndProductsInBatch(
                        missingCategoryIds,
                        missingProductIds
                    );

                    setCategories(prev => [...prev, ...newCategories.map(c => new CategoryModel(c))]);
                    setProducts(prev => [...prev, ...newProducts.map(p => new ProductModel(p))]);
                }

                setPackages(prev => [...prev, fetchedPackage]);
            }
            return fetchedPackage;
        } catch (error) {
            console.error("Error fetching package in context:", error);
            return null;
        }
    };

    // 패키지 업데이트
    const updatePackage = async (packageId: number, updatedData: Partial<PackageModel>) => {
        try {
            await updatePackageInService(packageId, updatedData);
            setPackages(prev => prev.map(pkg =>
                pkg.id === packageId ? new PackageModel({ ...pkg, ...updatedData }) : pkg
            ));
        } catch (error) {
            console.error("Error updating package in context:", error);
            throw error;
        }
    };

    // 패키지 삭제
    const deletePackage = async (packageId: number) => {
        try {
            await deletePackageInService(packageId);
            setPackages(prev => prev.filter(pkg => pkg.id !== packageId));
        } catch (error) {
            console.error("Error deleting package in context:", error);
            throw error;
        }
    };

    return (
        <PackageContext.Provider
            value={{ packages, fetchPackage, createPackage, updatePackage, deletePackage, setPackages }}
        >
            {children}
        </PackageContext.Provider>
    );
};

// Context를 사용하는 커스텀 훅
export const usePackage = (): PackageContextType => {
    const context = useContext(PackageContext);
    if (!context) {
        throw new Error("usePackage must be used within a PackageProvider");
    }
    return context;
};