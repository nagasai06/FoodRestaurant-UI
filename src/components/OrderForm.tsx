import { useState } from "react";
import axios from "axios";
import { ProgressSteps } from "./ProgressSteps";
import { UserDetailsForm } from "./forms/UserDetailsForm";
import { FoodDetailsForm } from "./forms/FoodDetailsForm";
import { DeliveryDetailsForm } from "./forms/DeliveryDetailsForm";
import { ReviewForm } from "./forms/ReviewForm";

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

const initialData: FormData = {
  userDetails: {
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  },
  foodDetails: {
    category: "pizza",
    items: [],
    specialRequests: "",
    totalPrice: 0
  },
  deliveryDetails: {
    address: "",
    city: "",
    zipCode: "",
    deliveryInstructions: "",
    priority: "standard",
    deliveryTime: ""
  }
};

export const OrderForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  const steps = ["Personal", "Food", "Delivery", "Review"];

  const handleUserDetailsNext = (data: FormData["userDetails"]) => {
    setFormData(prev => ({ ...prev, userDetails: data }));
    setCurrentStep(1);
  };

  const handleFoodDetailsNext = (data: FormData["foodDetails"]) => {
    setFormData(prev => ({ ...prev, foodDetails: data }));
    setCurrentStep(2);
  };

  const handleDeliveryDetailsNext = (data: FormData["deliveryDetails"]) => {
    setFormData(prev => ({ ...prev, deliveryDetails: data }));
    setCurrentStep(3);
  };

  const handleOrderSubmit = async (data: FormData) => {
    try {
      // Here you would make the actual API call to your backend
      const response = await axios.post('/api/orders', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        setIsOrderComplete(true);
      } else {
        throw new Error('Failed to submit order');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      // Error handling is done in the ReviewForm component
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isOrderComplete) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-green-fresh rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. You'll receive a confirmation email shortly.
          </p>
          <button
            onClick={() => {
              setCurrentStep(0);
              setFormData(initialData);
              setIsOrderComplete(false);
            }}
            className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="max-w-4xl mx-auto py-8">
        <ProgressSteps currentStep={currentStep} steps={steps} />
        
        <div className="mt-8">
          {currentStep === 0 && (
            <UserDetailsForm
              data={formData.userDetails}
              onNext={handleUserDetailsNext}
            />
          )}
          
          {currentStep === 1 && (
            <FoodDetailsForm
              data={formData.foodDetails}
              onNext={handleFoodDetailsNext}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 2 && (
            <DeliveryDetailsForm
              data={formData.deliveryDetails}
              onNext={handleDeliveryDetailsNext}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 3 && (
            <ReviewForm
              data={formData}
              onBack={handleBack}
              onSubmit={handleOrderSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};