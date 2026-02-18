import axiosApi from "./axiosAPI";


export const orderApi = {

  // 주문 생성 (결제 전)
  createOrder: async (orderData) => {
    try {
      const resp = await axiosApi.post("/orders", orderData);
      return resp.data;
    } catch (error) {
      console.error("주문 생성 실패:", error);
      throw error;
    }
  },

  // 결제 승인 (최종 확정)
  confirmPayment: async (confirmData) => {
    try {
      const resp = await axiosApi.post("/orders/confirm", confirmData);
      return resp.data;
    } catch (error) {
      console.error("결제 승인 실패:", error);
      throw error;
    }
  },
}