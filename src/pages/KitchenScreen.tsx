// KitchenScreen.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { OrderCard } from "@/components/kitchen/OrderCard";

export interface OrderItem {
  name: string;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: String;
  customerName: string;
  items: OrderItem[] | string[];
  category: string;
  status: 'pending' | 'preparing' | 'completed' | null;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  estimatedTime: number;
}

const BASE_URL="https://springboot-backend-134213214273.us-central1.run.app";

const KitchenScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await axios.get(`${BASE_URL}/api/ordersall`);
      
      const fetched: Order[] = res.data.map((o: any) => ({
        ...o,
        status: o.status ?? "pending",
        createdAt: new Date(o.createdAt),
        startedAt: o.startedAt ? new Date(o.startedAt) : undefined,
        completedAt: o.completedAt ? new Date(o.completedAt) : undefined,
        items: o.items.map((item: any) => typeof item === 'string' ? { name: item, quantity: 1 } : item),
        estimatedTime: 15,
      }));
      setOrders(fetched);
    };
    fetchOrders();
  }, []);

  const handleStart = async (id: String) => {
    setOrders(prev => prev.map(order =>
      order.id === id ? { ...order, status: "preparing", startedAt: new Date() } : order
    ));
    await axios.post(`${BASE_URL}/api/orders/${id}/start`);
  };

  const handleComplete = async (id: String, timeTaken: number) => {
    setOrders(prev => {
      const updated = prev.filter(o => o.id !== id);
      if (updated.length > 0) {
        const next = updated.find(o => o.status === 'pending');
        if (next) {
          next.status = 'preparing';
          next.startedAt = new Date();
        }
      }
      return updated;
    });
    await axios.post(`${BASE_URL}/api/orders/${id}/complete`, { totalTime: timeTaken });
  };

  const handleCancel = async (id: String) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    await axios.delete(`${BASE_URL}/api/orders/${id}/cancel`);
  };

  const sorted = [...orders].sort((a, b) => {
    if (a.status === 'preparing') return -1;
    if (b.status === 'preparing') return 1;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  return (
    <div className="p-6 bg-orange-50 min-h-screen space-y-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Kitchen Display</h1>
      {sorted.map(order => (
        <OrderCard
          key={String(order.id)}
          order={order}
          isActive={order.status === 'preparing'}
          onStart={() => handleStart(order.id)}
          onComplete={(time) => handleComplete(order.id, time)}
          onCancel={() => handleCancel(order.id)}
        />
      ))}
      {orders.length === 0 && <p className="text-center text-gray-500">No orders available.</p>}
    </div>
  );
};

export default KitchenScreen;
