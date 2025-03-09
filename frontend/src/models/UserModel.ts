export class UserModel {
  userId: string | null;
  name: string | null;
  kakaoId: number | null;
  profileImage: string | null;
  kakaoEmail: string | null;
  phoneNumber: string;
  birthDate: string | null; // ISO 8601: YYYY-MM-DD
  fullAddress: string | null;
  addressDetail: string | null;
  createDate: string | null; // ISO 8601: YYYY-MM-DDTHH:MM:SS.sssZ

  constructor({
    userId = null,
    name = null,
    kakaoId = null,
    profileImage = null,
    kakaoEmail = null,
    phoneNumber = "",
    birthDate = null,
    fullAddress = null,
    addressDetail = null,
    createDate = null,
  }: {
    userId?: string | null;
    name?: string | null;
    kakaoId?: number | null;
    profileImage?: string | null;
    kakaoEmail?: string | null;
    phoneNumber?: string;
    birthDate?: string | null;
    fullAddress?: string | null;
    addressDetail?: string | null;
    createDate?: string | null;
  }) {
    this.userId = userId;
    this.name = name;
    this.kakaoId = kakaoId;
    this.profileImage = profileImage;
    this.kakaoEmail = kakaoEmail;
    this.phoneNumber = phoneNumber;
    this.birthDate = birthDate;
    this.fullAddress = fullAddress;
    this.addressDetail = addressDetail;
    this.createDate = createDate;
  }

  static fromJson(jsonData: any): UserModel {
    return new UserModel({
      userId: jsonData.id,
      name: jsonData.name,
      kakaoId: jsonData.kakao_id,
      profileImage: jsonData.profile_image,
      kakaoEmail: jsonData.kakao_email,
      phoneNumber: jsonData.phone_number,
      birthDate: jsonData.birth_date,
      fullAddress: jsonData.full_address,
      addressDetail: jsonData.address_detail,
      createDate: jsonData.create_date,
    });
  }

  toJson(): any {
    return {
      id: this.userId,
      name: this.name,
      kakao_id: this.kakaoId,
      profile_image: this.profileImage,
      kakao_email: this.kakaoEmail,
      phone_number: this.phoneNumber,
      birth_date: this.birthDate,
      full_address: this.fullAddress,
      address_detail: this.addressDetail,
      createDate: this.createDate,
    };
  }
}
