export default class SellerProductModel {
    id: number | null;
    categoryId: number | null;
    seller: number | null;
    buyer: number | null;
    images: string[];
    name: string | null;
    description: string | null;
    grade: string | null;
    quantity: number;
    price: number | null;
    uploadDate: string | null; // ISO 8601: YYYY-MM-DDTHH:MM:SS.sssZ
    saleStatus: string | null;
    purchaseDate: string | null; // ISO 8601: YYYY-MM-DDTHH:MM:SS.sssZ

    constructor({
        id = null,
        images = [],
        categoryId = null,
        name = null,
        description = null,
        grade = null,
        quantity = 0,
        price = 0,
        seller = null,
        uploadDate = null,
        saleStatus = null,
        buyer = null,
        purchaseDate = null,
    }: {
        id?: number | null;
        images?: string[];
        categoryId?: number | null;
        name?: string | null;
        description?: string | null;
        grade?: string | null;
        quantity?: number;
        price?: number | null;
        seller?: number | null;
        uploadDate?: string | null;
        saleStatus?: string | null;
        buyer?: number | null;
        purchaseDate?: string | null;
    }) {
        this.id = id;
        this.images = images;
        this.categoryId = categoryId;
        this.name = name;
        this.description = description;
        this.grade = grade;
        this.quantity = quantity;
        this.price = price;
        this.seller = seller;
        this.uploadDate = uploadDate;
        this.saleStatus = saleStatus;
        this.buyer = buyer;
        this.purchaseDate = purchaseDate;
    }

    static fromJson(jsonData: any): SellerProductModel {
        return new SellerProductModel({
            id: jsonData.id,
            images: jsonData.images || [],
            categoryId: jsonData.category,
            name: jsonData.name,
            description: jsonData.description,
            grade: jsonData.grade,
            quantity: jsonData.quantity,
            price: jsonData.price,
            seller: jsonData.seller,
            uploadDate: jsonData.upload_date,
            saleStatus: jsonData.sales_status,
            buyer: jsonData.buyer,
            purchaseDate: jsonData.purchase_date,
        });
    }

    toJson(): any {
        return {
            images: this.images,
            category: this.categoryId,
            name: this.name,
            description: this.description,
            grade: this.grade,
            quantity: this.quantity,
            price: this.price,
            seller: this.seller,
            upload_date: this.uploadDate,
            sales_status: this.saleStatus,
            buyer: this.buyer,
            purchase_date: this.purchaseDate,
        };
    }
}