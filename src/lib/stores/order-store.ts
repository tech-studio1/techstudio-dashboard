import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Outlet, OrderItem, CustomerInfo, PaymentInfo, Product } from '@/lib/types/order';

interface OrderStore {
  // Current order being created
  currentOrder: {
    outlet: Outlet | null;
    items: OrderItem[];
    customer: CustomerInfo | null;
    paymentMethod: string;
    paymentInfo: PaymentInfo;
    notes: string;
  };

  // Actions
  setOutlet: (outlet: Outlet) => void;
  addItem: (product: Product, quantity: number, variant?: any) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setCustomer: (customer: CustomerInfo | null) => void;
  setPaymentMethod: (method: string) => void;
  setPaymentInfo: (info: PaymentInfo) => void;
  setNotes: (notes: string) => void;
  clearOrder: () => void;

  // Calculated values
  getSubtotal: () => number;
  getTax: () => number;
  getDiscount: () => number;
  getTotal: () => number;
}

const initialState = {
  outlet: null,
  items: [],
  customer: null,
  paymentMethod: 'CASH',
  paymentInfo: {},
  notes: '',
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      currentOrder: initialState,

      setOutlet: (outlet) =>
        set((state) => ({
          currentOrder: { ...state.currentOrder, outlet },
        })),

      addItem: (product, quantity, variant) => {
        set((state) => {
          const existingItemIndex = state.currentOrder.items.findIndex(
            (item) => item.id === product.id
          );

          if (existingItemIndex > -1) {
            // Update quantity of existing item
            const updatedItems = [...state.currentOrder.items];
            updatedItems[existingItemIndex].quantity += quantity;
            return {
              currentOrder: { ...state.currentOrder, items: updatedItems },
            };
          }

          // Add new item
          const newItem: OrderItem = {
            id: product.id,
            title: product.title,
            image: product.images?.[0],
            quantity,
            costPerItem: {
              price: variant?.price || product.price,
              compareAtPrice: variant?.compare_at_price || product.compare_at_price || 0,
              costPerItem: variant?.cost_per_item || product.cost_per_item || 0,
            },
            variantInfo: variant ? {
              sku: variant.sku,
              color_name: variant.color_name,
              color_code: variant.color_code,
              price: variant.price,
              compareAtPrice: variant.compare_at_price,
              costPerItem: variant.cost_per_item,
              quantity: variant.inventory_quantity,
            } : undefined,
          };

          return {
            currentOrder: {
              ...state.currentOrder,
              items: [...state.currentOrder.items, newItem],
            },
          };
        });
      },

      removeItem: (productId) =>
        set((state) => ({
          currentOrder: {
            ...state.currentOrder,
            items: state.currentOrder.items.filter((item) => item.id !== productId),
          },
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              currentOrder: {
                ...state.currentOrder,
                items: state.currentOrder.items.filter((item) => item.id !== productId),
              },
            };
          }

          return {
            currentOrder: {
              ...state.currentOrder,
              items: state.currentOrder.items.map((item) =>
                item.id === productId ? { ...item, quantity } : item
              ),
            },
          };
        }),

      setCustomer: (customer) =>
        set((state) => ({
          currentOrder: { ...state.currentOrder, customer },
        })),

      setPaymentMethod: (method) =>
        set((state) => ({
          currentOrder: { ...state.currentOrder, paymentMethod: method, paymentInfo: {} },
        })),

      setPaymentInfo: (info) =>
        set((state) => ({
          currentOrder: { ...state.currentOrder, paymentInfo: info },
        })),

      setNotes: (notes) =>
        set((state) => ({
          currentOrder: { ...state.currentOrder, notes },
        })),

      clearOrder: () =>
        set(() => ({
          currentOrder: initialState,
        })),

      getSubtotal: () => {
        const { items } = get().currentOrder;
        return items.reduce((total, item) => total + (item.costPerItem.price * item.quantity), 0);
      },

      getTax: () => {
        // Tax calculation logic can be added here
        return 0;
      },

      getDiscount: () => {
        // Discount calculation logic can be added here
        return 0;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const tax = get().getTax();
        const discount = get().getDiscount();
        return subtotal + tax - discount;
      },
    }),
    {
      name: 'order-storage',
      partialize: (state) => ({ currentOrder: state.currentOrder }),
    }
  )
);