import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
  activeRoom: string | null;
  messages: any[];
  isConnected: boolean;
}

const initialState: ChatState = {
  activeRoom: null,
  messages: [],
  isConnected: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveRoom: (state, action: PayloadAction<string>) => {
      state.activeRoom = action.payload;
    },
    addMessage: (state, action: PayloadAction<any>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<any[]>) => {
      state.messages = action.payload;
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    clearChatState: () => initialState,
  },
});

export const { setActiveRoom, addMessage, setMessages, setConnectionStatus, clearChatState } = chatSlice.actions;
export default chatSlice.reducer;