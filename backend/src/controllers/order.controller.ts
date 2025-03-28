import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import OrderService from '../services/order.service';
import { SUCCESS } from '../config/constants';

class OrderController {
  async createOrder(req: Request & { user: { id: string, role: string } }, res: Response) {
    const { description, specifications, quantity } = req.body;
    const order = await OrderService.createOrder(req.user.id, {
      description,
      specifications,
      quantity,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    res.status(StatusCodes.CREATED).json({
      status: SUCCESS,
      data: { order },
    });
  }
  async getMyOrders(req: Request & { user: { id: string, role: string } }, res: Response) {
    const orders = await OrderService.getUserOrders(req.user.id);
    
    res.status(StatusCodes.OK).json({
      status: SUCCESS,
      data: { orders },
    });
  }

  async getOrderDetails(req: Request & { user: { id: string, role: string } }, res: Response) {
    const order = await OrderService.getOrderById(req.params.id, req.user.id);
    
    res.status(StatusCodes.OK).json({
      status: SUCCESS,
      data: { order },
    });
  }

  async getAllOrders(req: Request, res: Response) {
    const orders = await OrderService.getAllOrders();
    
    res.status(StatusCodes.OK).json({
      status: SUCCESS,
      data: { orders },
    });
  }

  async updateOrderStatus(req: Request & { user: { id: string, role: string } }, res: Response) {
    const { status } = req.body;
    const order = await OrderService.updateOrderStatus(
      req.params.id,
      status,
      req.user.id
    );
    
    res.status(StatusCodes.OK).json({
      status: SUCCESS,
      data: { order },
    });
  }
}

export default new OrderController();