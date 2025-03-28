import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { StatusCodes } from 'http-status-codes';
import { NOT_FOUND } from './config/constants';
import authRoutes from './routes/auth.routes';
import orderRoutes from './routes/order.routes';
import chatRoutes from './routes/chat.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler } from './middlewares/error.middleware';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config/constants'; // Replace with your own secret
import ChatService from './services/chat.service';

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  path: '/socket.io', // This matches your frontend connection
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Socket.io Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    socket.data.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket.io Connection Handler
io.on('connection', (socket) => {
  console.log(`User ${socket.data.user.id} connected`);

  // Join order room
  socket.on('join', (orderId) => {
    socket.join(`order_${orderId}`);
    console.log(`User ${socket.data.user.id} joined order ${orderId}`);
  });

  // Handle chat messages
  socket.on('message', async ({ orderId, content }) => {
    try {
      const newMessage = await ChatService.addMessage(
        orderId,
        socket.data.user.id,
        content,
        socket.data.user.role
      );

      // Broadcast to everyone in the order room except sender
      socket.to(`order_${orderId}`).emit('message', newMessage);
      // Also send back to sender
      socket.emit('message', newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.data.user.id} disconnected`);
  });
});

// Regular Express middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: NOT_FOUND,
    message: 'Route not found',
  });
});

// Error handler
app.use(errorHandler);

export { app, server, io };