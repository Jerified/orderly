import { model, Schema } from 'mongoose';
import { IOrder, IOrderDocument } from '../interfaces/order.interface';
import { ORDER_STATUS } from '../config/constants';

const orderSchema = new Schema<IOrderDocument>(
  {
    user: { type: Schema.Types.String, ref: 'User', required: true },
    description: { type: String, required: true },
    specifications: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.REVIEW,
    },
  },
  { timestamps: true }
);

export default model<IOrderDocument>('Order', orderSchema);