export class ProductModel {
    id: string | null;
    images: string[];
    categoryId: string | null;
    name: string | null;
    grade: string | null;
    quantity: number;
    price: number;
    sellerId: string | null;
    uploadDate: string | null; // ISO 8601: YYYY-MM-DDTHH:MM:SS.sssZ
    saleStatus: string | null;
    buyerId: string | null;
    purchaseDate: string | null; // ISO 8601: YYYY-MM-DDTHH:MM:SS.sssZ

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
        saleStatus = null,
        buyerId = null,
        purchaseDate = null,
    }: {
        id?: string | null;
        images?: string[];
        categoryId?: string | null;
        name?: string | null;
        grade?: string | null;
        quantity?: number;
        price?: number;
        sellerId?: string | null;
        uploadDate?: string | null;
        saleStatus?: string | null;
        buyerId?: string | null;
        purchaseDate?: string | null;
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
        this.saleStatus = saleStatus;
        this.buyerId = buyerId;
        this.purchaseDate = purchaseDate;
    }

    static fromJson(jsonData: any): ProductModel {
        return new ProductModel({
            id: jsonData.id,
            images: jsonData.images || [],
            categoryId: jsonData.categoryId,
            name: jsonData.name,
            grade: jsonData.grade,
            quantity: jsonData.quantity,
            price: jsonData.price,
            sellerId: jsonData.sellerId,
            uploadDate: jsonData.uploadDate,
            saleStatus: jsonData.saleStatus,
            buyerId: jsonData.buyerId,
            purchaseDate: jsonData.purchaseDate,
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
            saleStatus: this.saleStatus,
            buyerId: this.buyerId,
            purchaseDate: this.purchaseDate,
        };
    }
}