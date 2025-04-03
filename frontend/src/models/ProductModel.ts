export default class ProductModel {
    id: number | null;
    category: number | null;
    categoryName: string | null;
    images: string[];
    name: string | null;
    description: string | null;
    grade: string | null;
    quantity: number;
    price?: number | null;
    seller: number | null;
    uploadDate: string | null;
    buyer: number | null;
    purchaseDate: string | null;
    salesStatus: string | null;
    originUrl: string | null;

    constructor({
        id = null,
        images = [],
        category = null,
        categoryName = null,
        name = null,
        grade = null,
        quantity = undefined,
        price = 0,
        seller = null,
        uploadDate = null,
        buyer = null,
        purchaseDate = null,
        description = null,
        salesStatus = null,
        originUrl = null,
    }: {
        id?: number | null;
        images?: string[];
        category?: number | null;
        categoryName?: string | null;
        name?: string | null;
        grade?: string | null;
        quantity?: number;
        price?: number | null;
        seller?: number | null;
        uploadDate?: string | null;
        buyer?: number | null;
        purchaseDate?: string | null;
        description?: string | null;
        salesStatus?: string | null;
        originUrl?: string | null;
    }) {
        this.id = id;
        this.images = images;
        this.category = category;
        this.categoryName = categoryName;
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
        this.originUrl = originUrl;
    }

    static fromJson(jsonData: any): ProductModel {
        return new ProductModel({
            id: jsonData['id'],
            images: jsonData['images'] || [],
            category: jsonData['category'],
            name: jsonData['name'],
            grade: jsonData['grade'],
            quantity: jsonData['quantity'],
            price: jsonData['price'],
            seller: jsonData['seller'],
            uploadDate: jsonData['upload_date'],
            buyer: jsonData['buyer'],
            purchaseDate: jsonData['purchase_date'],
            description: jsonData['description'],
            salesStatus: jsonData['sales_status'],
            originUrl: jsonData['origin_url'],
        });
    }

    toJson(): any {
        return {
            id: this.id,
            images: this.images,
            category: this.category,
            name: this.name,
            grade: this.grade,
            quantity: this.quantity,
            price: this.price,
            seller: this.seller,
            upload_date: this.uploadDate,
            buyer: this.buyer,
            purchase_date: this.purchaseDate,
            description: this.description,
            sales_status: this.salesStatus,
            origin_url: this.originUrl,
        };
    }

    toJsonWithoutId(): any {
        return {
            images: this.images,
            category: this.category,
            name: this.name,
            grade: this.grade,
            quantity: this.quantity,
            price: this.price,
            seller: this.seller,
            upload_date: this.uploadDate,
            buyer: this.buyer,
            purchase_date: this.purchaseDate,
            description: this.description,
            sales_status: this.salesStatus,
            origin_url: this.originUrl,
        };
    }

    copyWith(update: Partial<ProductModel>): ProductModel {
        return new ProductModel({ ...this, ...update });
    }

    addImage(imageUrl: string): ProductModel {
        return this.copyWith({ images: [...(this.images ?? []), imageUrl] });
    }
}
