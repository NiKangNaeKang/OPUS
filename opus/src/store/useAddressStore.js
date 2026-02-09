import { create } from "zustand";
import axiosApi from "../api/axiosAPI";

export const useAddressStore = create((set, get) => ({
  addresses: [],
  selectedAddressId: null,
  isLoading: false,

  /* 배송지 목록 조회 */
  fetchAddresses: async () => {
    set({ isLoading: true });
    try {
      const resp = await axiosApi.get("/address/addresses");

      const list = resp.data ?? [];
      const defaultAddr = list.find(a => a.isDefault === "Y");

      set({
        addresses: list,
        selectedAddressId:
          defaultAddr?.addressNo ?? list[0]?.addressNo ?? null,
        isLoading: false
      });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },

  selectAddress: (id) => set({ selectedAddressId: id }),

  addAddress: async (form) => {
    await axiosApi.post("/address/addresses", {
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
    await axiosApi.put(`/address/addresses/${id}`, {
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
    await axiosApi.delete(`/address/addresses/${id}`);
    await get().fetchAddresses();
  },

  setDefaultAddress: async (id) => {
    await axiosApi.put(`/address/addresses/${id}/default`);
    await get().fetchAddresses();
  }
}));
