import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import orderReducer from './slices/order.slice';
import chatReducer from './slices/chat.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: orderReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;