// src/pages/payment.tsx
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const item = {
      name: 'Chatbot Premium Subscription',
      price: 19.99, // dollars
      quantity: 1,
    };

    try {
      const { data } = await axios.post('/api/create-stripe-session', { item });
      const stripe = await stripePromise;
      const result = await stripe?.redirectToCheckout({ sessionId: data.id });
      if (result?.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error('Error creating Stripe session:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl mb-4">Payment Page</h1>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        {loading ? 'Processing...' : 'Buy Premium Subscription'}
      </button>
    </div>
  );
}
