export class UserModel {
    userId: string | null;
    name: string | null;
    kakaoEmail: string | null;
    phoneNumber: string;
    birthDate: string | null; // ISO 8601: YYYY-MM-DD
    fullAddress: string | null;
    addressDetail: string | null;
    createDate: string | null; // ISO 8601: YYYY-MM-DDTHH:MM:SS.sssZ

    constructor({
        userId = null,
        name = null,
        kakaoEmail = null,
        phoneNumber = "",
        birthDate = null,
        fullAddress = null,
        addressDetail = null,
        createDate = null,
    }: {
        userId?: string | null;
        name?: string | null;
        kakaoEmail?: string | null;
        phoneNumber?: string;
        birthDate?: string | null;
        fullAddress?: string | null;
        addressDetail?: string | null;
        createDate?: string | null;
    }) {
        this.userId = userId;
        this.name = name;
        this.kakaoEmail = kakaoEmail;
        this.phoneNumber = phoneNumber;
        this.birthDate = birthDate;
        this.fullAddress = fullAddress;
        this.addressDetail = addressDetail;
        this.createDate = createDate;
    }

    static fromJson(jsonData: any): UserModel {
        return new UserModel({
            userId: jsonData.userId,
            name: jsonData.name,
            kakaoEmail: jsonData.kakaoEmail,
            phoneNumber: jsonData.phoneNumber,
            birthDate: jsonData.birthDate,
            fullAddress: jsonData.fullAddress,
            addressDetail: jsonData.addressDetail,
            createDate: jsonData.createDate,
        });
    }

    toJson(): any {
        return {
            name: this.name,
            kakaoEmail: this.kakaoEmail,
            phoneNumber: this.phoneNumber,
            birthDate: this.birthDate,
            fullAddress: this.fullAddress,
            addressDetail: this.addressDetail,
            createDate: this.createDate,
        };
    }
}  