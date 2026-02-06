import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      checkedKeys: [],

      // 서버에서 장바구니를 받아 한 번에 주입할 때(로그인/새로고침 후)
      setItems: (items) => set({ items: Array.isArray(items) ? items : [] }),

      setCheckedKeys: (keys) => set({ checkedKeys: Array.isArray(keys) ? keys : [] }),

      // 장바구니 담기(동일 옵션이면 qty 누적)
      addItem: (item) => {
        const items = get().items;
        const idx = items.findIndex((i) => i.cartKey === item.cartKey);

        // 신규 추가
        if (idx === -1) {
          set({ items: [...items, item] });
          return;
        }

        // 기존 옵션이면 qty 누적
        const prev = items[idx];
        const stock = prev.stock ?? item.stock; // 둘 중 있는 값으로 재고 판단
        const nextQty = prev.qty + item.qty;

        if (stock != null && nextQty > stock) {
          alert("선택 가능한 재고 수량을 초과했습니다.");
          return;
        }

        const nextItems = [...items];
        nextItems[idx] = { ...prev, qty: nextQty, stock };
        set({ items: nextItems });
      },

      // 수량 변경
      setQty: (cartKey, qty) => {
        const items = get().items;
        const idx = items.findIndex((i) => i.cartKey === cartKey);
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

        const nextItems = [...items];
        nextItems[idx] = { ...target, qty };
        set({ items: nextItems });
      },

      // 삭제
      removeItems: (cartKeys) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !cartKeys.includes(item.cartKey)
          ),
        })),

      // 비우기
      clear: () => set({ items: [] }),

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
    { name: "opus_cart" } // localStorage key
  )
);
