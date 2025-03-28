'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import ChatWindow from '@/components/chat/ChatWindow';
import OrderSelector from '@/components/chat/OrderSelector';
import { useWebSocket } from '@/hooks/useWebSocket';
import { joinChatRoom, leaveChatRoom } from '@/lib/websocket';

export default function ChatSupportPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const { orders } = useSelector((state: RootState) => state.orders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showOrderSelector, setShowOrderSelector] = useState(false);

  useWebSocket();

  useEffect(() => {
    if (params?.orderId) {
      setSelectedOrderId(params.orderId as string);
    } else if (orders.length > 0) {
      const firstOrderWithChat = orders.find(order => 
        order.status !== 'completed'
      );
      setSelectedOrderId(firstOrderWithChat?._id || null);
    }
  }, [params, orders]);

  useEffect(() => {
    if (selectedOrderId) {
      joinChatRoom(selectedOrderId);
      return () => {
        leaveChatRoom(selectedOrderId);
      };
    }
  }, [selectedOrderId]);

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowOrderSelector(false);
    router.push(`/chat/${orderId}`);
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/orders')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>
        
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowOrderSelector(!showOrderSelector)}
            className="flex items-center gap-2"
          >
            {selectedOrderId 
              ? `Order #${selectedOrderId.substring(0, 6)}...` 
              : 'Select Order'}
            <ChevronDown className={`h-4 w-4 transition-transform ${
              showOrderSelector ? 'rotate-180' : ''
            }`} />
          </Button>
          
          {showOrderSelector && (
            <OrderSelector
              orders={orders}
              selectedOrderId={selectedOrderId}
              onSelect={handleOrderSelect}
              onClose={() => setShowOrderSelector(false)}
            />
          )}
        </div>
      </div>

      {selectedOrderId ? (
        <ChatWindow orderId={selectedOrderId} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-md">
            <h3 className="text-xl font-medium">No Active Orders</h3>
            <p className="text-muted-foreground">
              You don't have any active orders to chat about. Please create an order first.
            </p>
            <Button onClick={() => router.push('/orders/new')}>
              Create New Order
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}