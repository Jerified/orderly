import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ChatService from '../services/chat.service';
import { SUCCESS } from '../config/constants';
import { UserRole } from '@interfaces/user.interface';

class ChatController {
  async getChatRoom(req: Request & { user: { id: string, role: string } }, res: Response) {
    const chatRoom = await ChatService.getChatRoomByOrder(
      req.params.orderId,
      req.user.id,
      req.user.role as UserRole
    );
    
    res.status(StatusCodes.OK).json({
      status: SUCCESS,
      data: { chatRoom },
    });
  }
  async getMessages(req: Request & { user: { id: string, role: string } }, res: Response) {
    const messages = await ChatService.getMessages(
      req.params.orderId,
      req.user.id,
      req.user.role as UserRole
    );
    
    res.status(StatusCodes.OK).json({
      status: SUCCESS,
      data: { messages },
    });
  }

  async closeChatRoom(req: Request & { user: { id: string, role: string } }, res: Response) {
    const { summary } = req.body;
    const chatRoom = await ChatService.closeChatRoom(
      req.params.orderId,
      req.user.id,
      summary
    );
    
    res.status(StatusCodes.OK).json({
      status: SUCCESS,
      data: { chatRoom },
    });
  }
}

export default new ChatController();