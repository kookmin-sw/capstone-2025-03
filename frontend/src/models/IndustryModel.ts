export default class IndustryModel {
    id: number | null;
    icon: string | null;
    name: string | null;
    categoryIds: number[]; // 추가된 필드

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
            categoryIds: jsonData.categoryIds ?? [], // JSON 데이터에서 categoryIds가 없을 경우 빈 배열
        });
    }

    toJson(): any {
        return {
            id: this.id,
            icon: this.icon,
            name: this.name,
            categoryIds: this.categoryIds,
        };
    }
}