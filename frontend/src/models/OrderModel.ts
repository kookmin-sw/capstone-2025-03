export default class OrderModel {
    id: number | null; // 유지
    user: number | null;
    products: number[] | null;
    totalPrice: number | null;
    createdAt: string | null;

    constructor({
        id = null,
        user = null,
        products = null,
        totalPrice = null,
        createdAt = null,
    }: {
        id?: number | null;
        user?: number | null;
        products?: number[] | null;
        totalPrice?: number | null;
        createdAt?: string | null;
    }) {
        this.id = id;
        this.user = user;
        this.products = products;
        this.totalPrice = totalPrice;
        this.createdAt = createdAt;
    }

    static fromJson(jsonData: any): OrderModel {
        return new OrderModel({
            id: jsonData['id'],
            user: jsonData['user'],
            products: jsonData['products'],
            totalPrice: jsonData['total_price'],
            createdAt: jsonData['created_at'],
        });
    }

    toJson(): any {
        return {
            id: this.id,
            user: this.user,
            products: this.products,
            total_price: this.totalPrice,
            created_at: this.createdAt,
        };
    }

    toJsonWithoutIdTotalPriceCreatedAt(): any {
        return {
            user: this.user,
            products: this.products,
        };
    }
}
