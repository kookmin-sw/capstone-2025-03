import { useRecoilState } from "recoil";
import { orderState } from "../recoil/orderState";
import {
    getOrderListInService,
    createOrderInService,
    getOrderInService,
    updateOrderInService,
    deleteOrderInService
} from "../services/orderService";
import OrderModel from "../models/OrderModel";

export const useOrder = () => {
    const [orders, setOrders] = useRecoilState(orderState);

    // List Read
    const getOrderList = async (): Promise<OrderModel[] | null> => {
        const newOrderList = await getOrderListInService();
        if (newOrderList) setOrders(newOrderList);
        return newOrderList;
    }

    // Create
    const createOrder = async (orderData: OrderModel): Promise<OrderModel | null> => {
        const newOrder = await createOrderInService(orderData);
        if (newOrder) setOrders(prevOrders => [...prevOrders, newOrder]);
        return newOrder;
    }

    // Read
    const getOrder = async (orderId: number): Promise<OrderModel | null> => {
        const targetOrder = orders.find((order) => order.id === orderId);
        if (targetOrder) return targetOrder;
        const newOrder = await getOrderInService(orderId);
        if (newOrder) setOrders(prevOrders => [...prevOrders, newOrder]);
        return newOrder;
    }

    // Update
    const updateOrder = async (orderId: number, updatedData: Partial<OrderModel>): Promise<OrderModel | null> => {
        const newOrder = await updateOrderInService(orderId, updatedData);
        if (newOrder) setOrders(prevOrders => prevOrders.map((order) => order.id === orderId ? newOrder : order));
        return newOrder;
    }

    // Delete
    const deleteOrder = async (orderId: number): Promise<boolean> => {
        const isSuccess = await deleteOrderInService(orderId);
        if (isSuccess) setOrders(prevOrders => prevOrders.filter((order) => order.id !== orderId));
        return isSuccess;
    }

    return { orders, getOrderList, createOrder, getOrder, updateOrder, deleteOrder };
}