const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * @route   POST /api/payment/create-order
 * @desc    Create a Razorpay order
 * @access  Public / Authenticated
 */
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body; // Expect amount in INR (e.g. 250 for ₹250)

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid amount is required',
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise (1 INR = 100 paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating Razorpay order',
    });
  }
});

/**
 * @route   POST /api/payment/verify
 * @desc    Verify Razorpay payment signature
 * @access  Public / Authenticated
 */
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required Razorpay payment verification fields',
      });
    }

    // Generate expected HMAC-SHA256 signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    const isAuthentic = expectedSign === razorpay_signature;

    if (isAuthentic) {
      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid signature',
      });
    }
  } catch (error) {
    console.error('Razorpay Verification Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during payment verification',
    });
  }
});

module.exports = router;