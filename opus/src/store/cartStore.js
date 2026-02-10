import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartApi } from "../api/cartAPI";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      checkedKeys: [],
      isLoggedIn: false,
      isSyncing: false,

      // 로그인 상태 설정
      setLoggedIn: (status) => {
        set({ isLoggedIn: status });
      },

      // 서버에서 장바구니를 받아 한 번에 주입할 때(로그인/새로고침 후)
      setItems: (items) => set({ items: Array.isArray(items) ? items : [] }),
      setCheckedKeys: (keys) => set({ checkedKeys: Array.isArray(keys) ? keys : [] }),

      // 서버에서 장바구니 불러오기 (로그인 시)
      fetchFromServer: async () => {
        const { isLoggedIn } = get();
        if (!isLoggedIn) return;

        try {
          set({ isSyncing: true });
          const serverItems = await cartApi.selectCartItems();

          // 서버 데이터로 교체
          set({ items: serverItems, isSyncing: false });
        } catch (error) {
          console.error("서버 장바구니 조회 실패:", error);
          set({ isSyncing: false });
        }
      },

      // 로컬 장바구니를 서버로 병합 (로그인 직후)
      mergeWithServer: async () => {
        const { items, isLoggedIn } = get();
        if (!isLoggedIn || items.length === 0) return;

        try {
          set({ isSyncing: true });

          // 로컬 장바구니를 서버로 전송
          const mergedItems = await cartApi.mergeLocalCart(items);

          set({ items: mergedItems, isSyncing: false });

          console.log("장바구니 병합 완료:", mergedItems.length, "개 항목");
        } catch (error) {
          console.error("장바구니 병합 실패:", error);
          set({ isSyncing: false });
        }
      },


      // 장바구니 담기(동일 옵션이면 qty 누적)
      addItem: async (item) => {
        const { isLoggedIn, items } = get();

        if (isLoggedIn) {
          // 서버에 추가
          try {
            const newItem = await cartApi.addToCart({
              goodsNo: item.goodsNo,
              goodsOptionNo: item.goodsOptionNo,
              qty: item.qty,
            });

            // 서버에서 최신 목록 가져오기
            await get().fetchFromServer();

            return { success: true };
          } catch (error) {
            console.error("서버 장바구니 추가 실패:", error);
            return { success: false, error: error.message };
          }

        } else {
          // 로컬에만 추가
          const idx = items.findIndex((i) => i.cartKey === item.cartKey);

          if (idx === -1) {
            set({ items: [...items, item] });
            return;
          }

          // 기존 옵션이면 qty 누적
          const prev = items[idx];
          const stock = prev.stock ?? item.stock; // 둘 중 있는 값으로 재고 판단
          const nextQty = prev.qty + item.qty;

          if (stock != null && nextQty > stock) {
            alert(`선택 가능한 재고 수량을 초과했습니다. (최대 ${stock}개)`);
            return { success: false };
          }

          const nextItems = [...items];
          nextItems[idx] = { ...prev, qty: nextQty, stock };
          set({ items: nextItems });
        }

        return { success: true };
      },

      // 수량 변경
      setQty: async (cartKey, qty) => {
        const { isLoggedIn, items } = get();
        const idx = items.findIndex((item) => item.cartKey === cartKey);

        if (idx === -1) return;

        const target = items[idx];

        if (qty < 1) {
          alert("최소 수량은 1개입니다.");
          return;
        }

        if (target.stock != null && qty > target.stock) {
          alert("선택 가능한 재고 수량을 초과했습니다.");
          return;
        }

        if (isLoggedIn) {
          // 서버에서 수량 변경
          try {
            await cartApi.updateCartQty(target.cartNo, qty);
            await get().fetchFromServer();
          } catch (error) {
            console.error("수량 변경 실패:", error);
            alert("수량 변경에 실패했습니다.");
          }
        } else {
          // 로컬에서만 변경
          const nextItems = [...items];
          nextItems[idx] = { ...target, qty };
          set({ items: nextItems });
        }
      },

      // 삭제
      removeItems: async (cartKeys) => {
        const { isLoggedIn } = get();

        if (isLoggedIn) {
          // 서버에서 삭제
          try {
            await Promise.all(
              cartKeys.map((key) => {
                const item = get().items.find((i) => i.cartKey === key);
                return item ? cartApi.removeFromCart(item.cartNo) : null;
              })
            );
            await get().fetchFromServer();
          } catch (error) {
            console.error("삭제 실패:", error);
          }
        } else {
          // 로컬에서만 삭제
          set((state) => ({
            items: state.items.filter((item) => !cartKeys.includes(item.cartKey)),
            checkedKeys: state.checkedKeys.filter((key) => !cartKeys.includes(key)),
          }));
        }
      },


      // 전체 비우기
      clear: async () => {
        const { isLoggedIn } = get();

        if (isLoggedIn) {
          // 서버에서 비우기
          try {
            await cartApi.clearCart();
            set({ items: [], checkedKeys: [] });
          } catch (error) {
            console.error("장바구니 비우기 실패:", error);
          }
        } else {
          // 로컬에서만 비우기
          set({ items: [], checkedKeys: [] });
        }
      },

      // 합계 계산(필요할 때 호출)
      getTotals: () => {
        const items = get().items;
        const goodsTotal = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
        let shippingTotal = items.reduce((sum, i) => sum + (i.deliveryCost ?? 0), 0);
        if (goodsTotal >= 50000) shippingTotal = 0;
        const grandTotal = goodsTotal + shippingTotal;
        return { goodsTotal, shippingTotal, grandTotal };
      },
    }),
    {
      name: "opus_cart", // localStorage key

      // 로그인 상태는 persist 하지 않음
      partialize: (state) => ({ items: state.items, checkedKeys: state.checkedKeys }),
    }
  )
);
