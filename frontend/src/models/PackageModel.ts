import { ProductModel } from "./ProductModel";

export class PackageModel {
    id: string | null;
    industryId: string | null;
    categoryIds: string[];
    products: ProductModel[];
    name: string | null;
    thumbnail: string | null;

    constructor({
        id = null,
        industryId = null,
        categoryIds = [],
        products = [],
        name = null,
        thumbnail = null,
    }: {
        id?: string | null;
        industryId?: string | null;
        categoryIds?: string[];
        products?: ProductModel[];
        name?: string | null;
        thumbnail?: string | null;
    }) {
        this.id = id;
        this.industryId = industryId;
        this.categoryIds = categoryIds;
        this.products = products;
        this.name = name;
        this.thumbnail = thumbnail;
    }

    static fromJson(jsonData: any): PackageModel {
        return new PackageModel({
            id: jsonData.id,
            industryId: jsonData.industryId,
            categoryIds: jsonData.categoryIds || [],
            products: (jsonData.products || []).map((p: any) => ProductModel.fromJson(p)),
            name: jsonData.name,
            thumbnail: jsonData.thumbnail,
        });
    }

    toJson(): any {
        return {
            id: this.id,
            industryId: this.industryId,
            categoryIds: this.categoryIds,
            products: this.products.map(p => p.toJson()),
            name: this.name,
            thumbnail: this.thumbnail,
        };
    }
}