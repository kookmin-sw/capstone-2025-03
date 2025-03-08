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
            id: jsonData.id,
            userId: jsonData.userId,
            packageId: jsonData.packageId,
        });
    }

    toJson(): any {
        return {
            id: this.id,
            userId: this.userId,
            packageId: this.packageId,
        };
    }

    toJsonWithoutId(): any {
        return {
            userId: this.userId,
            packageId: this.packageId,
        };
    }
}