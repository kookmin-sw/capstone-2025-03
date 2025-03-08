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

export const usePackage = () => {
    const [packages, setPackages] = useRecoilState(packageState);

    // List Read
    const getPackageList = async (): Promise<PackageModel[] | null> => {
        const newPackageList = await getPackageListInService();
        if (newPackageList) setPackages(newPackageList);
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