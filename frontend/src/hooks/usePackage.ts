import { useRecoilState } from 'recoil';
import { packageListState } from '../recoil/packageState';
import { packagePaginationState } from '../recoil/packagePaginationState';
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


const useDummyData = false;

export const usePackage = () => {
    const [packageList, setPackageList] = useRecoilState(packageListState);
    const [packagePagination, setPackagePagination] = useRecoilState(packagePaginationState);
    const PAGE_SIZE = 5;
    const { categories, getCategoryList } = useCategory();

    // List Read
    const getPackageList = async (industry: number | null): Promise<PackageModel[]> => {
        if (categories.length<1) {
            await getCategoryList();
        }

        // industry string으로 변경 (전체 읽기인 경우, null로 전달 받음)
        const myIndustry: string = industry?.toString() ?? 'all';
        const { next: myNext = null, hasMore: myHasMore = true } = packagePagination[myIndustry] || {};

        // 더이상 데이터가 없으면 빈 배열 리턴
        if (!myHasMore) return [];

        // 응답
        const response: { results: PackageModel[], next: string | null } | null = useDummyData
            ? {
                results: packageDummyData.map((pkg) => PackageModel.fromJson(pkg)),
                next: null
            }
            : await getPackageListInService(myNext, PAGE_SIZE, myIndustry);

        let newPackages: PackageModel[] = [];
        if (response) {
            newPackages = response.results;
            setPackageList((prev) => {
                // 빠른 탐색을 위한 Set
                const existingIds = new Set(prev.map((pkg) => pkg.id));
                const filteredNewPackages = newPackages.filter((pkg) => !existingIds.has(pkg.id));
                return [...prev, ...filteredNewPackages];
            });
            setPackagePagination((prev) => ({
                ...prev,
                [myIndustry]: {
                    next: response.next,
                    hasMore: response.next !== null
                }
            }));
        }

        return newPackages;
    };

    // Create
    const createPackage = async (packageData: PackageModel): Promise<PackageModel | null> => {
        if (useDummyData) {
            const newPackage = PackageModel.fromJson({
                ...packageData,
                id: packageList.length + 1,
            }); // 임시 ID 생성
            setPackageList((prevPackages) => [...prevPackages, newPackage]);
            return newPackage;
        }

        const newPackage = await createPackageInService(packageData);
        if (newPackage) setPackageList((prevPackages) => [...prevPackages, newPackage]);
        return newPackage;
    };

    // Read
    const getPackage = async (packageId: number): Promise<PackageModel | null> => {
        const targetPackage = packageList.find((pkg) => pkg.id === packageId);
        if (targetPackage) return targetPackage;

        // 새 패키지 데이터 가져오기
        const foundPackage = useDummyData
            ? PackageModel.fromJson(packageDummyData.find((pkg) => pkg.id === packageId))
            : await getPackageInService(packageId);

        const newPackage = foundPackage || null;
        if (!newPackage) return null;

        // 패키지 상태 업데이트
        setPackageList((prevPackages) => [...prevPackages, newPackage]);
        return newPackage;
    };

    // Update
    const updatePackage = async (
        packageId: number,
        updatedData: Partial<PackageModel>,
    ): Promise<PackageModel | null> => {
        if (useDummyData) {
            const updatedPackages = packageList.map((pkg) =>
                PackageModel.fromJson(pkg.id === packageId ? { ...pkg, ...updatedData } : pkg),
            );
            setPackageList(updatedPackages);
            return updatedPackages.find((pkg) => pkg.id === packageId) || null;
        }

        const newPackage = await updatePackageInService(packageId, updatedData);
        if (newPackage)
            setPackageList((prevPackages) =>
                prevPackages.map((pkg) => (pkg.id === packageId ? newPackage : pkg)),
            );
        return newPackage;
    };

    // Delete
    const deletePackage = async (packageId: number): Promise<boolean> => {
        if (useDummyData) {
            setPackageList((prevPackages) => prevPackages.filter((pkg) => pkg.id !== packageId));
            return true;
        }

        const isSuccess = await deletePackageInService(packageId);
        if (isSuccess)
            setPackageList((prevPackages) => prevPackages.filter((pkg) => pkg.id !== packageId));
        return isSuccess;
    };

    return {
        packageList,
        getPackageList,
        createPackage,
        getPackage,
        updatePackage,
        deletePackage,
    };
};
