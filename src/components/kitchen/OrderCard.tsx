
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat, X } from "lucide-react";
import { Order } from "@/pages/KitchenScreen";

interface OrderCardProps {
  order: Order;
  isActive: boolean;
  onStart: () => void;
  onComplete: (totalTime: number) => void;
  onCancel: () => void;
}

export const OrderCard = ({ order, isActive, onStart, onComplete, onCancel }: OrderCardProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isActive || !order.startedAt) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - order.startedAt!.getTime()) / 1000 / 60);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, order.startedAt]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isActive) return;
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isActive) return;
    const deltaY = e.touches[0].clientY - startY;
    if (deltaY > 0) { // Only allow downward swipe
      setCurrentY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || !isActive) return;
    
    if (currentY > 100) { // Swipe threshold
      const totalTime = elapsedTime;
      onComplete(totalTime);
    }
    
    setIsDragging(false);
    setCurrentY(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive) return;
    setStartY(e.clientY);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isActive) return;
    const deltaY = e.clientY - startY;
    if (deltaY > 0) {
      setCurrentY(deltaY);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || !isActive) return;
    
    if (currentY > 100) {
      const totalTime = elapsedTime;
      onComplete(totalTime);
    }
    
    setIsDragging(false);
    setCurrentY(0);
  };

  const handleClick = () => {
    if (order.status === 'pending') {
      onStart();
    }
  };

  const isOvertime = isActive && elapsedTime > order.estimatedTime;
  const timeColor = isOvertime ? "text-red-spicy" : "text-green-fresh";

  return (
    <Card 
      className={`
        transition-all duration-300 cursor-pointer select-none
        ${isActive ? 'ring-2 ring-orange-primary shadow-lg bg-orange-light' : 'hover:shadow-md'}
        ${isDragging ? 'opacity-80' : ''}
      `}
      style={{ transform: `translateY(${currentY}px)` }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {order.customerName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
              className="p-1 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <Badge variant={isActive ? "default" : "secondary"}>
              {order.status.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className={timeColor}>
                {isActive ? `${elapsedTime}/${order.estimatedTime}min` : `${order.estimatedTime}min`}
              </span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex flex-col space-y-2 p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ChefHat className="h-4 w-4 text-orange-primary" />
                  <p className="font-medium">{item.name}</p>
                </div>
                <Badge variant="outline">
                  x{item.quantity}
                </Badge>
              </div>
              {item.specialInstructions && (
                <p className="text-sm text-gray-600 italic pl-7">
                  {item.specialInstructions}
                </p>
              )}
            </div>
          ))}
        </div>
        
        {isActive && (
          <div className="mt-4 p-3 bg-white rounded-lg border-2 border-dashed border-orange-primary">
            <p className="text-center text-orange-dark font-medium">
              👆 Swipe down when order is ready
            </p>
          </div>
        )}
        
        {order.status === 'pending' && (
          <div className="mt-4 p-3 bg-green-fresh/10 rounded-lg border-2 border-dashed border-green-fresh">
            <p className="text-center text-green-fresh font-medium">
              👆 Tap to start preparing
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
