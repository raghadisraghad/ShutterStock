import asyncHandler from 'express-async-handler';
import stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

const addStripe = asyncHandler(async (req, res) => {
    const { products } = req.body;
    try {
        const lineItems = products.map((product) => ({
            price_data: {
                currency: 'MAD',
                product_data: {
                    name: product.title,
                    // images: [product.picture],
                },
                unit_amount: Math.round(product.total * 100),
            },
            quantity: 1,
        }));

        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.FRONT}success`,
            cancel_url: `${process.env.FRONT}cart`,
        });

        res.json({ data: { id: session.id } });
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        res.status(500).json({ message: 'Failed to create payment session.' });
    }
});

export { addStripe };
