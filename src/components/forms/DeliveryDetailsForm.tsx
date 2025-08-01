import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Clock, Truck } from "lucide-react";

interface DeliveryDetails {
  address: string;
  city: string;
  zipCode: string;
  deliveryInstructions: string;
  priority: "standard" | "express" | "rush";
  deliveryTime: string;
}

interface DeliveryDetailsFormProps {
  data: DeliveryDetails;
  onNext: (data: DeliveryDetails) => void;
  onBack: () => void;
}

const priorityOptions = [
  { 
    id: "standard", 
    name: "Standard Delivery", 
    time: "45-60 minutes", 
    price: "Free",
    description: "Regular delivery time"
  },
  { 
    id: "express", 
    name: "Express Delivery", 
    time: "25-35 minutes", 
    price: "+$3.99",
    description: "Faster delivery"
  },
  { 
    id: "rush", 
    name: "Rush Delivery", 
    time: "15-25 minutes", 
    price: "+$7.99",
    description: "Fastest delivery available"
  }
];

export const DeliveryDetailsForm = ({ data, onNext, onBack }: DeliveryDetailsFormProps) => {
  const [formData, setFormData] = useState<DeliveryDetails>(data);
  const [errors, setErrors] = useState<Partial<DeliveryDetails>>({});

  const validateForm = () => {
    const newErrors: Partial<DeliveryDetails> = {};
    
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP code";
    }
    if (!formData.deliveryTime.trim()) newErrors.deliveryTime = "Delivery time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  const handleChange = (field: keyof DeliveryDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-card animate-fade-in">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Truck className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold">Delivery Details</CardTitle>
        <p className="text-muted-foreground">Where should we deliver your order?</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-primary" />
              <Label className="text-base font-medium">Delivery Address</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className={errors.address ? "border-red-500" : ""}
                placeholder="123 Main Street, Apt 4B"
              />
              {errors.address && (
                <p className="text-red-500 text-xs">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className={errors.city ? "border-red-500" : ""}
                  placeholder="New York"
                />
                {errors.city && (
                  <p className="text-red-500 text-xs">{errors.city}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleChange("zipCode", e.target.value)}
                  className={errors.zipCode ? "border-red-500" : ""}
                  placeholder="10001"
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-xs">{errors.zipCode}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryInstructions">Delivery Instructions (Optional)</Label>
              <Textarea
                id="deliveryInstructions"
                value={formData.deliveryInstructions}
                onChange={(e) => handleChange("deliveryInstructions", e.target.value)}
                placeholder="Ring doorbell, leave at door, call when arrived..."
                rows={2}
              />
            </div>
          </div>

          {/* Delivery Priority Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-primary" />
              <Label className="text-base font-medium">Delivery Priority</Label>
            </div>

            <RadioGroup
              value={formData.priority}
              onValueChange={(value) => handleChange("priority", value)}
              className="space-y-3"
            >
              {priorityOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label 
                    htmlFor={option.id} 
                    className="flex-1 cursor-pointer p-3 rounded-lg border transition-colors hover:bg-orange-light/50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{option.name}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{option.time}</div>
                        <div className="text-sm text-primary font-medium">{option.price}</div>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Preferred Delivery Time */}
          <div className="space-y-2">
            <Label htmlFor="deliveryTime">Preferred Delivery Time</Label>
            <Input
              id="deliveryTime"
              type="time"
              value={formData.deliveryTime}
              onChange={(e) => handleChange("deliveryTime", e.target.value)}
              className={errors.deliveryTime ? "border-red-500" : ""}
            />
            {errors.deliveryTime && (
              <p className="text-red-500 text-xs">{errors.deliveryTime}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              onClick={onBack}
              variant="outline" 
              size="lg"
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              type="submit" 
              variant="gradient" 
              size="lg"
              className="flex-1"
            >
              Review Order
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};