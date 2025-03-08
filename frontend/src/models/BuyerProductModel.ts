export default class BuyerProductModel {
    id: number | null;
    categoryId: number | null;
    images: string[];
    name: string | null;
    description: string | null;
    grade: string | null;
    quantity: number;
    price: number;
    sellerId: number | null;
    uploadDate: string | null; // ISO 8601: YYYY-MM-DDTHH:MM:SS.sssZ
    buyerId: number | null;
    purchaseDate: string | null; // ISO 8601: YYYY-MM-DDTHH:MM:SS.sssZ
    salesStatus: string | null;

    constructor({
        id = null,
        images = [],
        categoryId = null,
        name = null,
        grade = null,
        quantity = 0,
        price = 0,
        sellerId = null,
        uploadDate = null,
        buyerId = null,
        purchaseDate = null,
        description = null,
        salesStatus = null
    }: {
        id?: number | null;
        images?: string[];
        categoryId?: number | null;
        name?: string | null;
        grade?: string | null;
        quantity?: number;
        price?: number;
        sellerId?: number | null;
        uploadDate?: string | null;
        buyerId?: number | null;
        purchaseDate?: string | null;
        description?: string | null;
        salesStatus?: string | null;
    }) {
        this.id = id;
        this.images = images;
        this.categoryId = categoryId;
        this.name = name;
        this.grade = grade;
        this.quantity = quantity;
        this.price = price;
        this.sellerId = sellerId;
        this.uploadDate = uploadDate;
        this.buyerId = buyerId;
        this.purchaseDate = purchaseDate;
        this.description = description;
        this.salesStatus = salesStatus;
    }

    static fromJson(jsonData: any): BuyerProductModel {
        return new BuyerProductModel({
            id: jsonData.id,
            images: jsonData.images || [],
            categoryId: jsonData.categoryId,
            name: jsonData.name,
            grade: jsonData.grade,
            quantity: jsonData.quantity,
            price: jsonData.price,
            sellerId: jsonData.sellerId,
            uploadDate: jsonData.uploadDate,
            buyerId: jsonData.buyerId,
            purchaseDate: jsonData.purchaseDate,
            description: jsonData.description,
            salesStatus: jsonData.salesStatus
        });
    }

    toJson(): any {
        return {
            id: this.id,
            images: this.images,
            categoryId: this.categoryId,
            name: this.name,
            grade: this.grade,
            quantity: this.quantity,
            price: this.price,
            sellerId: this.sellerId,
            uploadDate: this.uploadDate,
            buyerId: this.buyerId,
            purchaseDate: this.purchaseDate,
            description: this.description,
            salesStatus: this.salesStatus
        };
    }

    toJsonWithoutId(): any {
        return {
            images: this.images,
            categoryId: this.categoryId,
            name: this.name,
            grade: this.grade,
            quantity: this.quantity,
            price: this.price,
            sellerId: this.sellerId,
            uploadDate: this.uploadDate,
            buyerId: this.buyerId,
            purchaseDate: this.purchaseDate,
            description: this.description,
            salesStatus: this.salesStatus
        };
    }
}