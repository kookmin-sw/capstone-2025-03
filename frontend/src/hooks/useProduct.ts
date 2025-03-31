import { useRecoilState } from 'recoil';
import {
    productState,
    productNextPageUrlState,
    productHasRequestOnceState,
} from '../recoil/productState';
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
    const [products, setProducts] = useRecoilState(productState);
    const [nextPageUrl, setNextPageUrl] = useRecoilState(productNextPageUrlState);
    const [hasRequestOnce, setHasRequestOnce] = useRecoilState(productHasRequestOnceState);
    const PAGE_SIZE = 10;

    // List Read
    const getProductList = async (): Promise<ProductModel[]> => {
        if (!nextPageUrl && hasRequestOnce) return [];

        const response: { results: ProductModel[]; next: string | null } | null = useDummyData
            ? {
                  results: productDummyData.map((product) => ProductModel.fromJson(product)),
                  next: null,
              }
            : await getProductListInService(nextPageUrl, PAGE_SIZE, null);

        let newProducts: ProductModel[] = [];
        if (response) {
            newProducts = response.results;
            setProducts((prev) => [...prev, ...newProducts]);
            setNextPageUrl(response.next);
            setHasRequestOnce(true);
        }

        return newProducts;
    };

    // Create
    const createProduct = async (productData: ProductModel): Promise<ProductModel | null> => {
        if (useDummyData) {
            const newProduct = ProductModel.fromJson({
                ...productData,
                id: products.length + 1,
            }); // 임시 ID 생성
            setProducts((prev) => [...prev, newProduct]);
            return newProduct;
        }

        const newProduct = await createProductInService(productData);
        if (newProduct) setProducts((prev) => [...prev, newProduct]);
        return newProduct;
    };

    // Read
    const getProduct = async (productId: number): Promise<ProductModel | null> => {
        const targetProduct = products.find((product) => product.id === productId);
        if (targetProduct) return targetProduct;

        let newProduct = null;
        if (useDummyData) {
            const targetData = productDummyData.find((product) => product.id === productId);
            if (targetData) newProduct = ProductModel.fromJson(targetData);
        } else {
            newProduct = await getProductInService(productId);
        }

        if (newProduct) setProducts((prev) => [...prev, newProduct]);
        return newProduct;
    };

    // Update
    const updateProduct = async (
        productId: number,
        updatedData: Partial<ProductModel>,
    ): Promise<ProductModel | null> => {
        if (useDummyData) {
            const updatedProducts = products.map((product) =>
                ProductModel.fromJson(
                    product.id === productId ? { ...product, ...updatedData } : product,
                ),
            );
            setProducts(updatedProducts);
            return updatedProducts.find((product) => product.id === productId) || null;
        }

        const newProduct = await updateProductInService(productId, updatedData);
        if (newProduct)
            setProducts((prev) =>
                prev.map((product) => (product.id === productId ? newProduct : product)),
            );
        return newProduct;
    };

    // Delete
    const deleteProduct = async (productId: number): Promise<boolean> => {
        if (useDummyData) {
            setProducts((prev) => prev.filter((product) => product.id !== productId));
            return true;
        }

        const isSuccess = await deleteProductInService(productId);
        if (isSuccess) {
            setProducts((prev) => prev.filter((product) => product.id !== productId));
        }
        return isSuccess;
    };

    return {
        products,
        getProductList,
        createProduct,
        getProduct,
        updateProduct,
        deleteProduct,
    };
};