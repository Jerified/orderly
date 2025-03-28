'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Package, PackageCheck, PackagePlus, MessageSquare } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { setOrders } from '@/store/slices/order.slice';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { orders, status } = useSelector((state: RootState) => state.orders);
  const [stats, setStats] = useState({
    totalOrders: 0,
    inReview: 0,
    inProcessing: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        dispatch(setOrders(response.data.data.orders));
        
        // Calculate stats
        const orders = response.data.data.orders;
        setStats({
          totalOrders: orders.length,
          inReview: orders.filter((o: any) => o.status === 'review').length,
          inProcessing: orders.filter((o: any) => o.status === 'processing').length,
          completed: orders.filter((o: any) => o.status === 'completed').length,
        });
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {user?.role === 'user' && (
          <Button onClick={() => router.push('/orders/new')}>
            <PackagePlus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inReview}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Processing</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProcessing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {user?.role === 'user' && (
          <Card className="cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => router.push('/orders/new')}>
            <CardContent className="p-6 flex items-center">
              <PackagePlus className="h-6 w-6 mr-4" />
              <div>
                <h3 className="font-medium">Create New Order</h3>
                <p className="text-sm text-muted-foreground">Submit a new order request</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className="cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => router.push('/orders')}>
          <CardContent className="p-6 flex items-center">
            <Package className="h-6 w-6 mr-4" />
            <div>
              <h3 className="font-medium">View My Orders</h3>
              <p className="text-sm text-muted-foreground">See all your order history</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => router.push('/chat')}>
          <CardContent className="p-6 flex items-center">
            <MessageSquare className="h-6 w-6 mr-4" />
            <div>
              <h3 className="font-medium">Chat Support</h3>
              <p className="text-sm text-muted-foreground">Message with support team</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders (for admins) */}
      {user?.role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div 
                    key={order._id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 cursor-pointer"
                    onClick={() => router.push(`/admin/orders/${order._id}`)}
                  >
                    <div>
                      <h4 className="font-medium">{order.description}</h4>
                      <p className="text-sm text-muted-foreground">
                        {order.quantity} items • {order.status}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {orders.length > 5 && (
                  <Button 
                    variant="ghost" 
                    className="w-full" 
                    onClick={() => router.push('/admin/orders')}
                  >
                    View All Orders
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent orders found
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}