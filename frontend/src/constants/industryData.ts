import IndustryModel from "../models/IndustryModel";
import food from "../assets/images/industry_icons/food.png";
import beauty from "../assets/images/industry_icons/beauty.png";
import overseasTrade from "../assets/images/industry_icons/overseas_trade.png";
import lessonShop from "../assets/images/industry_icons/lesson_shop.png";
import cafe from "../assets/images/industry_icons/cafe.png";
import streetVendor from "../assets/images/industry_icons/street_vendor.png";
import entertainment from "../assets/images/industry_icons/entertainment.png";
import academy from "../assets/images/industry_icons/academy.png";
import convenienceStore from "../assets/images/industry_icons/convenience_store.png";
import delivery from "../assets/images/industry_icons/delivery.png";
import hotel from "../assets/images/industry_icons/hotel.png";
import dessert from "../assets/images/industry_icons/dessert.png";
import hair from "../assets/images/industry_icons/hair.png";
import business from "../assets/images/industry_icons/business.png";
import techStartup from "../assets/images/industry_icons/tech_startup.png";
import study from "../assets/images/industry_icons/study.png";
import bakery from "../assets/images/industry_icons/bakery.png";
import distribution from "../assets/images/industry_icons/distribution.png";
import unmannedStartup from "../assets/images/industry_icons/unmanned_startup.png";
import foodTruck from "../assets/images/industry_icons/food_truck.png";
import nail from "../assets/images/industry_icons/nail.png";
import professionalService from "../assets/images/industry_icons/professional_service.png";
import startup from "../assets/images/industry_icons/startup.png";
import shoppingMall from "../assets/images/industry_icons/shopping_mall.png";
import petBusiness from "../assets/images/industry_icons/pet_business.png";
import health from "../assets/images/industry_icons/health.png";
import leisure from "../assets/images/industry_icons/leisure.png";
import screen from "../assets/images/industry_icons/screen.png";

export const industryData: IndustryModel[] = [
    new IndustryModel({ id: 1, icon: food, name: "음식", categoryIds: [2] }),
    new IndustryModel({ id: 2, icon: beauty, name: "뷰티", categoryIds: [] }),
    new IndustryModel({ id: 3, icon: overseasTrade, name: "해외장사", categoryIds: [] }),
    new IndustryModel({ id: 4, icon: lessonShop, name: "레슨샵", categoryIds: [] }),
    new IndustryModel({ id: 5, icon: cafe, name: "카페", categoryIds: [] }),
    new IndustryModel({ id: 6, icon: streetVendor, name: "노점", categoryIds: [] }),
    new IndustryModel({ id: 7, icon: entertainment, name: "오락", categoryIds: [] }),
    new IndustryModel({ id: 8, icon: academy, name: "학원/교육", categoryIds: [] }),
    new IndustryModel({ id: 9, icon: convenienceStore, name: "편의점", categoryIds: [] }),
    new IndustryModel({ id: 10, icon: delivery, name: "배달", categoryIds: [] }),
    new IndustryModel({ id: 11, icon: hotel, name: "숙박업", categoryIds: [] }),
    new IndustryModel({ id: 12, icon: dessert, name: "디저트", categoryIds: [] }),
    new IndustryModel({ id: 13, icon: hair, name: "미용", categoryIds: [] }),
    new IndustryModel({ id: 14, icon: business, name: "사업", categoryIds: [] }),
    new IndustryModel({ id: 15, icon: techStartup, name: "기술창업", categoryIds: [] }),
    new IndustryModel({ id: 16, icon: study, name: "스터디", categoryIds: [] }),
    new IndustryModel({ id: 17, icon: bakery, name: "제과", categoryIds: [] }),
    new IndustryModel({ id: 18, icon: distribution, name: "유통업", categoryIds: [] }),
    new IndustryModel({ id: 19, icon: unmannedStartup, name: "무인 창업", categoryIds: [] }),
    new IndustryModel({ id: 20, icon: foodTruck, name: "푸드트럭", categoryIds: [] }),
    new IndustryModel({ id: 21, icon: nail, name: "네일", categoryIds: [] }),
    new IndustryModel({ id: 22, icon: professionalService, name: "전문서비스", categoryIds: [] }),
    new IndustryModel({ id: 23, icon: startup, name: "스타트업/1인기업", categoryIds: [] }),
    new IndustryModel({ id: 24, icon: shoppingMall, name: "스마트스토어/쇼핑몰", categoryIds: [] }),
    new IndustryModel({ id: 25, icon: petBusiness, name: "애견샵/반려동물", categoryIds: [] }),
    new IndustryModel({ id: 26, icon: health, name: "헬스장", categoryIds: [] }),
    new IndustryModel({ id: 27, icon: leisure, name: "레저", categoryIds: [] }),
    new IndustryModel({ id: 28, icon: screen, name: "스크린", categoryIds: [] })
];