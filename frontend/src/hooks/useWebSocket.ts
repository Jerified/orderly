import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { connectWebSocket, disconnectWebSocket } from '@/lib/websocket';

export const useWebSocket = () => {
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      connectWebSocket(token);
    }

    return () => {
      disconnectWebSocket();
    };
  }, [token]);
};