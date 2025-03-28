import { ChatRoom, Message } from '../models/chat.model';
import Order from '../models/order.model';
import { UserRole } from '../interfaces/user.interface';

class ChatService {
  async getChatRoomByOrder(orderId: string, userId?: string, role?: UserRole) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Regular users can only access their own order's chat room
    if (role === UserRole.USER && order.user.toString() !== userId) {
      throw new Error('Unauthorized to access this chat room');
    }

    return await ChatRoom.findOne({ order: orderId });
  }

  async addMessage(orderId: string, senderId: string, content: string, senderRole: UserRole) {
    const chatRoom = await ChatRoom.findOne({ order: orderId });
    if (!chatRoom) {
      throw new Error('Chat room not found');
    }

    if (chatRoom.isClosed) {
      throw new Error('This chat room is closed');
    }

    const message = await Message.create({
      chatRoom: chatRoom._id,
      sender: senderId,
      senderRole,
      content,
    });

    return message;
  }

  async getMessages(orderId: string, userId?: string, role?: UserRole) {
    const chatRoom = await this.getChatRoomByOrder(orderId, userId, role);
    if (!chatRoom) {
      throw new Error('Chat room not found');
    }

    return await Message.find({ chatRoom: chatRoom._id }).sort({ createdAt: 1 });
  }

  async closeChatRoom(orderId: string, adminId: string, summary: string) {
    const chatRoom = await ChatRoom.findOne({ order: orderId });
    if (!chatRoom) {
      throw new Error('Chat room not found');
    }

    if (chatRoom.isClosed) {
      throw new Error('Chat room is already closed');
    }

    chatRoom.isClosed = true;
    chatRoom.closedBy = adminId;
    chatRoom.summary = summary;
    await chatRoom.save();

    // Update the order status to processing
    const order = await Order.findById(orderId);
    if (order && order.status === 'review') {
      order.status = 'processing';
      await order.save();
    }

    return chatRoom;
  }
}

export default new ChatService();