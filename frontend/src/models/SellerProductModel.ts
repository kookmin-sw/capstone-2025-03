export default class SellerProductModel {
    id: number | null;
    category: number | null;
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
        category = null,
        name = null,
        description = null,
        grade = null,
        quantity = 0,
        price = null,
        seller = null,
        uploadDate = null,
        saleStatus = null,
        buyer = null,
        purchaseDate = null,
    }: {
        id?: number | null;
        images?: string[];
        category?: number | null;
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
        this.category = category;
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
            id: jsonData.id ?? null,
            images: jsonData.images ?? [],
            category: jsonData.category ?? null,
            name: jsonData.name ?? null,
            description: jsonData.description ?? null,
            grade: jsonData.grade ?? null,
            quantity: jsonData.quantity ?? 0,
            price: jsonData.price ?? null,
            seller: jsonData.seller ?? null,
            uploadDate: jsonData.upload_date ?? null,
            saleStatus: jsonData.sales_status ?? null,
            buyer: jsonData.buyer ?? null,
            purchaseDate: jsonData.purchase_date ?? null,
        });
    }

    toJson(): any {
        return {
            id: this.id,
            images: this.images,
            category: this.category,
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