export default class OrderModel {
    id: number | null; // 유지
    user: number | null;
    package: number | null;
    createdAt: string | null;

    constructor({
        id = null,
        user = null,
        package: _package = null, // package는 예약어라 _package로 받아서 처리
        createdAt = null,
    }: {
        id?: number | null;
        user?: number | null;
        package?: number | null;
        createdAt?: string | null;
    }) {
        this.id = id;
        this.user = user;
        this.package = _package;
        this.createdAt = createdAt;
    }

    static fromJson(jsonData: any): OrderModel {
        return new OrderModel({
            id: jsonData["id"],
            user: jsonData["user"],
            package: jsonData["package"],
            createdAt: jsonData["created_at"],
        });
    }

    toJson(): any {
        return {
            "id": this.id,
            "user": this.user,
            "package": this.package,
            "created_at": this.createdAt,
        };
    }

    toJsonWithoutId(): any {
        return {
            "user": this.user,
            "package": this.package,
            "created_at": this.createdAt,
        };
    }
}