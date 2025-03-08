export default class CategoryModel {
    id: number | null;
    industryIds: number[];
    thumbnail: string | null;
    name: string | null;

    constructor({
        id = null,
        industryIds = [],
        thumbnail = null,
        name = null,
    }: {
        id?: number | null;
        industryIds?: number[];
        thumbnail?: string | null;
        name?: string | null;
    }) {
        this.id = id;
        this.industryIds = industryIds;
        this.thumbnail = thumbnail;
        this.name = name;
    }

    static fromJson(jsonData: any): CategoryModel {
        return new CategoryModel({
            id: jsonData.id,
            industryIds: jsonData.industryIds || [],
            thumbnail: jsonData.thumbnail,
            name: jsonData.name,
        });
    }

    toJson(): any {
        return {
            id: this.id,
            industryIds: this.industryIds,
            thumbnail: this.thumbnail,
            name: this.name,
        };
    }

    toJsonWithoutId(): any {
        return {
            industryIds: this.industryIds,
            thumbnail: this.thumbnail,
            name: this.name,
        };
    }
}