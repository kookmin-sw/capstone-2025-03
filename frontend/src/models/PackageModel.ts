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
        this.price = price
    }

    static fromJson(jsonData: any): PackageModel {
        return new PackageModel({
            id: jsonData.id,
            industryId: jsonData.industryId,
            categoryIds: jsonData.categoryIds || [],
            productIds: jsonData.productIds || [],
            name: jsonData.name,
            thumbnail: jsonData.thumbnail,
            description: jsonData.description,
            price: jsonData.price
        });
    }

    toJson(): any {
        return {
            id: this.id,
            industryId: this.industryId,
            categoryIds: this.categoryIds,
            productIds: this.productIds,
            name: this.name,
            thumbnail: this.thumbnail,
            description: this.description,
            price: this.price
        };
    }

    toJsonWithoutId(): any {
        return {
            industryId: this.industryId,
            categoryIds: this.categoryIds,
            productIds: this.productIds,
            name: this.name,
            thumbnail: this.thumbnail,
            description: this.description,
            price: this.price
        };
    }
}