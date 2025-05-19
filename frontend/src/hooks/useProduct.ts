import { useRecoilState } from 'recoil';
import { productListState } from '../recoil/productState';
import { productPaginationState } from '../recoil/productPaginationState';
import {
    getProductListInService,
    createProductInService,
    getProductInService,
    updateProductInService,
    deleteProductInService,
} from '../services/productService';
import ProductModel from '../models/ProductModel';
import productDummyData from '@/src/data/productDummyData.json';

const useDummyData = false;

export const useProduct = () => {
    const [productList, setProductList] = useRecoilState(productListState);
    const [productPagination, setProductPagination] = useRecoilState(productPaginationState);
    const PAGE_SIZE = 10;

    // List Read
    const getProductList = async (category: number | null): Promise<ProductModel[]> => {
        // category string으로 변경 (전체 읽기인 경우, null로 전달 받음)
        const myCategory: string = category?.toString() ?? 'all';
        const { next: myNext = null, hasMore: myHasMore = true } =
            productPagination[myCategory] || {};

        // 더이상 데이터가 없으면 빈 배열 리턴
        if (!myHasMore) return [];

        // 응답
        const response: { results: ProductModel[]; next: string | null } | null = useDummyData
            ? {
                  results: productDummyData.map((product) => ProductModel.fromJson(product)),
                  next: null,
              }
            : await getProductListInService(myNext, PAGE_SIZE, myCategory);

        let newProducts: ProductModel[] = [];
        if (response) {
            newProducts = response.results;
            setProductList((prev) => {
                // 빠른 탐색을 위한 Set
                const existingIds = new Set(prev.map((product) => product.id));
                const filteredNewProducts = newProducts.filter(
                    (product) => !existingIds.has(product.id),
                );
                return [...prev, ...filteredNewProducts];
            });
            setProductPagination((prev) => ({
                ...prev,
                [myCategory]: {
                    next: response.next,
                    hasMore: response.next !== null,
                },
            }));
        }

        return newProducts;
    };

    // Create
    const createProduct = async (productData: ProductModel): Promise<ProductModel | null> => {
        if (useDummyData) {
            const newProduct = ProductModel.fromJson({
                ...productData,
                id: productList.length + 1,
            }); // 임시 ID 생성
            setProductList((prev) => [...prev, newProduct]);
            return newProduct;
        }

        const newProduct = await createProductInService(productData);
        if (newProduct) setProductList((prev) => [...prev, newProduct]);
        return newProduct;
    };

    // Read
    const getProduct = async (productId: number): Promise<ProductModel | null> => {
        const targetProduct = productList.find((product) => product.id === productId);
        if (targetProduct) return targetProduct;

        let newProduct = null;
        if (useDummyData) {
            const targetData = productDummyData.find((product) => product.id === productId);
            if (targetData) newProduct = ProductModel.fromJson(targetData);
        } else {
            newProduct = await getProductInService(productId);
        }

        if (newProduct) setProductList((prev) => [...prev, newProduct]);
        return newProduct;
    };

    // Update
    const updateProduct = async (
        productId: number,
        updatedData: Partial<ProductModel>,
    ): Promise<ProductModel | null> => {
        if (useDummyData) {
            const updatedProducts = productList.map((product) =>
                ProductModel.fromJson(
                    product.id === productId ? { ...product, ...updatedData } : product,
                ),
            );
            setProductList(updatedProducts);
            return updatedProducts.find((product) => product.id === productId) || null;
        }

        const newProduct = await updateProductInService(productId, updatedData);
        if (newProduct)
            setProductList((prev) =>
                prev.map((product) => (product.id === productId ? newProduct : product)),
            );
        return newProduct;
    };

    // Delete
    const deleteProduct = async (productId: number): Promise<boolean> => {
        if (useDummyData) {
            setProductList((prev) => prev.filter((product) => product.id !== productId));
            return true;
        }

        const isSuccess = await deleteProductInService(productId);
        if (isSuccess) {
            setProductList((prev) => prev.filter((product) => product.id !== productId));
        }
        return isSuccess;
    };

    return {
        productList,
        setProductList,
        getProductList,
        createProduct,
        getProduct,
        updateProduct,
        deleteProduct,
    };
};
