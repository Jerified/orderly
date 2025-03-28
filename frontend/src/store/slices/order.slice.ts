import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderStatus } from '@/types/order.type';

interface OrderState {
  orders: any[];
  selectedOrder: any | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  status: 'idle',
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<any[]>) => {
      state.orders = action.payload;
      state.status = 'succeeded';
    },
    setOrder: (state, action: PayloadAction<any>) => {
      state.selectedOrder = action.payload;
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: OrderStatus }>) => {
      const index = state.orders.findIndex(order => order._id === action.payload.orderId);
      if (index !== -1) {
        state.orders[index].status = action.payload.status;
      }
      if (state.selectedOrder?._id === action.payload.orderId) {
        state.selectedOrder.status = action.payload.status;
      }
    },
    setLoading: (state) => {
      state.status = 'loading';
    },
    setError: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    resetOrderState: () => initialState,
  },
});

export const { setOrders, setOrder, updateOrderStatus, setLoading, setError, resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;