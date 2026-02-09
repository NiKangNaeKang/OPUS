import { create } from "zustand";
import axiosApi from "../api/axiosAPI";

export const useAddressStore = create((set, get) => ({
  addresses: [{
    deliveryInfoNo: 1,
    recipient: "홍길동",
    recipientTel: "010-1234-5678",
    postcode: "12345",
    basicAddress: "서울특별시 강남구 테헤란로 123",
    detailAddress: "101동 202호",
    deliveryReq: "문 앞에 놓아주세요",
    isDefault: "Y" // 기본 배송지
  },
  {
    deliveryInfoNo: 2,
    recipient: "김철수",
    recipientTel: "010-8765-4321",
    postcode: "54321",
    basicAddress: "서울특별시 마포구 월드컵북로 456",
    detailAddress: "303호",
    deliveryReq: "",
    isDefault: "N"
  }],
  selectedAddressId: null,
  isLoading: false,
  

  /* 배송지 목록 조회 */
  fetchAddresses: async () => {
    set({ isLoading: true });
    try {
      const resp = await axiosApi.get("/selections/deliveryInfo");

      const list = resp.data ?? [];
      const defaultAddr = list.find(a => a.isDefault === "Y");

      set({
        addresses: list,
        selectedAddressId:
          defaultAddr?.deliveryInfoNo ?? list[0]?.deliveryInfoNo ?? null,
        isLoading: false
      });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },

  selectAddress: (id) => set({ selectedAddressId: id }),

  addAddress: async (form) => {
    await axiosApi.post("/selections/deliveryInfo", {
      recipient: form.recipient,
      recipientTel: form.recipientTel,
      postcode: form.postcode,
      basicAddress: form.basicAddress,
      detailAddress: form.detailAddress,
      deliveryReq: form.deliveryReq,
      isDefault: form.isDefault ?? "N"
    });
    await get().fetchAddresses();
  },

  updateAddress: async (id, form) => {
    await axiosApi.put(`/selections/deliveryInfo/${id}`, {
      recipient: form.recipient,
      recipientTel: form.recipientTel,
      postcode: form.postcode,
      basicAddress: form.basicAddress,
      detailAddress: form.detailAddress,
      deliveryReq: form.deliveryReq,
      isDefault: form.isDefault ?? "N"
    });
    await get().fetchAddresses();
  },

  deleteAddress: async (id) => {
    await axiosApi.delete(`/selections/deliveryInfo/${id}`);
    await get().fetchAddresses();
  },

  setDefaultAddress: async (id) => {
    await axiosApi.put(`/selections/deliveryInfo/${id}/default`);
    await get().fetchAddresses();
  }
}));
