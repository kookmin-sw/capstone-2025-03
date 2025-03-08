export default class IndustryModel {
    id: number | null;
    icon: string | null;
    name: string | null;
    categoryIds: number[];

    constructor({
        id = null,
        icon = null,
        name = null,
        categoryIds = [],
    }: {
        id?: number | null;
        icon?: string | null;
        name?: string | null;
        categoryIds?: number[];
    }) {
        this.id = id;
        this.icon = icon;
        this.name = name;
        this.categoryIds = categoryIds;
    }

    static fromJson(jsonData: any): IndustryModel {
        return new IndustryModel({
            id: jsonData.id,
            icon: jsonData.icon,
            name: jsonData.name,
            categoryIds: jsonData.category_ids ?? [],
        });
    }

    toJson(): any {
        return {
            id: this.id,
            icon: this.icon,
            name: this.name,
            category_ids: this.categoryIds,
        };
    }
}