
import { useState, useEffect } from "react";
import { OrderCard } from "@/components/kitchen/OrderCard";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  estimatedTime: number; // in minutes
  status: 'pending' | 'preparing' | 'completed';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

const KitchenScreen = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD001",
      customerName: "John Doe",
      items: [
        { id: "1", name: "Margherita Pizza", quantity: 2 },
        { id: "2", name: "Caesar Salad", quantity: 1, specialInstructions: "No croutons" }
      ],
      estimatedTime: 15,
      status: 'pending',
      createdAt: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
    },
    {
      id: "ORD002", 
      customerName: "Jane Smith",
      items: [
        { id: "3", name: "Chicken Burger", quantity: 1 },
        { id: "4", name: "French Fries", quantity: 1 }
      ],
      estimatedTime: 12,
      status: 'preparing',
      createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      startedAt: new Date(Date.now() - 8 * 60 * 1000) // started 8 minutes ago
    },
    {
      id: "ORD003",
      customerName: "Mike Johnson", 
      items: [
        { id: "5", name: "Pasta Carbonara", quantity: 1 },
        { id: "6", name: "Garlic Bread", quantity: 2 }
      ],
      estimatedTime: 18,
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
    }
  ]);

  const handleOrderStart = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'preparing', startedAt: new Date() }
        : order
    ));
  };

  const handleOrderComplete = async (orderId: string, totalTime: number) => {
    // Here you would make API call to backend to update order status and time
    console.log(`Order ${orderId} completed in ${totalTime} minutes`);
    
    setOrders(prev => prev.filter(order => order.id !== orderId));
    
    // TODO: Send completion data to backend
    // await axios.post('/api/orders/complete', { orderId, totalTime });
  };

  const handleOrderCancel = (orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
    
    // TODO: Send cancellation to backend
    // await axios.post('/api/orders/cancel', { orderId });
  };

  // Sort orders: preparing first, then pending by creation time
  const sortedOrders = [...orders].sort((a, b) => {
    if (a.status === 'preparing' && b.status === 'pending') return -1;
    if (a.status === 'pending' && b.status === 'preparing') return 1;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  const currentOrder = sortedOrders.find(order => order.status === 'preparing');
  const waitingOrders = sortedOrders.filter(order => order.status === 'pending');

  return (
    <div className="min-h-screen bg-gradient-background p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-card p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Kitchen Display</h1>
        
        {currentOrder && (
          <div className="bg-orange-light p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-orange-dark mb-2">
              Currently Preparing: {currentOrder.customerName}
            </h2>
            <p className="text-orange-primary">
              Estimated time: {currentOrder.estimatedTime} minutes
            </p>
          </div>
        )}
      </div>

      {/* Order Cards */}
      <div className="space-y-4">
        {sortedOrders.map((order, index) => (
          <OrderCard
            key={order.id}
            order={order}
            isActive={order.status === 'preparing'}
            onStart={() => handleOrderStart(order.id)}
            onComplete={(totalTime) => handleOrderComplete(order.id, totalTime)}
            onCancel={() => handleOrderCancel(order.id)}
          />
        ))}
        
        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">No orders in queue</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenScreen;
