import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.BASE_URL;
console.log("process.env.BASE_URL : ", process.env.BASE_URL)

if (!BASE_URL) {
    throw new Error("❌ BASE_URL이 정의되지 않았습니다.");
}

const api = axios.create({
    baseURL: BASE_URL
    // timeout: 5000,
});

export default api;
