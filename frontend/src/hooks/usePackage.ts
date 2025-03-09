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
import { useEffect, useState } from "react";

export const usePackage = () => {
    const [packages, setPackages] = useRecoilState(packageState);
    const [isTest, setIsTest] = useState(true);

    useEffect(() => {
        if(!isTest) return;
        // TODO: 지워야함
        const dummy = {
            "id": 9999999,
            "industry_id": 1,
            "category_ids": [2],
            "product_ids": [1192],
            "name": "프리미엄 카페 패키지",
            "thumbnail": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/8f/28/63/inside-that-cafe.jpg?w=900&h=500&s=1",
            "description": "이 패키지는 카페를 위한 마케팅 솔루션을 제공합니다.",
            "price": 299000
        };
        setPackages((prev) => [...prev, PackageModel.fromJson(dummy)]);
    }, [])

    // List Read
    const getPackageList = async (): Promise<PackageModel[] | null> => {
        const newPackageList = await getPackageListInService();
        // if (newPackageList) setPackages(newPackageList);
        return newPackageList;
    };

    // Create
    const createPackage = async (packageData: PackageModel): Promise<PackageModel | null> => {
        const newPackage = await createPackageInService(packageData);
        if (newPackage) setPackages(prevPackages => [...prevPackages, newPackage]);
        return newPackage;
    };

    // Read
    const getPackage = async (packageId: number): Promise<PackageModel | null> => {
        const targetPackage = packages.find((pkg) => pkg.id === packageId);
        if (targetPackage) return targetPackage;
        const newPackage = await getPackageInService(packageId);
        if (newPackage) setPackages(prevPackages => [...prevPackages, newPackage]);
        return newPackage;
    };

    // Update
    const updatePackage = async (packageId: number, updatedData: Partial<PackageModel>): Promise<PackageModel | null> => {
        const newPackage = await updatePackageInService(packageId, updatedData);
        if (newPackage) setPackages(prevPackages =>
            prevPackages.map((pkg) => pkg.id === packageId ? newPackage : pkg)
        );
        return newPackage;
    };

    // Delete
    const deletePackage = async (packageId: number): Promise<boolean> => {
        const isSuccess = await deletePackageInService(packageId);
        if (isSuccess) setPackages(prevPackages => prevPackages.filter((pkg) => pkg.id !== packageId));
        return isSuccess;
    };

    return { packages, getPackageList, createPackage, getPackage, updatePackage, deletePackage };
};