// src/pages/api/create-stripe-session.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { item } = req.body;
    const transformedItem = {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name || 'Chatbot Premium Subscription',
        },
        unit_amount: item.price ? item.price * 100 : 999, // price in cents
      },
      quantity: item.quantity || 1,
    };

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const successUrl = `${protocol}://${host}/?status=success`;
    const cancelUrl = `${protocol}://${host}/?status=cancel`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [transformedItem],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.status(200).json({ id: session.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
