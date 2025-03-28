import { model, Schema } from 'mongoose';
import { IChatRoom, IChatRoomDocument, IMessage, IMessageDocument, UserRole } from '../interfaces/chat.interface';

const messageSchema = new Schema<IMessageDocument>(
  {
    chatRoom: { type: String, ref: 'ChatRoom', required: true },
    sender: { type: String, required: true },
    senderRole: { type: String, enum: Object.values(UserRole), required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const chatRoomSchema = new Schema<IChatRoomDocument>(
  {
    order: { type: String, ref: 'Order', required: true, unique: true },
    isClosed: { type: Boolean, default: false },
    closedBy: { type: String, ref: 'User' },
    summary: { type: String },
  },  { timestamps: true }
);

export const Message = model<IMessageDocument>('Message', messageSchema);
export const ChatRoom = model<IChatRoomDocument>('ChatRoom', chatRoomSchema);