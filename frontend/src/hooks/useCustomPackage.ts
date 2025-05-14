import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PackageModel from '../models/PackageModel';
import {
    getPackageListByUserInService,
    createPackageInService,
    updatePackageInService,
    deletePackageInService,
} from '../services/packageService';
import packageDummyData from '../data/packageDummyData.json';

const PACKAGE_KEY = 'custom-packages';
const useDummyData = false;

// Query: List Read by User
export const useCustomPackagesByUser = (user: number | undefined) => {
    return useQuery<PackageModel[], Error>({
        queryKey: [PACKAGE_KEY, user],
        queryFn: async () => {
            // Dummy이거나 user 없을 때
            if (useDummyData || user === undefined) {
                return packageDummyData.map((item) => PackageModel.fromJson(item));
            }

            // Query 적용
            const data = await getPackageListByUserInService(user);
            if (!data) throw new Error('Failed to fetch packages');
            return data;
        },
        enabled: !!user,
        gcTime: 1,
        staleTime: 1,
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
};

// Mutation: Create
export const useCreatePackage = () => {
    const queryClient = useQueryClient();
    return useMutation<PackageModel, Error, PackageModel>({
        mutationFn: async (newPackage) => {
            // Dummy일 때
            if (useDummyData) return newPackage;

            // Mutation 적용
            const data = await createPackageInService(newPackage);
            if (!data) throw new Error('Failed to create package');
            return data;
        },
        onSuccess: (data) => {
            console.log('Mutation successful, data:', data);
            if (data?.user) {
                // Mutation에서는 캐시 무효화 또는 갱신 필요함
                console.log('Invalidating queries with key:', [PACKAGE_KEY, data.user]);

                queryClient.invalidateQueries({
                    queryKey: [PACKAGE_KEY, data.user],
                    refetchType: 'all',
                    exact: false,
                });
                console.log('Invalidation completed');
            }
        },
    });
};

// Mutation: Update
export const useUpdatePackage = () => {
    const queryClient = useQueryClient();
    return useMutation<PackageModel, Error, { id: number; updatedData: Partial<PackageModel> }>({
        mutationFn: async ({ id, updatedData }) => {
            // Dummy일 때
            if (useDummyData) {
                const existing = packageDummyData.find((pkg) => pkg.id === id);
                if (!existing) throw new Error('Dummy package not found');
                return PackageModel.fromJson({ ...existing, ...updatedData });
            }

            // Mutation 적용
            const data = await updatePackageInService(id, updatedData);
            if (!data) throw new Error('Failed to update package');
            return data;
        },
        onSuccess: (data) => {
            console.log('update successful, data:', data);
            if (data?.user) {
                // Mutation에서는 캐시 무효화 또는 갱신 필요함
                console.log('업데이트 성공:', [PACKAGE_KEY, data.user]);

                queryClient.invalidateQueries({
                    queryKey: [PACKAGE_KEY, data.user],
                    refetchType: 'all', // 모든 쿼리 리페치
                    exact: false, // 부분 일치하는 쿼리도 무효화
                });

                queryClient.refetchQueries({
                    queryKey: [PACKAGE_KEY, data.user],
                    exact: false,
                    type: 'all', // 비활성 쿼리도 리페치
                });

                console.log('update completed');
            }
        },
    });
};

// Mutation: Delete
export const useDeletePackage = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, { id: number; user: number }>({
        mutationFn: async ({ id }) => {
            // Dummy일 때
            if (useDummyData) {
                // 실제로 제거되진 않지만, 성공 처리된 것처럼 리턴
                return;
            }

            // Mutation 적용
            const success = await deletePackageInService(id);
            if (!success) throw new Error('Failed to delete package');
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: [PACKAGE_KEY, variables.user] });
        },
    });
};
