// OrderCard.tsx
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat, X } from "lucide-react";
import { Order } from "@/pages/KitchenScreen";

interface Props {
  order: Order;
  isActive: boolean;
  onStart: () => void;
  onComplete: (totalTime: number) => void;
  onCancel: () => void;
}

export const OrderCard = ({ order, isActive, onStart, onComplete, onCancel }: Props) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isActive || !order.startedAt) return;
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - order.startedAt!.getTime()) / 60000);
      setElapsedTime(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, order.startedAt]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isActive) return;
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isActive) return;
    const deltaY = e.touches[0].clientY - startY;
    if (deltaY > 0) setCurrentY(deltaY);
  };

  const handleTouchEnd = () => {
    if (isActive && currentY > 100) {
      onComplete(elapsedTime);
    }
    setIsDragging(false);
    setCurrentY(0);
  };

  const isOvertime = isActive && elapsedTime > order.estimatedTime;
  const timerColor = isOvertime ? "text-red-600" : "text-green-600";

  return (
    <Card
      className={`transition-all duration-300 bg-white shadow-md ${isActive ? "ring-2 ring-orange-400" : ""}`}
      style={{ transform: `translateY(${currentY}px)` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl font-semibold">
          {order.customerName || "Unknown Customer"}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge>{(order.status ?? "pending").toUpperCase()}</Badge>
          <Badge variant="outline" className={timerColor}>
            <Clock className="h-4 w-4 mr-1" />
            {isActive ? `${elapsedTime}/${order.estimatedTime} min` : `${order.estimatedTime} min`}
          </Badge>
          <button onClick={(e) => { e.stopPropagation(); onCancel(); }}>
            <X className="h-5 w-5 text-red-500 hover:text-red-700" />
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          {order.items.map((item: any, index: number) => (
            <div key={index} className="p-3 bg-orange-50 rounded-md flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ChefHat className="h-4 w-4 text-orange-400" />
                <span>{item.name}</span>
              </div>
              <Badge variant="outline">x{item.quantity || 1}</Badge>
            </div>
          ))}
        </div>

        {isActive && (
          <div className="mt-4 p-2 text-center text-orange-600 border-dashed border-2 border-orange-400 rounded-md">
            👇 Swipe down when order is ready
          </div>
        )}

        {order.status === "pending" && (
          <div
            onClick={onStart}
            className="mt-4 p-2 text-center text-green-600 border-dashed border-2 border-green-400 rounded-md cursor-pointer"
          >
            👆 Tap to start preparing
          </div>
        )}
      </CardContent>
    </Card>
  );
};
