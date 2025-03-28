import { Order } from "./order.type";
import { User, UserRole } from "./user.type";

export interface ChatRoom {
    _id: string;
    order: string | Order;
    isClosed: boolean;
    closedBy?: string | User;
    summary?: string;
    closedAt?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Message {
    _id: string;
    chatRoom: string | ChatRoom;
    sender: string | User;
    senderRole: UserRole;
    content: string;
    createdAt: string;
  }
  
  export interface CloseChatFormData {
    summary: string;
  }