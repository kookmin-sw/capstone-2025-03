export default class SellerProductModel {
    categoryId: number | null;
    sellerId: number | null;
    buyerId: number | null;
    images: string[];
    name: string | null;
    discription: string | null;
    grade: string | null;
    quantity: number;
    price: number | null;
    uploadDate: string | null; // ISO 8601: YYYY-MM-DDTHH:MM:SS.sssZ
    saleStatus: string | null;
    purchaseDate: string | null; // ISO 8601: YYYY-MM-DDTHH:MM:SS.sssZ

    constructor({
        images = [],
        categoryId = null,
        name = null,
        discription = null,
        grade = null,
        quantity = 0,
        price = 0,
        sellerId = null,
        uploadDate = null,
        saleStatus = null,
        buyerId = null,
        purchaseDate = null,
    }: {
        images?: string[];
        categoryId?: number | null;
        name?: string | null;
        discription?: string | null;
        grade?: string | null;
        quantity?: number;
        price?: number | null;
        sellerId?: number | null;
        uploadDate?: string | null;
        saleStatus?: string | null;
        buyerId?: number | null;
        purchaseDate?: string | null;
    }) {
        this.images = images;
        this.categoryId = categoryId;
        this.name = name;
        this.discription = discription;
        this.grade = grade;
        this.quantity = quantity;
        this.price = price;
        this.sellerId = sellerId;
        this.uploadDate = uploadDate;
        this.saleStatus = saleStatus;
        this.buyerId = buyerId;
        this.purchaseDate = purchaseDate;
    }

    static fromJson(jsonData: any): SellerProductModel {
        return new SellerProductModel({
            images: jsonData.images || [],
            categoryId: jsonData.category_id,
            name: jsonData.name,
            discription: jsonData.discription,
            grade: jsonData.grade,
            quantity: jsonData.quantity,
            price: jsonData.price,
            sellerId: jsonData.seller_id,
            uploadDate: jsonData.upload_date,
            saleStatus: jsonData.sale_status,
            buyerId: jsonData.buyer_id,
            purchaseDate: jsonData.purchase_date,
        });
    }

    toJson(): any {
        return {
            images: this.images,
            category_id: this.categoryId,
            name: this.name,
            discription: this.discription,
            grade: this.grade,
            quantity: this.quantity,
            price: this.price,
            seller_id: this.sellerId,
            upload_date: this.uploadDate,
            sale_status: this.saleStatus,
            buyer_id: this.buyerId,
            purchase_date: this.purchaseDate,
        };
    }
}