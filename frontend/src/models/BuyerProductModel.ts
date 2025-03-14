export default class BuyerProductModel {
    id: number | null; // 유지
    category: number | null;
    images: string[];
    name: string | null;
    description: string | null;
    grade: string | null;
    quantity: number;
    price: number;
    seller: number | null;
    uploadDate: string | null; // ISO 8601: YYYY-MM-DDTHH:MM:SS.sssZ
    buyer: number | null;
    purchaseDate: string | null; // ISO 8601: YYYY-MM-DDTHH:MM:SS.sssZ
    salesStatus: string | null;

    constructor({
        id = null,
        images = [],
        category = null,
        name = null,
        grade = null,
        quantity = 0,
        price = 0,
        seller = null,
        uploadDate = null,
        buyer = null,
        purchaseDate = null,
        description = null,
        salesStatus = null
    }: {
        id?: number | null;
        images?: string[];
        category?: number | null;
        name?: string | null;
        grade?: string | null;
        quantity?: number;
        price?: number;
        seller?: number | null;
        uploadDate?: string | null;
        buyer?: number | null;
        purchaseDate?: string | null;
        description?: string | null;
        salesStatus?: string | null;
    }) {
        this.id = id;
        this.images = images;
        this.category = category;
        this.name = name;
        this.grade = grade;
        this.quantity = quantity;
        this.price = price;
        this.seller = seller;
        this.uploadDate = uploadDate;
        this.buyer = buyer;
        this.purchaseDate = purchaseDate;
        this.description = description;
        this.salesStatus = salesStatus;
    }

    static fromJson(jsonData: any): BuyerProductModel {
        return new BuyerProductModel({
            id: jsonData["id"],
            images: jsonData["images"] || [],
            category: jsonData["category"],
            name: jsonData["name"],
            grade: jsonData["grade"],
            quantity: jsonData["quantity"],
            price: jsonData["price"],
            seller: jsonData["seller"],
            uploadDate: jsonData["upload_date"],
            buyer: jsonData["buyer"],
            purchaseDate: jsonData["purchase_date"],
            description: jsonData["description"],
            salesStatus: jsonData["sales_status"]
        });
    }

    toJson(): any {
        return {
            "id": this.id,
            "images": this.images,
            "category": this.category,
            "name": this.name,
            "grade": this.grade,
            "quantity": this.quantity,
            "price": this.price,
            "seller": this.seller,
            "upload_date": this.uploadDate,
            "buyer": this.buyer,
            "purchase_date": this.purchaseDate,
            "description": this.description,
            "sales_status": this.salesStatus
        };
    }

    toJsonWithoutId(): any {
        return {
            "images": this.images,
            "category": this.category,
            "name": this.name,
            "grade": this.grade,
            "quantity": this.quantity,
            "price": this.price,
            "seller": this.seller,
            "upload_date": this.uploadDate,
            "buyer": this.buyer,
            "purchase_date": this.purchaseDate,
            "description": this.description,
            "sales_status": this.salesStatus
        };
    }
}