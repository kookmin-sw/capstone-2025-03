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

const useDummyData = true;

export const usePackage = () => {
    const [packages, setPackages] = useRecoilState(packageState);

    // List Read
    const getPackageList = async (): Promise<PackageModel[] | null> => {
        const newPackageList = useDummyData
            ? packageDummyData.map(pkg => PackageModel.fromJson(pkg))
            : await getPackageListInService();

        if (newPackageList) setPackages(newPackageList);
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
        if (useDummyData) {
            return packages.find(pkg => pkg.id === packageId) || null;
        }

        const targetPackage = packages.find(pkg => pkg.id === packageId);
        if (targetPackage) return targetPackage;

        const newPackage = await getPackageInService(packageId);
        if (newPackage) setPackages(prevPackages => [...prevPackages, newPackage]);
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