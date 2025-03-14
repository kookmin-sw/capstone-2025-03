export default class CategoryModel {
    id: number | null; // 유지
    industries: number[];
    thumbnail: string | null;
    name: string | null;

    constructor({
        id = null,
        industries = [],
        thumbnail = null,
        name = null,
    }: {
        id?: number | null;
        industries?: number[];
        thumbnail?: string | null;
        name?: string | null;
    }) {
        this.id = id;
        this.industries = industries;
        this.thumbnail = thumbnail;
        this.name = name;
    }

    static fromJson(jsonData: any): CategoryModel {
        return new CategoryModel({
            id: jsonData["id"],
            industries: jsonData["industries"] || [],
            thumbnail: jsonData["thumbnail"],
            name: jsonData["name"],
        });
    }

    toJson(): any {
        return {
            "id": this.id,
            "industries": this.industries,
            "thumbnail": this.thumbnail,
            "name": this.name,
        };
    }

    toJsonWithoutId(): any {
        return {
            "industries": this.industries,
            "thumbnail": this.thumbnail,
            "name": this.name,
        };
    }
}