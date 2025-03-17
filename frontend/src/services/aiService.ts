import axios from 'axios';

const AI_BASE_URL = import.meta.env.VITE_AI_BASE_URL;

// 판매 물품 등록 시 가격 예측을 합니다.
export const optimizePriceInService = async (name: string, grade: string, quantity: number) => {
    try {
        const response = await axios.post(`${AI_BASE_URL}/predict/`, { name, grade, quantity });
        return response.data;
    } catch (error) {
        console.error('Error optimizing price: ', error);
        throw error;
    }
};
