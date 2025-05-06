import ProductModel from './ProductModel'; // 실제 경로에 맞게 수정

export default class PackageModel {
  id: number | null;
  userId: number | null;
  industry: number | null;
  categories: number[];
  products: ProductModel[]; // ← 수정됨
  thumbnail: string | null;
  name: string | null;
  description: string | null;
  price: number;

  constructor({
    id = null,
    userId = null,
    industry = null,
    categories = [],
    products = [],
    name = null,
    thumbnail = null,
    description = null,
    price = 0,
  }: {
    id?: number | null;
    userId?: number | null;
    industry?: number | null;
    categories?: number[];
    products?: ProductModel[]; // ← 수정됨
    name?: string | null;
    thumbnail?: string | null;
    description?: string | null;
    price?: number;
  }) {
    this.id = id;
    this.userId = userId;
    this.industry = industry;
    this.categories = categories;
    this.products = products;
    this.name = name;
    this.thumbnail = thumbnail;
    this.description = description;
    this.price = price;
  }

  static fromJson(jsonData: any): PackageModel {
    const products = (jsonData['products'] || []).map((p: any) =>
      ProductModel.fromJson(p)
    );

    return new PackageModel({
      id: jsonData['id'],
      userId: jsonData['user_id'],
      industry: jsonData['industry'],
      categories: jsonData['categories'] || [],
      products,
      name: jsonData['name'],
      thumbnail: jsonData['thumbnail'],
      description: jsonData['description'],
      price: jsonData['price'],
    });
  }

  toJson(): any {
    return {
      id: this.id,
      user_id: this.userId,
      industry: this.industry,
      categories: this.categories,
      products: this.products.map((p) => p.toJson()), // ← 수정됨
      name: this.name,
      thumbnail: this.thumbnail,
      description: this.description,
      price: this.price,
    };
  }

  toJsonWithoutId(): any {
    return {
      user_id: this.userId,
      industry: this.industry,
      categories: this.categories,
      products: this.products.map((p) => p.toJson()), // ← 수정됨
      name: this.name,
      thumbnail: this.thumbnail,
      description: this.description,
      price: this.price,
    };
  }
}