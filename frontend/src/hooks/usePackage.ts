import { useRecoilState } from "recoil";
import { packageState } from "../recoil/packageState";
import {
    getPackageListInService,
    createPackageInService,
    getPackageInService,
    updatePackageInService,
    deletePackageInService
} from "../services/packageService";
import PackageModel from "../models/PackageModel";
import packageDummyData from "@/src/data/packageDummyData.json";
import { useCategory } from "./useCategory";
import { useBuyerProduct } from "./useBuyerProduct";

const useDummyData = true;

export const usePackage = () => {
    const [packages, setPackages] = useRecoilState(packageState);
    const { categories, getCategory } = useCategory();
    const { buyerProducts, getBuyerProduct } = useBuyerProduct();

    // List Read
    const getPackageList = async (): Promise<PackageModel[]> => {
        let newPackageList = useDummyData
            ? packageDummyData.map(pkg => PackageModel.fromJson(pkg))
            : await getPackageListInService() ?? [];

        if (newPackageList.length) {
            // 중복 확인을 위한 Set 생성 (O(1) 조회)
            const categoryIdSet = new Set(categories.map(category => category.id));
            const productIdSet = new Set(buyerProducts.map(product => product.id));

            // 누락된 category 가져오기
            const missingCategoryIds = newPackageList
                .flatMap(pkg => pkg.categoryIds)
                .filter(categoryId => !categoryIdSet.has(categoryId));

            // 누락된 product 가져오기
            const missingProductIds = newPackageList
                .flatMap(pkg => pkg.productIds)
                .filter(productId => !productIdSet.has(productId));

            // API 호출 (누락된 ID가 있을 경우에만 실행)
            if (missingCategoryIds.length) missingCategoryIds.forEach(getCategory);
            if (missingProductIds.length) {
                for (const productId of missingProductIds) {
                    await getBuyerProduct(productId);
                }
            }
            // 상태 업데이트
            setPackages(newPackageList);
        }

        return newPackageList;
    };

    // Create
    const createPackage = async (packageData: PackageModel): Promise<PackageModel | null> => {
        if (useDummyData) {
            const newPackage = PackageModel.fromJson({ ...packageData, id: packages.length + 1 }); // 임시 ID 생성
            setPackages(prevPackages => [...prevPackages, newPackage]);
            return newPackage;
        }

        const newPackage = await createPackageInService(packageData);
        if (newPackage) setPackages(prevPackages => [...prevPackages, newPackage]);
        return newPackage;
    };

    // Read
    const getPackage = async (packageId: number): Promise<PackageModel | null> => {
        const targetPackage = packages.find(pkg => pkg.id === packageId);
        if (targetPackage) return targetPackage;

        // 새 패키지 데이터 가져오기
        const foundPackage = useDummyData
            ? packageDummyData.find(pkg => pkg.id === packageId)
            : await getPackageInService(packageId);

        const newPackage = foundPackage ? PackageModel.fromJson(foundPackage) : null;
        if (!newPackage) return null;

        // 중복 확인을 위한 Set 생성
        const categoryIdSet = new Set(categories.map(category => category.id));
        const productIdSet = new Set(buyerProducts.map(product => product.id));

        // 누락된 category 및 product 가져오기
        const missingCategoryIds = newPackage.categoryIds.filter(categoryId => !categoryIdSet.has(categoryId));
        const missingProductIds = newPackage.productIds.filter(productId => !productIdSet.has(productId));

        // API 호출 (누락된 경우에만 실행)
        if (missingCategoryIds.length) missingCategoryIds.forEach(getCategory);
        if (missingProductIds.length) {
            for (const productId of missingProductIds) {
                await getBuyerProduct(productId);
            }
        }
                
        // 패키지 상태 업데이트
        setPackages(prevPackages => [...prevPackages, newPackage]);
        return newPackage;
    };

    // Update
    const updatePackage = async (packageId: number, updatedData: Partial<PackageModel>): Promise<PackageModel | null> => {
        if (useDummyData) {
            const updatedPackages = packages.map(pkg =>
                PackageModel.fromJson(pkg.id === packageId ? { ...pkg, ...updatedData } : pkg)
            );
            setPackages(updatedPackages);
            return updatedPackages.find(pkg => pkg.id === packageId) || null;
        }

        const newPackage = await updatePackageInService(packageId, updatedData);
        if (newPackage) setPackages(prevPackages =>
            prevPackages.map(pkg => pkg.id === packageId ? newPackage : pkg)
        );
        return newPackage;
    };

    // Delete
    const deletePackage = async (packageId: number): Promise<boolean> => {
        if (useDummyData) {
            setPackages(prevPackages => prevPackages.filter(pkg => pkg.id !== packageId));
            return true;
        }

        const isSuccess = await deletePackageInService(packageId);
        if (isSuccess) setPackages(prevPackages => prevPackages.filter(pkg => pkg.id !== packageId));
        return isSuccess;
    };

    return { packages, getPackageList, createPackage, getPackage, updatePackage, deletePackage };
};