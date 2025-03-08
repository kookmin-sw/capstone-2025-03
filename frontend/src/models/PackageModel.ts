export default class PackageModel {
    id: number | null;
    industryId: number | null;
    categoryIds: number[];
    productIds: number[];
    thumbnail: string | null;
    name: string | null;
    description: string | null;
    price: number | 0;

    constructor({
        id = null,
        industryId = null,
        categoryIds = [],
        productIds = [],
        name = null,
        thumbnail = null,
        description = null,
        price = 0
    }: {
        id?: number | null;
        industryId?: number | null;
        categoryIds?: number[];
        productIds?: number[];
        name?: string | null;
        thumbnail?: string | null;
        description: string | null;
        price: number | 0;
    }) {
        this.id = id;
        this.industryId = industryId;
        this.categoryIds = categoryIds;
        this.productIds = productIds;
        this.name = name;
        this.thumbnail = thumbnail;
        this.description = description;
        this.price = price;
    }

    static fromJson(jsonData: any): PackageModel {
        return new PackageModel({
            id: jsonData.id,
            industryId: jsonData.industry_id,
            categoryIds: jsonData.category_ids || [],
            productIds: jsonData.product_ids || [],
            name: jsonData.name,
            thumbnail: jsonData.thumbnail,
            description: jsonData.description,
            price: jsonData.price
        });
    }

    toJson(): any {
        return {
            id: this.id,
            industry_id: this.industryId,
            category_ids: this.categoryIds,
            product_ids: this.productIds,
            name: this.name,
            thumbnail: this.thumbnail,
            description: this.description,
            price: this.price
        };
    }

    toJsonWithoutId(): any {
        return {
            industry_id: this.industryId,
            category_ids: this.categoryIds,
            product_ids: this.productIds,
            name: this.name,
            thumbnail: this.thumbnail,
            description: this.description,
            price: this.price
        };
    }
}