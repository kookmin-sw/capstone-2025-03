export class PackageModel {
    id: string | null;
    industryId: string | null;
    categoryIds: string[];
    productIds: string[];
    name: string | null;
    thumbnail: string | null;

    constructor({
        id = null,
        industryId = null,
        categoryIds = [],
        productIds = [],
        name = null,
        thumbnail = null,
    }: {
        id?: string | null;
        industryId?: string | null;
        categoryIds?: string[];
        productIds?: string[];
        name?: string | null;
        thumbnail?: string | null;
    }) {
        this.id = id;
        this.industryId = industryId;
        this.categoryIds = categoryIds;
        this.productIds = productIds;
        this.name = name;
        this.thumbnail = thumbnail;
    }

    static fromJson(jsonData: any): PackageModel {
        return new PackageModel({
            id: jsonData.id,
            industryId: jsonData.industryId,
            categoryIds: jsonData.categoryIds || [],
            productIds: jsonData.productIds || [],
            name: jsonData.name,
            thumbnail: jsonData.thumbnail,
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
        };
    }
}