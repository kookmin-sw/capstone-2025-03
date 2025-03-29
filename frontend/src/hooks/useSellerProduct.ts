// sellerProductListState 에 대한 커스텀 훅
import { useRecoilState } from 'recoil';
import { sellerProductListState } from '../recoil/sellerProductState';
import { getUserProductListInService } from '../services/sellerProductService';
import { sellerProductPaginationSate } from '../recoil/sellerProductPaginationState';
import SellerProductModel from '../models/SellerProductModel';
import axios from 'axios';

export const useSellerProduct = (sellerId: number) => {
    const [products, setProducts] = useRecoilState(sellerProductListState);
    const [pagination, setPagination] = useRecoilState(sellerProductPaginationSate);

    // 최초 물품 로딩
    const loadProduct = async () => {
        try {
            const response = await getUserProductListInService(sellerId);

            const convertedProducts = response.results.map((p) => SellerProductModel.fromJson(p));

            setProducts(convertedProducts);
            setPagination({ next: response.next, hasMore: Boolean(response.next) });
        } catch (error) {
            console.error('상품 불러오기 실패: ', error);
        }
    };

    // 추가 로딩 (페이지네이션)
    const loadMore = async () => {
        if (!pagination.hasMore || !pagination.next) return;
        console.log(pagination.next);
        try {
            const response = await axios.get(pagination.next);

            const nextProducts = response.data.results.map((p: SellerProductModel) => SellerProductModel.fromJson(p));

            setProducts((prev) => [...prev, ...nextProducts]);
            setPagination({ next: response.data.next, hasMore: Boolean(response.data.next) });
        } catch (error) {
            console.error('다음 상품 불러오기 실패: ', error);
        }
    };

    return { products, loadProduct, loadMore, hasMore: pagination.hasMore };
};
