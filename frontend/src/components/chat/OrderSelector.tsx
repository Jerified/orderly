'use client';

import { Order } from '@/types/order.type';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
// import { cn } from '@/lib/utils';

interface OrderSelectorProps {
  orders: Order[];
  selectedOrderId: string | null;
  onSelect: (orderId: string) => void;
  onClose: () => void;
}

export default function OrderSelector({
  orders,
  selectedOrderId,
  onSelect,
  onClose,
}: OrderSelectorProps) {
  return (
    <Popover open onOpenChange={(open) => !open && onClose()}>
      <PopoverTrigger asChild>
        <div className="absolute inset-0 opacity-0" />
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]" align="end">
        <Command>
          <CommandInput placeholder="Search orders..." />
          <CommandEmpty>No orders found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {orders.map((order) => (
              <CommandItem
                key={order._id}
                value={order._id}
                onSelect={() => {
                  onSelect(order._id);
                  onClose();
                }}
                className="flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="font-medium">
                    Order #{order._id.substring(0, 6)}...
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {order.description.substring(0, 30)}...
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{order.status}</Badge>
                  {selectedOrderId === order._id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}