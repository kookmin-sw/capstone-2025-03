import { atom, selector, useRecoilState, useSetRecoilState } from "recoil";
import {
    getPackageListInService,
    getPackageInService,
    createPackageInService,
    updatePackageInService,
    deletePackageInService,
} from "../services/packageService";
import PackageModel from "../models/PackageModel";

// 패키지 리스트 상태
export const packageListState = atom<PackageModel[] | null>({
    key: "packageListState",
    default: null,
});

// 패키지 상세 정보 상태 (캐싱)
export const packageCacheState = atom<{ [key: number]: PackageModel }>({
    key: "packageCacheState",
    default: {},
});

// 편집 중인 패키지 상태
export const editingPackageState = atom<PackageModel | null>({
    key: "editingPackageState",
    default: null,
});

// 패키지 리스트를 불러오는 커스텀 훅 (이미 존재하는 경우 다시 가져오지 않음)
export const useFetchPackageList = () => {
    const [packageList, setPackageList] = useRecoilState(packageListState);

    return async () => {
        if (packageList) return packageList; // 이미 로드된 경우 API 호출 안 함
        const packages = await getPackageListInService();
        setPackageList(packages);
        return packages
    };
};

// 패키지 생성 훅
export const useCreatePackage = () => {
    const setPackageCache = useSetRecoilState(packageCacheState);
    return async (packageData: PackageModel) => {
        const response = await createPackageInService(packageData);

        if (!response || !response.id) {
            console.error("Invalid response from createPackageInService:", response);
            return;
        }

        setPackageCache((prev) => ({ ...prev, [response.id]: packageData }));
    };
};

// 특정 패키지 가져오기 (캐싱 활용)
export const useFetchPackageDetail = () => {
    const [packageCache, setPackageCache] = useRecoilState(packageCacheState);

    return async (packageId: number) => {
        if (packageCache[packageId]) {
            return packageCache[packageId];
        }
        const packageData = await getPackageInService(packageId);
        if (packageData) {
            setPackageCache((prev) => ({ ...prev, [packageId]: packageData }));
            return packageData;
        }
        return null;
    };
};

// 패키지 업데이트 훅
export const useUpdatePackage = () => {
    const setPackageCache = useSetRecoilState(packageCacheState);
    return async (packageId: number, updatedData: Partial<PackageModel>) => {
        await updatePackageInService(packageId, updatedData);
        setPackageCache((prev) => ({
            ...prev,
            [packageId]: { ...prev[packageId], ...updatedData } as PackageModel,
        }));
    };
};

// 패키지 삭제 훅
export const useDeletePackage = () => {
    const setPackageCache = useSetRecoilState(packageCacheState);
    return async (packageId: number) => {
        await deletePackageInService(packageId);
        setPackageCache((prev) => {
            const newCache = { ...prev };
            delete newCache[packageId];
            return newCache;
        });
    };
};

// 패키지 편집 상태 관리 훅
export const useSetEditingPackage = () => {
    const setEditingPackage = useSetRecoilState(editingPackageState);
    return (packageData: PackageModel | null) => {
        setEditingPackage(packageData);
    };
};