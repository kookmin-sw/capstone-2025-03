export default class OrderModel {
    id: number | null;
    userId: number | null;
    packageId: number | null;

    constructor({
        id = null,
        userId = null,
        packageId = null,
    }: {
        id?: number | null;
        userId?: number | null;
        packageId?: number | null;
    }) {
        this.id = id;
        this.userId = userId;
        this.packageId = packageId;
    }

    static fromJson(jsonData: any): OrderModel {
        return new OrderModel({
            id: jsonData["id"],
            userId: jsonData["user_id"],
            packageId: jsonData["package_id"],
        });
    }

    toJson(): any {
        return {
            "id": this.id,
            "user_id": this.userId,
            "package_id": this.packageId,
        };
    }

    toJsonWithoutId(): any {
        return {
            "user_id": this.userId,
            "package_id": this.packageId,
        };
    }
}