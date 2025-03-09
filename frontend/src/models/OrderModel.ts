export default class OrderModel {
    id: number | null;
    userId: number | null;
    packageId: number | null;
    createdAt: string | null;

    constructor({
        id = null,
        userId = null,
        packageId = null,
        createdAt = null,
    }: {
        id?: number | null;
        userId?: number | null;
        packageId?: number | null;
        createdAt?: string | null;
    }) {
        this.id = id;
        this.userId = userId;
        this.packageId = packageId;
        this.createdAt = createdAt;
    }

    static fromJson(jsonData: any): OrderModel {
        return new OrderModel({
            id: jsonData["id"],
            userId: jsonData["user_id"],
            packageId: jsonData["package_id"],
            createdAt: jsonData["created_at"],
        });
    }

    toJson(): any {
        return {
            "id": this.id,
            "user_id": this.userId,
            "package_id": this.packageId,
            "created_at": this.createdAt,
        };
    }

    toJsonWithoutId(): any {
        return {
            "user_id": this.userId,
            "package_id": this.packageId,
            "created_at": this.createdAt,
        };
    }
}