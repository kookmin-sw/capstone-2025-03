import { useRecoilState } from 'recoil';
import { packageState, packageNextPageUrlState, packageHasRequestOnceState } from '../recoil/packageState';
import {
    getPackageListInService,
    createPackageInService,
    getPackageInService,
    updatePackageInService,
    deletePackageInService,
} from '../services/packageService';
import PackageModel from '../models/PackageModel';
import packageDummyData from '@/src/data/packageDummyData.json';
import { useCategory } from './useCategory';
import { useProduct } from './useProduct';

const useDummyData = false;

export const usePackage = () => {
    const [packages, setPackages] = useRecoilState(packageState);
    const { categories, getCategory } = useCategory();
    const { products, getProduct } = useProduct();
    const [nextPageUrl, setNextPageUrl] = useRecoilState(packageNextPageUrlState);
    const [hasRequestOnce, setHasRequestOnce] = useRecoilState(packageHasRequestOnceState);
    const PAGE_SIZE = 10;

    // List Read
    const getPackageList = async (industry: number | null): Promise<PackageModel[]> => {
        if (!nextPageUrl && hasRequestOnce) return packages;

        // TODO: 임시 이슈 해결
        if(industry){
            setNextPageUrl(null);
            setHasRequestOnce(false);
        }

        const response: { results: PackageModel[], next: string | null } | null = useDummyData
            ? {
                results: packageDummyData.map((pkg) => PackageModel.fromJson(pkg)),
                next: null
            }
            : await getPackageListInService(nextPageUrl, PAGE_SIZE, industry);

        let newPackages: PackageModel[] = [];
        if (response) {
            newPackages = response.results;
            setPackages((prev) => [...prev, ...newPackages]);
            setNextPageUrl(response.next);
            setHasRequestOnce(true);

            // 중복 확인을 위한 Set 생성 (O(1) 조회)
            const categoryIdSet = new Set(categories.map((category) => category.id));
            const productIdSet = new Set(products.map((product) => product.id));

            // 누락된 category 가져오기 (중복 제거)
            const missingCategoryIds = Array.from(
                new Set(
                    newPackages
                        .flatMap((pkg) => pkg.categories)
                        .filter((categoryId) => !categoryIdSet.has(categoryId)),
                ),
            );

            // 누락된 product 가져오기 (중복 제거)
            const missingProductIds = Array.from(
                new Set(
                    newPackages
                        .flatMap((pkg) => pkg.products)
                        .filter((productId) => !productIdSet.has(productId)),
                ),
            );

            // API 호출 (누락된 ID가 있을 경우에만 실행)
            if (missingCategoryIds.length) missingCategoryIds.forEach(getCategory);
            if (missingProductIds.length) {
                await Promise.all(missingProductIds.map(getProduct));
            }
        }

        return newPackages;
    };

    // Create
    const createPackage = async (packageData: PackageModel): Promise<PackageModel | null> => {
        if (useDummyData) {
            const newPackage = PackageModel.fromJson({
                ...packageData,
                id: packages.length + 1,
            }); // 임시 ID 생성
            setPackages((prevPackages) => [...prevPackages, newPackage]);
            return newPackage;
        }

        const newPackage = await createPackageInService(packageData);
        if (newPackage) setPackages((prevPackages) => [...prevPackages, newPackage]);
        return newPackage;
    };

    // Read
    const getPackage = async (packageId: number): Promise<PackageModel | null> => {
        const targetPackage = packages.find((pkg) => pkg.id === packageId);
        if (targetPackage) return targetPackage;

        // 새 패키지 데이터 가져오기
        const foundPackage = useDummyData
            ? packageDummyData.find((pkg) => pkg.id === packageId)
            : await getPackageInService(packageId);

        const newPackage = foundPackage ? PackageModel.fromJson(foundPackage) : null;
        if (!newPackage) return null;

        // 중복 확인을 위한 Set 생성
        const categoryIdSet = new Set(categories.map((category) => category.id));
        const productIdSet = new Set(products.map((product) => product.id));

        // 누락된 category 및 product 가져오기
        const missingCategoryIds = newPackage.categories.filter(
            (categoryId) => !categoryIdSet.has(categoryId),
        );
        const missingProductIds = newPackage.products.filter(
            (productId) => !productIdSet.has(productId),
        );

        // API 호출 (누락된 경우에만 실행)
        if (missingCategoryIds.length) missingCategoryIds.forEach(getCategory);
        if (missingProductIds.length) {
            for (const productId of missingProductIds) {
                await getProduct(productId);
            }
        }

        // 패키지 상태 업데이트
        setPackages((prevPackages) => [...prevPackages, newPackage]);
        return newPackage;
    };

    // Update
    const updatePackage = async (
        packageId: number,
        updatedData: Partial<PackageModel>,
    ): Promise<PackageModel | null> => {
        if (useDummyData) {
            const updatedPackages = packages.map((pkg) =>
                PackageModel.fromJson(pkg.id === packageId ? { ...pkg, ...updatedData } : pkg),
            );
            setPackages(updatedPackages);
            return updatedPackages.find((pkg) => pkg.id === packageId) || null;
        }

        const newPackage = await updatePackageInService(packageId, updatedData);
        if (newPackage)
            setPackages((prevPackages) =>
                prevPackages.map((pkg) => (pkg.id === packageId ? newPackage : pkg)),
            );
        return newPackage;
    };

    // Delete
    const deletePackage = async (packageId: number): Promise<boolean> => {
        if (useDummyData) {
            setPackages((prevPackages) => prevPackages.filter((pkg) => pkg.id !== packageId));
            return true;
        }

        const isSuccess = await deletePackageInService(packageId);
        if (isSuccess)
            setPackages((prevPackages) => prevPackages.filter((pkg) => pkg.id !== packageId));
        return isSuccess;
    };

    return {
        packages,
        getPackageList,
        createPackage,
        getPackage,
        updatePackage,
        deletePackage,
    };
};
