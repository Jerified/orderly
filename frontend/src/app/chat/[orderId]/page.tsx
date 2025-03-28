'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ChatWindow from '@/components/chat/ChatWindow';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { useWebSocket } from '@/hooks/useWebSocket';
import { joinChatRoom, leaveChatRoom } from '@/lib/websocket';
import api from '@/lib/api';

export default function ChatDetailPage() {
  const router = useRouter();
  const { orderId } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useWebSocket();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/orders/${orderId}`);
        setOrderDetails(response.data.data.order);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        router.push('/chat');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, router]);

  useEffect(() => {
    if (orderId) {
      joinChatRoom(orderId as string);
      return () => {
        leaveChatRoom(orderId as string);
      };
    }
  }, [orderId]);

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <h3 className="text-xl font-medium mb-4">Order Not Found</h3>
        <Button onClick={() => router.push('/chat')}>
          Back to Chat Support
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.push('/chat')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="font-medium">Order #{orderDetails._id.substring(0, 8)}</h2>
            <p className="text-sm text-muted-foreground">
              {orderDetails.description.substring(0, 50)}...
            </p>
          </div>
        </div>
        <OrderStatusBadge status={orderDetails.status} />
      </div>

      <ChatWindow orderId={orderId as string} />
    </div>
  );
}