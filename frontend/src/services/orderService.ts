import axios from "axios";
import OrderModel from "../models/OrderModel";

const API_BASE_URL = "https://django-uxvt.onrender.com/orders";

/**
 * 전체 주문 리스트를 가져옵니다.
 * @returns {Promise<OrderModel[] | null>}
 */
export const getOrderListInService = async (): Promise<OrderModel[] | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`);
    return response.data.results.map((order: any) => OrderModel.fromJson(order));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return null;
  }
};

/**
 * 주문을 생성하고 서버에 저장합니다.
 * @param {OrderModel} order - 생성할 주문 객체
 * @returns {Promise<OrderModel | null>}
 */
export const createOrderInService = async (order: OrderModel): Promise<OrderModel | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/`, order.toJsonWithoutId());
    return OrderModel.fromJson(response.data);
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
};

/**
 * 특정 orderId로 서버에서 주문 데이터를 가져옵니다.
 * @param {number} orderId - 가져올 주문의 ID
 * @returns {Promise<OrderModel | null>}
 */
export const getOrderInService = async (orderId: number): Promise<OrderModel | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${orderId}/`);
    return OrderModel.fromJson(response.data);
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
};

/**
 * 특정 orderId로 서버에서 주문 데이터를 업데이트합니다.
 * @param {number} orderId - 업데이트할 주문의 ID
 * @param {Partial<OrderModel>} updatedData - 업데이트할 데이터 객체
 * @returns {Promise<OrderModel | null>}
 */
export const updateOrderInService = async (
  orderId: number,
  updatedData: Partial<OrderModel>
): Promise<OrderModel | null> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${orderId}/`, updatedData);
    return OrderModel.fromJson(response.data);
  } catch (error) {
    console.error("Error updating order:", error);
    return null;
  }
};

/**
 * 특정 orderId로 서버에서 주문 데이터를 삭제합니다.
 * @param {number} orderId - 삭제할 주문의 ID
 * @returns {Promise<boolean>}
 */
export const deleteOrderInService = async (orderId: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_BASE_URL}/${orderId}/`);
    return true;
  } catch (error) {
    console.error("Error deleting order:", error);
    return false;
  }
};