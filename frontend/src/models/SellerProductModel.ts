export default class SellerProductModel {
  id: number | null;
  categoryId: number | null;
  images: string[];
  name: string | null;
  description: string | null;
  grade: string | null;
  quantity: number;
  price: number | null;
  sellerId: number | null;
  uploadDate: string | null; // ISO 8601: YYYY-MM-DDTHH:MM:SS.sssZ
  buyerId: number | null;
  purchaseDate: string | null; // ISO 8601: YYYY-MM-DDTHH:MM:SS.sssZ
  saleStatus: string | null;

  constructor({
    id = null,
    images = [],
    categoryId = null,
    name = null,
    description = null,
    grade = null,
    quantity = 0,
    price = 0,
    sellerId = null,
    uploadDate = null,
    saleStatus = null,
    buyerId = null,
    purchaseDate = null,
  }: {
    id?: number | null;
    images?: string[];
    categoryId?: number | null;
    name?: string | null;
    description?: string | null;
    grade?: string | null;
    quantity?: number;
    price?: number | null;
    sellerId?: number | null;
    uploadDate?: string | null;
    saleStatus?: string | null;
    buyerId?: number | null;
    purchaseDate?: string | null;
  }) {
    this.id = id;
    this.images = images;
    this.categoryId = categoryId;
    this.name = name;
    this.description = description;
    this.grade = grade;
    this.quantity = quantity;
    this.price = price;
    this.sellerId = sellerId;
    this.uploadDate = uploadDate;
    this.saleStatus = saleStatus;
    this.buyerId = buyerId;
    this.purchaseDate = purchaseDate;
  }

  static fromJson(jsonData: any): SellerProductModel {
    return new SellerProductModel({
      id: jsonData.id,
      images: jsonData.images || [],
      categoryId: jsonData.category,
      name: jsonData.name,
      description: jsonData.description,
      grade: jsonData.grade,
      quantity: jsonData.quantity,
      price: jsonData.price,
      sellerId: jsonData.seller,
      uploadDate: jsonData.upload_date,
      saleStatus: jsonData.sales_status,
      buyerId: jsonData.buyer,
      purchaseDate: jsonData.purchase_date,
    });
  }

  toJson(): any {
    return {
      images: this.images,
      category: this.categoryId,
      name: this.name,
      description: this.description,
      grade: this.grade,
      quantity: this.quantity,
      price: this.price,
      seller: this.sellerId,
      upload_date: this.uploadDate,
      sales_status: this.saleStatus,
      buyer: this.buyerId,
      purchase_date: this.purchaseDate,
    };
  }
}
