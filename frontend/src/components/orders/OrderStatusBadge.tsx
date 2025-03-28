import { OrderStatus } from '@/types/order.type';
import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusVariants = {
    review: {
      label: 'In Review',
      variant: 'secondary' as const,
    },
    processing: {
      label: 'Processing',
      variant: 'default' as const,
    },
    completed: {
      label: 'Completed',
      variant: 'outline' as const,
    },
  };

  const { label, variant } = statusVariants[status] || {
    label: status,
    variant: 'outline',
  };

  return <Badge variant={variant}>{label}</Badge>;
}