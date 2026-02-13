import axiosApi from "./axiosAPI";


export const orderApi = {

  // 주문 생성 (결제 전)
  createOrder: async (orderData) => {
    try {
      const response = await axiosApi.post("/orders", orderData);
      return response.data;
    } catch (error) {
      console.error("주문 생성 실패:", error);
      throw error;
    }
  },

  // 결제 승인 (최종 확정)
  confirmPayment: async (confirmData) => {
    try {
      const response = await axiosApi.post("/orders/confirm", confirmData);
      return response.data;
    } catch (error) {
      console.error("결제 승인 실패:", error);
      throw error;
    }
  },
}