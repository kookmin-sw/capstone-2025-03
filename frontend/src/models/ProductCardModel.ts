export default class ProductCardModel {
    id: number;
    name: string;
    grade: string;
    price: number;
    thumbnail: string;

    constructor({
        id,
        name,
        grade,
        price,
        thumbnail,
    }: {
        id: number;
        name: string;
        grade: string;
        price: number;
        thumbnail: string;
    }) {
        this.id = id;
        this.name = name;
        this.grade = grade;
        this.price = price;
        this.thumbnail = thumbnail;
    }

    static fromJson(jsonData: any): ProductCardModel {
        return new ProductCardModel({
            id: jsonData['id'],
            name: jsonData['name'],
            grade: jsonData['grade'],
            price: jsonData['price'],
            thumbnail: jsonData['thumbnail'],
        });
    }

    toJson(): any {
        return {
            id: this.id,
            name: this.name,
            grade: this.grade,
            price: this.price,
            thumbnail: this.thumbnail,
        };
    }

    toJsonWithoutId(): any {
        return {
            id: this.id,
            name: this.name,
            grade: this.grade,
            price: this.price,
            thumbnail: this.thumbnail,
        };
    }
}
