import { ProductModel } from "./ProductModel";
import { CategoryModel } from "./CategoryModel";

export class PackageModel {
    id: string | null;
    industryId: string | null;
    categories: CategoryModel[];
    products: ProductModel[];
    name: string | null;
    thumbnail: string | null;

    constructor({
        id = null,
        industryId = null,
        categories = [],
        products = [],
        name = null,
        thumbnail = null,
    }: {
        id?: string | null;
        industryId?: string | null;
        categories?: CategoryModel[];
        products?: ProductModel[];
        name?: string | null;
        thumbnail?: string | null;
    }) {
        this.id = id;
        this.industryId = industryId;
        this.categories = categories;
        this.products = products;
        this.name = name;
        this.thumbnail = thumbnail;
    }

    static fromJson(jsonData: any): PackageModel {
        return new PackageModel({
            id: jsonData.id,
            industryId: jsonData.industryId,
            categories: (jsonData.categories || []).map((c: any) => CategoryModel.fromJson(c)),
            products: (jsonData.products || []).map((p: any) => ProductModel.fromJson(p)),
            name: jsonData.name,
            thumbnail: jsonData.thumbnail,
        });
    }

    toJson(): any {
        return {
            id: this.id,
            industryId: this.industryId,
            categories: this.categories.map(c => c.toJson()),
            products: this.products.map(p => p.toJson()),
            name: this.name,
            thumbnail: this.thumbnail,
        };
    }
}