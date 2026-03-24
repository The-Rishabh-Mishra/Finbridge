import mongoose from 'mongoose';

const fraudMessageSchema = new mongoose.Schema(
  {
    message: { type: String, required: true, trim: true },
    riskScore: { type: Number, required: true, min: 0, max: 100 },
    status: { type: String, required: true, enum: ['Safe', 'Suspicious', 'Fraud'] },
    reasons: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

const FraudMessage = mongoose.model('FraudMessage', fraudMessageSchema);
export default FraudMessage;
