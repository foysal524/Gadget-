const SSLCommerzPayment = require('sslcommerz-lts');
const { Order, User } = require('../models');

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.NODE_ENV === 'production';

exports.initiatePayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const user = await User.findOne({ where: { uid: req.user.uid } });
    const order = await Order.findOne({ where: { id: orderId, userId: user.id } });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' }
      });
    }

    const data = {
      total_amount: order.totalAmount,
      currency: 'BDT',
      tran_id: order.id,
      success_url: `${process.env.BACKEND_URL}/api/payment/success`,
      fail_url: `${process.env.BACKEND_URL}/api/payment/fail`,
      cancel_url: `${process.env.BACKEND_URL}/api/payment/cancel`,
      ipn_url: `${process.env.BACKEND_URL}/api/payment/ipn`,
      shipping_method: 'Courier',
      product_name: 'Order',
      product_category: 'Electronic',
      product_profile: 'general',
      cus_name: user.displayName || 'Customer',
      cus_email: user.email,
      cus_add1: order.shippingAddress,
      cus_city: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: order.phone || '01700000000',
      ship_name: user.displayName || 'Customer',
      ship_add1: order.shippingAddress,
      ship_city: 'Dhaka',
      ship_postcode: '1000',
      ship_country: 'Bangladesh'
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    if (apiResponse.GatewayPageURL) {
      res.json({
        success: true,
        data: { paymentUrl: apiResponse.GatewayPageURL }
      });
    } else {
      res.status(400).json({
        success: false,
        error: { code: 'PAYMENT_INIT_FAILED', message: 'Failed to initialize payment' }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.paymentSuccess = async (req, res) => {
  try {
    const { tran_id } = req.body;
    const order = await Order.findByPk(tran_id);

    if (order) {
      order.status = 'processing';
      order.paymentDetails = { ...order.paymentDetails, paid: true, transactionId: req.body.val_id };
      await order.save();
    }

    res.redirect(`${process.env.FRONTEND_URL}/payment-success?orderId=${tran_id}`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
};

exports.paymentFail = async (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
};

exports.paymentCancel = async (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/cart`);
};
