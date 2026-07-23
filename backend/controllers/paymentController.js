import { Payment } from '../models/Payment.js';
import { User } from '../models/User.js';
import { eventBus } from '../utils/eventBus.js';

export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.user.id })
      .populate('program', 'title')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { amount, programId, paymentMethod = 'stripe', transactionId } = req.body;

    const txId = transactionId || `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = await Payment.create({
      transactionId: txId,
      student: req.user.id,
      program: programId,
      amount,
      paymentMethod,
      status: 'completed',
      paidAt: new Date()
    });

    // Update user lifecycle to active learner upon payment
    await User.findByIdAndUpdate(req.user.id, { lifecycleStage: 'active_learner' });

    // Emit domain event for automatic synchronization
    eventBus.emit('PaymentCompleted', {
      studentId: req.user.id,
      amount,
      transactionId: txId,
      programId
    });

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
