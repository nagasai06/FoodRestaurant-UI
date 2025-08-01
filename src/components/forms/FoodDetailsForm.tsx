import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Pizza, Salad, Coffee, IceCream } from "lucide-react";

interface FoodDetails {
  category: string;
  items: string[];
  specialRequests: string;
  totalPrice: number;
}

interface FoodDetailsFormProps {
  data: FoodDetails;
  onNext: (data: FoodDetails) => void;
  onBack: () => void;
}

const foodCategories = [
  { id: "pizza", name: "Pizza", icon: Pizza, items: ["Margherita", "Pepperoni", "Vegetarian", "Meat Lovers"], prices: [12.99, 15.99, 13.99, 18.99] },
  { id: "salads", name: "Salads", icon: Salad, items: ["Caesar Salad", "Greek Salad", "Garden Salad", "Chicken Salad"], prices: [8.99, 9.99, 7.99, 11.99] },
  { id: "beverages", name: "Beverages", icon: Coffee, items: ["Coke", "Sprite", "Orange Juice", "Iced Tea"], prices: [2.99, 2.99, 3.99, 3.49] },
  { id: "desserts", name: "Desserts", icon: IceCream, items: ["Chocolate Cake", "Ice Cream", "Cheesecake", "Tiramisu"], prices: [5.99, 4.99, 6.99, 7.99] }
];

export const FoodDetailsForm = ({ data, onNext, onBack }: FoodDetailsFormProps) => {
  const [formData, setFormData] = useState<FoodDetails>(data);
  const [selectedCategory, setSelectedCategory] = useState(data.category || "pizza");

  const currentCategory = foodCategories.find(cat => cat.id === selectedCategory);

  const toggleItem = (item: string, price: number) => {
    const isSelected = formData.items.includes(item);
    let newItems: string[];
    let newPrice = formData.totalPrice;

    if (isSelected) {
      newItems = formData.items.filter(i => i !== item);
      newPrice -= price;
    } else {
      newItems = [...formData.items, item];
      newPrice += price;
    }

    setFormData(prev => ({
      ...prev,
      items: newItems,
      totalPrice: Math.max(0, newPrice)
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setFormData(prev => ({
      ...prev,
      category: categoryId
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.items.length > 0) {
      onNext(formData);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-card animate-fade-in">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <UtensilsCrossed className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold">Choose Your Food</CardTitle>
        <p className="text-muted-foreground">Select delicious items from our menu</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Food Categories</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {foodCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryChange(category.id)}
                  className={`p-4 rounded-lg border text-center transition-all hover:shadow-md ${
                    selectedCategory === category.id
                      ? "border-primary bg-orange-light shadow-card"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <category.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Food Items */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              {currentCategory?.name} Items
            </Label>
            <div className="grid gap-3">
              {currentCategory?.items.map((item, index) => {
                const isSelected = formData.items.includes(item);
                const price = currentCategory.prices[index];
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleItem(item, price)}
                    className={`p-4 rounded-lg border text-left transition-all hover:shadow-md ${
                      isSelected
                        ? "border-primary bg-orange-light shadow-card"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item}</span>
                      <Badge variant={isSelected ? "default" : "secondary"}>
                        ${price}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Items Summary */}
          {formData.items.length > 0 && (
            <div className="p-4 bg-orange-light rounded-lg">
              <h4 className="font-medium mb-2">Selected Items ({formData.items.length})</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.items.map((item) => (
                  <Badge key={item} variant="default">{item}</Badge>
                ))}
              </div>
              <p className="text-xl font-bold text-primary">
                Total: ${formData.totalPrice.toFixed(2)}
              </p>
            </div>
          )}

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                specialRequests: e.target.value
              }))}
              placeholder="Any allergies, dietary restrictions, or special instructions..."
              rows={3}
            />
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
              disabled={formData.items.length === 0}
            >
              Continue to Delivery
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};