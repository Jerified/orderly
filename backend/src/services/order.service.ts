import Order from '../models/order.model';
import { ChatRoom, Message } from '../models/chat.model';
import { IOrder, OrderStatus } from '../interfaces/order.interface';
import { ORDER_STATUS } from '../config/constants';

class OrderService {
  async createOrder(userId: string, orderData: Omit<IOrder, 'user' | 'status'>) {
    const order = await Order.create({ ...orderData, user: userId });
    
    // Create a chat room for this order
    await ChatRoom.create({ order: order._id });
    
    return order;
  }

  async getUserOrders(userId: string) {
    return await Order.find({ user: userId }).sort({ createdAt: -1 });
  }

  async getOrderById(orderId: string, userId?: string) {
    const query: any = { _id: orderId };
    if (userId) {
      query.user = userId;
    }
    return await Order.findOne(query);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus, adminId: string) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
  
    // Status transition validation
    if (status === ORDER_STATUS.PROCESSING && order.status !== ORDER_STATUS.REVIEW) {
      throw new Error('Order must be in review status before processing');
    }
  
    if (status === ORDER_STATUS.COMPLETED && order.status !== ORDER_STATUS.PROCESSING) {
      throw new Error('Order must be in processing status before completion');
    }
  
    order.status = status;
    await order.save();
    return order;
  }

  async getAllOrders() {
    return await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
  }
}

export default new OrderService();