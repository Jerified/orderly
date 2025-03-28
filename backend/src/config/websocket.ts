import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './constants';
import ChatService from '../services/chat.service';
import { UserRole } from '../interfaces/user.interface';

interface CustomWebSocket extends WebSocket {
  userId?: string;
  role?: UserRole;
  orderId?: string;
}

export const initializeWebSocket = (server: http.Server) => {
  const wss = new WebSocketServer({ 
    server,
    path: '/ws' 
  });

  console.log('WebSocket server initialized');

  wss.on('connection', (ws: CustomWebSocket, req) => {
    // Authentication
    const token = new URL(req.url || '', `ws://${req.headers.host}`).searchParams.get('token');
    
    if (!token) {
      ws.close(1008, 'Unauthorized');
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: UserRole };
      ws.userId = decoded.id;
      ws.role = decoded.role;
      console.log(`New connection from user ${ws.userId}`);
    } catch (error) {
      ws.close(1008, 'Unauthorized');
      return;
    }

    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        if (data.type === 'join') {
          ws.orderId = data.orderId;
          ws.send(JSON.stringify({ 
            type: 'system', 
            message: `Joined order room ${data.orderId}` 
          }));
          return;
        }

        if (data.type === 'message') {
          const { orderId, content } = data;

          if (!orderId || !content) {
            throw new Error('Invalid message format');
          }

          const newMessage = await ChatService.addMessage(
            orderId,
            ws.userId!,
            content,
            ws.role!
          );

          wss.clients.forEach((client) => {
            const customClient = client as CustomWebSocket;
            if (customClient !== ws && 
                customClient.readyState === WebSocket.OPEN &&
                customClient.orderId === orderId) {
              customClient.send(JSON.stringify({
                type: 'message',
                ...newMessage
              }));
            }
          });
          return;
        }

        ws.send(JSON.stringify({ error: 'Unknown message type' }));
      } catch (error) {
        console.error('Error handling message:', error);
        ws.send(JSON.stringify({ error: 'Failed to process message' }));
      }
    });

    ws.on('close', () => {
      console.log(`User ${ws.userId} disconnected`);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return wss;
};