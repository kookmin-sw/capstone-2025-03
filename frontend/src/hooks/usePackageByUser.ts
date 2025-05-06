import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PackageModel from '../models/PackageModel';
import {
  getPackageListByUserInService,
  createPackageInService,
  updatePackageInService,
  deletePackageInService,
} from '../services/packageService';
import packageDummyData from '../data/packageDummyData.json';

const PACKAGE_KEY = 'packages';
const useDummyData = true;

// Fetch packages by user ID
export const usePackagesByUser = (userId: number | undefined) => {
  return useQuery<PackageModel[], Error>({
    queryKey: [PACKAGE_KEY, userId],
    queryFn: async () => {
      if (useDummyData || userId === undefined) {
        return packageDummyData.map((item) => PackageModel.fromJson(item));
      }
      const data = await getPackageListByUserInService(userId);
      if (!data) throw new Error('Failed to fetch packages');
      return data;
    },
    enabled: !!userId,
  });
};

// Create
export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation<PackageModel, Error, PackageModel>({
    mutationFn: async (newPackage) => {
      if (useDummyData) return newPackage;
      const data = await createPackageInService(newPackage);
      if (!data) throw new Error('Failed to create package');
      return data;
    },
    onSuccess: (data) => {
      if (data?.userId) {
        queryClient.invalidateQueries({ queryKey: [PACKAGE_KEY, data.userId] });
      }
    },
  });
};

// Update
export const useUpdatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation<PackageModel, Error, { id: number; updatedData: Partial<PackageModel> }>({
    mutationFn: async ({ id, updatedData }) => {
      if (useDummyData) {
        const existing = packageDummyData.find((pkg) => pkg.id === id);
        if (!existing) throw new Error('Dummy package not found');
        return PackageModel.fromJson({ ...existing, ...updatedData });
      }
      const data = await updatePackageInService(id, updatedData);
      if (!data) throw new Error('Failed to update package');
      return data;
    },
    onSuccess: (data) => {
      if (data?.userId) {
        queryClient.invalidateQueries({ queryKey: [PACKAGE_KEY, data.userId] });
      }
    },
  });
};

// Delete
export const useDeletePackage = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: number; userId: number }>({
    mutationFn: async ({ id }) => {
      if (useDummyData) {
        // 실제로 제거되진 않지만, 성공 처리된 것처럼 리턴
        return;
      }
      const success = await deletePackageInService(id);
      if (!success) throw new Error('Failed to delete package');
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [PACKAGE_KEY, variables.userId] });
    },
  });
};