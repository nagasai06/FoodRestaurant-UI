import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, User, UtensilsCrossed, MapPin, Clock, Loader2 } from "lucide-react";

interface FormData {
  userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  foodDetails: {
    category: string;
    items: string[];
    specialRequests: string;
    totalPrice: number;
  };
  deliveryDetails: {
    address: string;
    city: string;
    zipCode: string;
    deliveryInstructions: string;
    priority: "standard" | "express" | "rush";
    deliveryTime: string;
  };
}

interface ReviewFormProps {
  data: FormData;
  onBack: () => void;
  onSubmit: (data: FormData & { orderSummary: any; timestamp: string }) => Promise<void>;
}

const priorityLabels = {
  standard: { name: "Standard Delivery", price: 0, time: "45-60 min" },
  express: { name: "Express Delivery", price: 3.99, time: "25-35 min" },
  rush: { name: "Rush Delivery", price: 7.99, time: "15-25 min" }
};

export const ReviewForm = ({ data, onBack, onSubmit }: ReviewFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const deliveryPrice = priorityLabels[data.deliveryDetails.priority].price;
  const subtotal = data.foodDetails.totalPrice;
  const tax = subtotal * 0.08;
  const totalAmount = subtotal + deliveryPrice + tax;

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const orderData = {
      ...data,
      orderSummary: {
        subtotal,
        deliveryPrice,
        tax,
        total: totalAmount
      },
      timestamp: new Date().toISOString()
    };

    try {
      await onSubmit(orderData); // Real API submission handled in OrderForm
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description:
          error?.response?.data?.message ||
          "There was an error placing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-card animate-fade-in">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold">Review Your Order</CardTitle>
        <p className="text-muted-foreground">Please review all details before placing your order</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Customer Information</h3>
          </div>
          <div className="bg-orange-light p-4 rounded-lg">
            <p className="font-medium">
              {data.userDetails.firstName} {data.userDetails.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{data.userDetails.email}</p>
            <p className="text-sm text-muted-foreground">{data.userDetails.phone}</p>
          </div>
        </div>

        <Separator />

        {/* Food Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Your Order</h3>
          </div>
          <div className="bg-orange-light p-4 rounded-lg">
            <div className="flex flex-wrap gap-2 mb-3">
              {data.foodDetails.items.map((item) => (
                <Badge key={item} variant="default">{item}</Badge>
              ))}
            </div>
            {data.foodDetails.specialRequests && (
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Special Requests:</strong> {data.foodDetails.specialRequests}
              </p>
            )}
            <p className="font-medium">Items: ${subtotal.toFixed(2)}</p>
          </div>
        </div>

        <Separator />

        {/* Delivery Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Delivery Information</h3>
          </div>
          <div className="bg-orange-light p-4 rounded-lg">
            <p className="font-medium">{data.deliveryDetails.address}</p>
            <p className="text-sm text-muted-foreground">
              {data.deliveryDetails.city}, {data.deliveryDetails.zipCode}
            </p>
            {data.deliveryDetails.deliveryInstructions && (
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Instructions:</strong> {data.deliveryDetails.deliveryInstructions}
              </p>
            )}
            <div className="flex items-center gap-2 mt-3">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                {priorityLabels[data.deliveryDetails.priority].name} - {data.deliveryDetails.deliveryTime}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Order Summary */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <div className="bg-orange-light p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery ({priorityLabels[data.deliveryDetails.priority].name})</span>
                <span>${deliveryPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            size="lg"
            className="flex-1"
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            variant="success"
            size="lg"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Placing Order...
              </>
            ) : (
              "Place Order"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
