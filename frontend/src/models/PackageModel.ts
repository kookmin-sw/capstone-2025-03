export default class PackageModel {
    id: number | null; // 유지
    industry: number | null;
    categories: number[];
    products: number[];
    thumbnail: string | null;
    name: string | null;
    description: string | null;
    price: number;

    constructor({
        id = null,
        industry = null,
        categories = [],
        products = [],
        name = null,
        thumbnail = null,
        description = null,
        price = 0
    }: {
        id?: number | null;
        industry?: number | null;
        categories?: number[];
        products?: number[];
        name?: string | null;
        thumbnail?: string | null;
        description?: string | null;
        price?: number;
    }) {
        this.id = id;
        this.industry = industry;
        this.categories = categories;
        this.products = products;
        this.name = name;
        this.thumbnail = thumbnail;
        this.description = description;
        this.price = price;
    }

    static fromJson(jsonData: any): PackageModel {
        return new PackageModel({
            id: jsonData["id"],
            industry: jsonData["industry"],
            categories: jsonData["categories"] || [],
            products: jsonData["products"] || [],
            name: jsonData["name"],
            thumbnail: jsonData["thumbnail"],
            description: jsonData["description"],
            price: jsonData["price"]
        });
    }

    toJson(): any {
        return {
            "id": this.id,
            "industry": this.industry,
            "categories": this.categories,
            "products": this.products,
            "name": this.name,
            "thumbnail": this.thumbnail,
            "description": this.description,
            "price": this.price
        };
    }

    toJsonWithoutId(): any {
        return {
            "industry": this.industry,
            "categories": this.categories,
            "products": this.products,
            "name": this.name,
            "thumbnail": this.thumbnail,
            "description": this.description,
            "price": this.price
        };
    }
}