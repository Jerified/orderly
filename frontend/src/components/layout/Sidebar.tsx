'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { UserRole } from '@/types/user.type';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  ShoppingCart,
  MessageSquare,
  Users,
  Settings,
  Package,
  PackagePlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const navItems = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    roles: ['user', 'admin'],
  },
  {
    href: '/orders',
    icon: ShoppingCart,
    label: 'My Orders',
    roles: ['user'],
  },
  {
    href: '/orders/new',
    icon: PackagePlus,
    label: 'New Order',
    roles: ['user'],
  },
  {
    href: '/admin/orders',
    icon: Package,
    label: 'All Orders',
    roles: ['admin'],
  },
  {
    href: '/admin/users',
    icon: Users,
    label: 'Users',
    roles: ['admin'],
  },
  {
    href: '/chat',
    icon: MessageSquare,
    label: 'Chat',
    roles: ['user', 'admin'],
  },
  {
    href: '/settings',
    icon: Settings,
    label: 'Settings',
    roles: ['user', 'admin'],
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return null;

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user.role as UserRole)
  );

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-800">Order Management</h2>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {filteredNavItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                'w-full justify-start',
                pathname === item.href
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-gray-100'
              )}
              onClick={() => router.push(item.href)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="" alt={user.name} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">
              {user.role === 'admin' ? 'Administrator' : 'User'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}