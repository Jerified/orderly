import { Document } from 'mongoose';
import { UserRole } from './user.interface';

export interface IChatRoom {
  order: string;
  isClosed: boolean;
  closedBy?: string;
  summary?: string;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  chatRoom: string;
  sender: string;
  senderRole: UserRole;
  content: string;
  createdAt: Date;
}

export interface IChatRoomDocument extends IChatRoom, Document {}
export interface IMessageDocument extends IMessage, Document {}

export { UserRole };
