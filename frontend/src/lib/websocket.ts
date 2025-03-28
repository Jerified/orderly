// import { io, Socket } from 'socket.io-client';
import { store } from '@/store/store';
import { addMessage, setConnectionStatus } from '@/store/slices/chat.slice';

let socket: WebSocket | null = null;

export const connectWebSocket = (token: string) => {
  if (socket) return socket;

  socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws?token=${token}`);

  socket.onopen = () => {
    store.dispatch(setConnectionStatus(true));
  };

  socket.onclose = () => {
    store.dispatch(setConnectionStatus(false));
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    store.dispatch(addMessage(message));
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return socket;
};

export const joinChatRoom = (orderId: string) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'join',
      orderId
    }));
  }
};

export const sendMessage = (orderId: string, content: string) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'message',
      orderId,
      content
    }));
  }
};

// Add these exports
export const leaveChatRoom = (orderId: string) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'leave', 
      orderId
    }));
  }
};

export const isConnected = () => {
  return socket?.readyState === WebSocket.OPEN;
};

export const disconnectWebSocket = () => {
  socket?.close();
  socket = null;
};