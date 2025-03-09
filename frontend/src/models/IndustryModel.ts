export default class IndustryModel {
    id: number | null;
    icon: string | null;
    name: string | null;

    constructor({
        id = null,
        icon = null,
        name = null,
    }: {
        id?: number | null;
        icon?: string | null;
        name?: string | null;
    }) {
        this.id = id;
        this.icon = icon;
        this.name = name;
    }

    static fromJson(jsonData: any): IndustryModel {
        return new IndustryModel({
            id: jsonData["id"],
            icon: jsonData["icon"],
            name: jsonData["name"],
        });
    }

    toJson(): any {
        return {
            "id": this.id,
            "icon": this.icon,
            "name": this.name,
        };
    }
}