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
            id: jsonData["id"],
            images: jsonData["images"] || [],
            categoryId: jsonData["category_id"],
            name: jsonData["name"],
            grade: jsonData["grade"],
            quantity: jsonData["quantity"],
            price: jsonData["price"],
            sellerId: jsonData["seller_id"],
            uploadDate: jsonData["upload_date"],
            buyerId: jsonData["buyer_id"],
            purchaseDate: jsonData["purchase_date"],
            description: jsonData["description"],
            salesStatus: jsonData["sales_status"]
        });
    }

    toJson(): any {
        return {
            "id": this.id,
            "images": this.images,
            "category_id": this.categoryId,
            "name": this.name,
            "grade": this.grade,
            "quantity": this.quantity,
            "price": this.price,
            "seller_id": this.sellerId,
            "upload_date": this.uploadDate,
            "buyer_id": this.buyerId,
            "purchase_date": this.purchaseDate,
            "description": this.description,
            "sales_status": this.salesStatus
        };
    }

    toJsonWithoutId(): any {
        return {
            "images": this.images,
            "category_id": this.categoryId,
            "name": this.name,
            "grade": this.grade,
            "quantity": this.quantity,
            "price": this.price,
            "seller_id": this.sellerId,
            "upload_date": this.uploadDate,
            "buyer_id": this.buyerId,
            "purchase_date": this.purchaseDate,
            "description": this.description,
            "sales_status": this.salesStatus
        };
    }
}